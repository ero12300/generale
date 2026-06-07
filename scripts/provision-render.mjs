#!/usr/bin/env node
/**
 * Provisioning servizio analytics su Render
 *
 * Richiede: RENDER_API_KEY → https://dashboard.render.com/u/*/settings#api-keys
 *
 * Uso: RENDER_API_KEY=rnd_... node scripts/provision-render.mjs
 */

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const GITHUB_REPO = process.env.GITHUB_REPO || "https://github.com/ero12300/generale";
const BRANCH = process.env.DEPLOY_BRANCH || "main";
const SERVICE_NAME = process.env.RENDER_SERVICE_NAME || "deal-desk-analytics";
const VERCEL_URL = process.env.VERCEL_PRODUCTION_URL || "https://my-immobiliaregestionale.vercel.app";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "team_5SBu2hnGswyjDY2Ne8WVZ6fL";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "prj_6kNI5YPg3ZHepIgPEYQdytOsVAKq";

function requireEnv(name, value) {
  if (!value) {
    console.error(`❌ Manca ${name}. Ottienilo da https://dashboard.render.com/u/*/settings#api-keys`);
    process.exit(1);
  }
}

async function renderFetch(path, options = {}) {
  const res = await fetch(`https://api.render.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${RENDER_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
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
    throw new Error(`Render API ${path}: ${res.status} ${JSON.stringify(data)}`);
  }
  return data;
}

async function listServices() {
  const data = await renderFetch("/v1/services?limit=100");
  return data ?? [];
}

async function createService() {
  console.log("\n🐳 Render: creazione servizio analytics...");
  const body = {
    type: "web_service",
    name: SERVICE_NAME,
    ownerId: process.env.RENDER_OWNER_ID,
    repo: GITHUB_REPO,
    branch: BRANCH,
    rootDir: "",
    runtime: "docker",
    plan: "free",
    region: "frankfurt",
    autoDeploy: "yes",
    serviceDetails: {
      env: "docker",
      envSpecificDetails: {
        dockerCommand: "",
        dockerContext: "./services/analytics",
        dockerfilePath: "./services/analytics/Dockerfile",
      },
      healthCheckPath: "/health",
    },
    envVars: [
      {
        key: "ANALYTICS_ALLOWED_ORIGINS",
        value: `${VERCEL_URL},http://localhost:3000`,
      },
      { key: "LOG_LEVEL", value: "info" },
    ],
  };

  if (!body.ownerId) {
    const owners = await renderFetch("/v1/owners?limit=20");
    const owner = owners?.[0];
    if (!owner?.id) throw new Error("Nessun workspace Render trovato");
    body.ownerId = owner.id;
    console.log(`   Workspace: ${owner.name || owner.id}`);
  }

  const created = await renderFetch("/v1/services", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return created.service ?? created;
}

async function waitForLive(serviceId, maxAttempts = 40) {
  console.log("   ⏳ Attendo deploy (fino a ~10 min, free tier può essere lento)...");
  for (let i = 0; i < maxAttempts; i++) {
    const svc = await renderFetch(`/v1/services/${serviceId}`);
    const service = svc.service ?? svc;
    const url = service.serviceDetails?.url;
    if (url) {
      try {
        const health = await fetch(`${url}/health`, { signal: AbortSignal.timeout(15000) });
        if (health.ok) {
          const json = await health.json();
          if (json?.status === "ok") return url;
        }
      } catch {
        /* cold start / building */
      }
    }
    await new Promise((r) => setTimeout(r, 15000));
  }
  const svc = await renderFetch(`/v1/services/${serviceId}`);
  const service = svc.service ?? svc;
  return service.serviceDetails?.url;
}

async function updateVercelAnalyticsUrl(analyticsUrl) {
  if (!VERCEL_TOKEN || !analyticsUrl) return;
  console.log("\n🔗 Vercel: aggiorno ANALYTICS_API_URL...");
  const res = await fetch(
    `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: "ANALYTICS_API_URL",
        value: analyticsUrl,
        type: "plain",
        target: ["production", "preview", "development"],
      }),
    },
  );
  if (!res.ok) {
    console.warn("   ⚠ Imposta manualmente ANALYTICS_API_URL su Vercel:", analyticsUrl);
    return;
  }
  console.log("   ✓ ANALYTICS_API_URL aggiornato su Vercel");
}

async function main() {
  console.log("=== Deal Desk — Provisioning Render Analytics ===\n");
  requireEnv("RENDER_API_KEY", RENDER_API_KEY);

  let service;
  const existing = (await listServices()).find(
    (s) => (s.service?.name ?? s.name) === SERVICE_NAME,
  );
  if (existing) {
    service = existing.service ?? existing;
    console.log(`   ✓ Servizio esistente: ${service.id}`);
  } else {
    service = await createService();
    console.log(`   ✓ Servizio creato: ${service.id}`);
  }

  const url = await waitForLive(service.id);
  if (!url) {
    console.error("\n⚠ Deploy avviato ma /health non ancora raggiungibile.");
    console.error("   Controlla: https://dashboard.render.com");
    process.exit(1);
  }

  await updateVercelAnalyticsUrl(url);

  console.log("\n✅ Analytics online!");
  console.log(`   API:     ${url}`);
  console.log(`   Health:  ${url}/health`);
  console.log(`   Simula:  ${VERCEL_URL}/deals/new`);
}

main().catch((err) => {
  console.error("\n❌ Errore:", err.message);
  process.exit(1);
});
