#!/usr/bin/env node
/**
 * Provisioning automatico Configuratore Porte su Vercel
 *
 * Richiede: VERCEL_TOKEN (https://vercel.com/account/settings/tokens)
 *
 * Uso: VERCEL_TOKEN=xxx node scripts/provision-porte.mjs
 *   oppure: pnpm provision:porte
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "team_5SBu2hnGswyjDY2Ne8WVZ6fL";
const PROJECT_NAME = process.env.PORTE_PROJECT_NAME || "configuratore-porte";
const GITHUB_REPO = process.env.GITHUB_REPO || "https://github.com/ero12300/generale";
const ROOT_DIR = "apps/porte";

function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Manca ${name}`);
    console.error("   export VERCEL_TOKEN=xxx && pnpm provision:porte");
    process.exit(1);
  }
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

async function main() {
  console.log("=== Configuratore Porte — Deploy Vercel ===\n");
  requireEnv("VERCEL_TOKEN", VERCEL_TOKEN);

  let project;
  const { projects } = await vercelFetch("/v9/projects");
  project = projects?.find((p) => p.name === PROJECT_NAME);

  if (!project) {
    console.log("📦 Creazione progetto Vercel...");
    project = await vercelFetch("/v11/projects", {
      method: "POST",
      body: JSON.stringify({
        name: PROJECT_NAME,
        framework: "nextjs",
        rootDirectory: ROOT_DIR,
        gitRepository: {
          type: "github",
          repo: GITHUB_REPO.replace("https://github.com/", ""),
        },
      }),
    });
    console.log(`   ✓ Progetto creato: ${project.id}`);
  } else {
    console.log(`   ✓ Progetto esistente: ${project.id}`);
    await vercelFetch(`/v9/projects/${project.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        rootDirectory: ROOT_DIR,
        framework: "nextjs",
      }),
    });
    console.log(`   ✓ Root directory impostata: ${ROOT_DIR}`);
  }

  console.log("🚀 Avvio deploy produzione...");
  const { execSync } = await import("node:child_process");
  const { mkdirSync, writeFileSync } = await import("node:fs");
  const { resolve, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");

  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  mkdirSync(resolve(root, ".vercel"), { recursive: true });
  writeFileSync(
    resolve(root, ".vercel/project.json"),
    JSON.stringify({ orgId: VERCEL_TEAM_ID, projectId: project.id })
  );

  execSync("pnpm dlx vercel@latest deploy --prod --yes", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, VERCEL_TOKEN },
  });

  const refreshed = await vercelFetch(`/v9/projects/${project.id}`);
  const alias =
    refreshed?.alias?.[0]?.domain ||
    refreshed?.targets?.production?.alias?.[0] ||
    `${PROJECT_NAME}.vercel.app`;
  const url = alias.startsWith("http") ? alias : `https://${alias}`;

  try {
    await vercelFetch(`/v10/projects/${project.id}/env`, {
      method: "POST",
      body: JSON.stringify({
        key: "NEXT_PUBLIC_APP_URL",
        value: url,
        type: "plain",
        target: ["production", "preview"],
      }),
    });
  } catch {
    /* env may already exist */
  }

  console.log("\n✅ Deploy completato!");
  console.log(`   URL:       ${url}`);
  console.log(`   Dashboard: https://vercel.com/eros-projects-1943e19f/${PROJECT_NAME}`);
  console.log(`   Project ID: ${project.id}`);
}

main().catch((err) => {
  console.error("\n❌ Errore:", err.message);
  process.exit(1);
});
