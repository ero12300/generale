#!/usr/bin/env node
/**
 * Provisioning automatico BarberPro su Vercel
 *
 * Richiede: VERCEL_TOKEN (https://vercel.com/account/settings/tokens)
 * Opzionale: VERCEL_TEAM_ID (default team eros' projects)
 *
 * Uso: VERCEL_TOKEN=xxx node scripts/provision-barber.mjs
 *   oppure: pnpm provision:barber  (se VERCEL_TOKEN è in .env.provision)
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "team_5SBu2hnGswyjDY2Ne8WVZ6fL";
const PROJECT_NAME = process.env.BARBER_PROJECT_NAME || "barberpro";
const GITHUB_REPO = process.env.GITHUB_REPO || "https://github.com/ero12300/generale";
const ROOT_DIR = "apps/barber";

function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Manca ${name}`);
    console.error("   Aggiungilo ai secrets dell'agente Cloud Cursor:");
    console.error("   Cursor → Settings → Cloud → Secrets → VERCEL_TOKEN");
    console.error("   Oppure: export VERCEL_TOKEN=xxx && pnpm provision:barber");
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
  console.log("=== BarberPro — Deploy automatico Vercel ===\n");
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
  }

  console.log("🚀 Avvio deploy produzione...");
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
        repoId: undefined,
      },
    }),
  });

  const url = deployment?.url
    ? `https://${deployment.url}`
    : `https://${PROJECT_NAME}.vercel.app`;

  console.log("\n✅ Deploy avviato!");
  console.log(`   URL:        ${url}`);
  console.log(`   Dashboard:  ${url}/dashboard`);
  console.log(`   Prenotazioni: ${url}/book/fade-studio`);
  console.log(`   Project ID: ${project.id}`);
  console.log("\n   Aggiungi a GitHub Secrets per CI automatico:");
  console.log(`   VERCEL_PROJECT_ID_BARBER=${project.id}`);
}

main().catch((err) => {
  console.error("\n❌ Errore:", err.message);
  process.exit(1);
});
