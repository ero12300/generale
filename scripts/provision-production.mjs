#!/usr/bin/env node
/**
 * Provisioning produzione Deal Desk Immobiliare
 *
 * Richiede (come variabili d'ambiente o secrets Cursor Cloud):
 * - SUPABASE_ACCESS_TOKEN  → https://supabase.com/dashboard/account/tokens
 * - VERCEL_TOKEN           → https://vercel.com/account/settings/tokens
 * - VERCEL_TEAM_ID         → team_5SBu2hnGswyjDY2Ne8WVZ6fL (eros' projects) o il tuo
 *
 * Uso: node scripts/provision-production.mjs
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SUPABASE_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "team_5SBu2hnGswyjDY2Ne8WVZ6fL";
const PROJECT_NAME = process.env.DEAL_DESK_PROJECT_NAME || "deal-desk-immobiliare";
const GITHUB_REPO = process.env.GITHUB_REPO || "https://github.com/ero12300/generale";

function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Manca ${name}. Aggiungilo ai secrets dell'agente Cloud o al file .env.provision`);
    process.exit(1);
  }
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`https://api.supabase.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${SUPABASE_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Supabase API ${path}: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function vercelFetch(path, options = {}) {
  const url = new URL(`https://api.vercel.com${path}`);
  if (VERCEL_TEAM_ID) url.searchParams.set("teamId", VERCEL_TEAM_ID);
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Vercel API ${path}: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function provisionSupabase() {
  console.log("\n📦 Supabase: creazione/riuso progetto...");

  const orgs = await supabaseFetch("/organizations");
  const org = orgs?.[0];
  if (!org?.id) throw new Error("Nessuna organizzazione Supabase trovata");

  let project;
  const existing = await supabaseFetch("/projects");
  project = existing?.find((p) => p.name === PROJECT_NAME);

  if (!project) {
    const dbPass = randomBytes(24).toString("base64url");
    project = await supabaseFetch("/projects", {
      method: "POST",
      body: JSON.stringify({
        organization_id: org.id,
        name: PROJECT_NAME,
        region: "eu-west-1",
        db_pass: dbPass,
      }),
    });
    console.log(`   ✓ Progetto creato: ${project.id}`);
    console.log("   ⏳ Attendo avvio database (90s)...");
    await new Promise((r) => setTimeout(r, 90000));
  } else {
    console.log(`   ✓ Progetto esistente: ${project.id}`);
  }

  const keys = await supabaseFetch(`/projects/${project.ref}/api-keys`);
  const anon = keys?.find((k) => k.name === "anon" || k.name === "anon key");
  const service = keys?.find((k) => k.name === "service_role");

  const migrationPath = resolve(ROOT, "supabase/migrations/20250605000000_initial_schema.sql");
  const sql = readFileSync(migrationPath, "utf8");

  console.log("   → Applicazione migrazione SQL...");
  await supabaseFetch(`/projects/${project.ref}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: sql }),
  }).catch(async (err) => {
    console.warn("   ⚠ Migrazione via API fallita (forse già applicata):", err.message);
    console.warn("   Esegui manualmente il file SQL nell'SQL Editor Supabase se necessario.");
  });

  const supabaseUrl = `https://${project.ref}.supabase.co`;
  return {
    supabaseUrl,
    anonKey: anon?.api_key,
    serviceRoleKey: service?.api_key,
    projectRef: project.ref,
  };
}

async function provisionVercel(env) {
  console.log("\n🚀 Vercel: progetto e variabili...");

  let project;
  const projects = await vercelFetch("/v9/projects");
  project = projects?.projects?.find((p) => p.name === PROJECT_NAME);

  if (!project) {
    project = await vercelFetch("/v11/projects", {
      method: "POST",
      body: JSON.stringify({
        name: PROJECT_NAME,
        framework: "nextjs",
        rootDirectory: "apps/web",
        gitRepository: {
          type: "github",
          repo: GITHUB_REPO.replace("https://github.com/", ""),
        },
      }),
    });
    console.log(`   ✓ Progetto creato: ${project.id}`);
  } else {
    console.log(`   ✓ Progetto esistente: ${project.id}`);
  }

  const productionUrl = `https://${PROJECT_NAME}.vercel.app`;
  const envVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: env.supabaseUrl, target: ["production", "preview"] },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: env.anonKey, target: ["production", "preview"] },
    { key: "ANALYTICS_API_URL", value: env.analyticsUrl || "http://localhost:8000", target: ["production", "preview"] },
    {
      key: "ANALYTICS_ALLOWED_ORIGINS",
      value: `${productionUrl},http://localhost:3000`,
      target: ["production", "preview"],
    },
    {
      key: "INTAKE_ALLOWED_ORIGINS",
      value: `${productionUrl},http://localhost:3000`,
      target: ["production", "preview"],
    },
  ];

  if (env.serviceRoleKey) {
    envVars.push({
      key: "SUPABASE_SERVICE_ROLE_KEY",
      value: env.serviceRoleKey,
      target: ["production"],
    });
  }

  for (const item of envVars) {
    if (!item.value) continue;
    await vercelFetch(`/v10/projects/${project.id}/env`, {
      method: "POST",
      body: JSON.stringify({
        key: item.key,
        value: item.value,
        type: item.key.includes("KEY") || item.key.includes("TOKEN") ? "encrypted" : "plain",
        target: item.target,
      }),
    }).catch(() => {
      console.warn(`   ⚠ Env ${item.key} già presente o non aggiornato`);
    });
  }

  console.log("   → Deploy produzione...");
  const deployment = await vercelFetch("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: PROJECT_NAME,
      project: project.id,
      target: "production",
      gitSource: {
        type: "github",
        repo: GITHUB_REPO.replace("https://github.com/", ""),
        ref: process.env.DEPLOY_BRANCH || "main",
      },
    }),
  });

  const url = deployment?.url ? `https://${deployment.url}` : productionUrl;
  console.log(`   ✓ Deploy avviato: ${url}`);
  return { projectId: project.id, url };
}

async function main() {
  console.log("=== Deal Desk — Provisioning produzione ===\n");

  requireEnv("SUPABASE_ACCESS_TOKEN", SUPABASE_TOKEN);
  requireEnv("VERCEL_TOKEN", VERCEL_TOKEN);

  const supabase = await provisionSupabase();
  const vercel = await provisionVercel({
    ...supabase,
    analyticsUrl: process.env.ANALYTICS_API_URL,
  });

  console.log("\n✅ Completato!");
  console.log(`   App:      ${vercel.url}`);
  console.log(`   Supabase: ${supabase.supabaseUrl}`);
  console.log(`   Dashboard auth: ${vercel.url}/signup`);
  console.log("\n⚠ Deploya anche analytics su Render (render.yaml) e imposta ANALYTICS_API_URL su Vercel.");
}

main().catch((err) => {
  console.error("\n❌ Errore:", err.message);
  process.exit(1);
});
