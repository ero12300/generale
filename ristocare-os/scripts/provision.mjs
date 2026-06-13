#!/usr/bin/env node
/**
 * Provisioning RistoCare OS — Supabase + Vercel
 *
 * Variabili richieste (secrets Cursor Cloud o shell):
 * - SUPABASE_ACCESS_TOKEN  → https://supabase.com/dashboard/account/tokens
 * - VERCEL_TOKEN           → https://vercel.com/account/settings/tokens
 *
 * Opzionali:
 * - VERCEL_TEAM_ID         → default team eros' projects
 * - RESEND_API_KEY         → https://resend.com/api-keys
 * - CONTACT_NOTIFY_EMAIL   → default info@ristocare.it
 * - DEPLOY_BRANCH          → default cursor/ristocare-os-mvp-64b3
 *
 * Uso: node ristocare-os/scripts/provision.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const WEB = resolve(ROOT, "apps/web");

const SUPABASE_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "team_5SBu2hnGswyjDY2Ne8WVZ6fL";
const PROJECT_NAME = "ristocare-os";
const GITHUB_REPO = process.env.GITHUB_REPO || "ero12300/generale";
const SUPABASE_REF = process.env.SUPABASE_PROJECT_REF || "itpchwzqecitaxvbovwd";
const DEPLOY_BRANCH = process.env.DEPLOY_BRANCH || "cursor/ristocare-os-mvp-64b3";

const PUBLIC_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: `https://${SUPABASE_REF}.supabase.co`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cGNod3pxZWNpdGF4dmJvdndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTYxODUsImV4cCI6MjA5Njg3MjE4NX0.KGxYd8SmH3QO5vUW1zqo8yMr-uUReMnC6pow8-MMiZ8",
  NEXT_PUBLIC_APP_URL: `https://${PROJECT_NAME}.vercel.app`,
  EMAIL_FROM: process.env.EMAIL_FROM || "RistoCare OS <onboarding@resend.dev>",
  CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL || "info@ristocare.it",
};

function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Manca ${name}. Aggiungilo ai secrets Cloud Agent o esportalo in shell.`);
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
  if (!res.ok) throw new Error(`Supabase API ${path}: ${res.status} ${JSON.stringify(data)}`);
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
  if (!res.ok) throw new Error(`Vercel API ${path}: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

async function configureSupabaseAuth(siteUrl) {
  console.log("\n📦 Supabase: auth redirect URLs...");
  const redirectUrls = [
    `${siteUrl}/auth/callback`,
    "http://localhost:3001/auth/callback",
  ];
  await supabaseFetch(`/projects/${SUPABASE_REF}/config/auth`, {
    method: "PATCH",
    body: JSON.stringify({
      site_url: siteUrl,
      uri_allow_list: redirectUrls.join(","),
    }),
  });
  console.log("   ✓ Site URL e redirect configurati");
}

async function fetchSupabaseKeys() {
  const keys = await supabaseFetch(`/projects/${SUPABASE_REF}/api-keys`);
  const anon = keys?.find((k) => k.name === "anon");
  const service = keys?.find((k) => k.name === "service_role");
  return {
    anonKey: anon?.api_key ?? PUBLIC_ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: service?.api_key,
  };
}

async function provisionVercel(keys) {
  console.log("\n🚀 Vercel: progetto e variabili...");

  let project;
  const { projects } = await vercelFetch("/v9/projects");
  project = projects?.find((p) => p.name === PROJECT_NAME);

  if (!project) {
    project = await vercelFetch("/v11/projects", {
      method: "POST",
      body: JSON.stringify({
        name: PROJECT_NAME,
        framework: "nextjs",
        rootDirectory: "ristocare-os/apps/web",
        installCommand: "cd ../.. && pnpm install --frozen-lockfile",
        buildCommand: "cd ../.. && pnpm build",
        gitRepository: { type: "github", repo: GITHUB_REPO },
      }),
    });
    console.log(`   ✓ Progetto creato: ${project.id}`);
  } else {
    console.log(`   ✓ Progetto esistente: ${project.id}`);
  }

  const productionUrl = PUBLIC_ENV.NEXT_PUBLIC_APP_URL;
  const envVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: PUBLIC_ENV.NEXT_PUBLIC_SUPABASE_URL },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: keys.anonKey },
    { key: "NEXT_PUBLIC_APP_URL", value: productionUrl },
    { key: "EMAIL_FROM", value: PUBLIC_ENV.EMAIL_FROM },
    { key: "CONTACT_NOTIFY_EMAIL", value: PUBLIC_ENV.CONTACT_NOTIFY_EMAIL },
  ];

  if (keys.serviceRoleKey) {
    envVars.push({ key: "SUPABASE_SERVICE_ROLE_KEY", value: keys.serviceRoleKey });
  }
  if (process.env.RESEND_API_KEY) {
    envVars.push({ key: "RESEND_API_KEY", value: process.env.RESEND_API_KEY });
  }

  for (const item of envVars) {
    if (!item.value) continue;
    await vercelFetch(`/v10/projects/${project.id}/env`, {
      method: "POST",
      body: JSON.stringify({
        key: item.key,
        value: item.value,
        type: item.key.includes("KEY") ? "encrypted" : "plain",
        target: ["production", "preview", "development"],
      }),
    }).catch(() => console.warn(`   ⚠ Env ${item.key} già presente`));
  }
  console.log("   ✓ Variabili ambiente impostate");

  console.log("   → Deploy produzione...");
  const deployment = await vercelFetch("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: PROJECT_NAME,
      project: project.id,
      target: "production",
      gitSource: {
        type: "github",
        repo: GITHUB_REPO,
        ref: DEPLOY_BRANCH,
      },
    }),
  });

  const url = deployment?.url ? `https://${deployment.url}` : productionUrl;
  console.log(`   ✓ Deploy avviato: ${url}`);

  const vercelDir = resolve(WEB, ".vercel");
  mkdirSync(vercelDir, { recursive: true });
  writeFileSync(
    resolve(vercelDir, "project.json"),
    JSON.stringify({ orgId: VERCEL_TEAM_ID, projectId: project.id }, null, 2)
  );

  return { projectId: project.id, url };
}

function writeLocalEnv(keys) {
  const lines = [
    `NEXT_PUBLIC_SUPABASE_URL=${PUBLIC_ENV.NEXT_PUBLIC_SUPABASE_URL}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${keys.anonKey}`,
    `NEXT_PUBLIC_APP_URL=http://localhost:3001`,
    `EMAIL_FROM=${PUBLIC_ENV.EMAIL_FROM}`,
    `CONTACT_NOTIFY_EMAIL=${PUBLIC_ENV.CONTACT_NOTIFY_EMAIL}`,
  ];
  if (keys.serviceRoleKey) lines.push(`SUPABASE_SERVICE_ROLE_KEY=${keys.serviceRoleKey}`);
  if (process.env.RESEND_API_KEY) lines.push(`RESEND_API_KEY=${process.env.RESEND_API_KEY}`);

  writeFileSync(resolve(WEB, ".env.local"), `${lines.join("\n")}\n`);
  console.log("\n📝 Creato apps/web/.env.local (non committato)");
}

async function main() {
  console.log("=== RistoCare OS — Provisioning ===\n");
  requireEnv("SUPABASE_ACCESS_TOKEN", SUPABASE_TOKEN);
  requireEnv("VERCEL_TOKEN", VERCEL_TOKEN);

  const keys = await fetchSupabaseKeys();
  await configureSupabaseAuth(PUBLIC_ENV.NEXT_PUBLIC_APP_URL);
  const vercel = await provisionVercel(keys);
  writeLocalEnv(keys);

  console.log("\n✅ Completato!");
  console.log(`   App:      ${vercel.url}`);
  console.log(`   Supabase: ${PUBLIC_ENV.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`   Login:    ${vercel.url}/login`);
  console.log(`   Signup:   ${vercel.url}/signup`);
  if (!process.env.RESEND_API_KEY) {
    console.log("\nℹ️  RESEND_API_KEY non impostata — le email sono in modalità log-only.");
  }
}

main().catch((err) => {
  console.error("\n❌ Errore:", err.message);
  process.exit(1);
});
