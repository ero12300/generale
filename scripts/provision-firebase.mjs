#!/usr/bin/env node
/**
 * Provisioning Firebase per BarberPro
 * Richiede: firebase login (o FIREBASE_TOKEN) + VERCEL_TOKEN per env su Vercel
 *
 * Uso: node scripts/provision-firebase.mjs
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BARBER = resolve(ROOT, "apps/barber");

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "barberpro-eros";
const DISPLAY_NAME = process.env.FIREBASE_DISPLAY_NAME || "BarberPro";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "team_5SBu2hnGswyjDY2Ne8WVZ6fL";
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID_BARBER || "prj_b2vDuML82feYjnxEJwX4sHxn9dam";

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
}

async function vercelEnv(key, value) {
  if (!VERCEL_TOKEN) return;
  const url = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env?teamId=${VERCEL_TEAM_ID}`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      type: key.includes("PRIVATE_KEY") || key.includes("SECRET") ? "encrypted" : "plain",
      target: ["production", "preview"],
    }),
  }).catch(() => {});
}

async function main() {
  console.log("=== BarberPro — Provisioning Firebase ===\n");

  const firebase = "pnpm dlx firebase-tools@latest";

  try {
    run(`${firebase} projects:list`, { cwd: BARBER });
  } catch {
    console.error("❌ Firebase non autenticato. Esegui firebase login prima.");
    process.exit(1);
  }

  let projectExists = false;
  try {
    const list = run(`${firebase} projects:list --json`, { cwd: BARBER });
    const projects = JSON.parse(list);
    projectExists = projects?.results?.some((p) => p.projectId === PROJECT_ID);
  } catch {
    /* ignore */
  }

  if (!projectExists) {
    console.log(`📦 Creazione progetto ${PROJECT_ID}...`);
    run(`${firebase} projects:create ${PROJECT_ID} --display-name "${DISPLAY_NAME}"`, { cwd: BARBER });
  }

  run(`${firebase} use ${PROJECT_ID}`, { cwd: BARBER });

  console.log("🔥 Abilitazione Firestore...");
  try {
    run(`${firebase} firestore:databases:create --location=europe-west1 default`, { cwd: BARBER });
  } catch {
    console.log("   (database già esistente)");
  }

  console.log("📱 Creazione web app...");
  let appId;
  try {
    const out = run(
      `${firebase} apps:create web "BarberPro Web" --project ${PROJECT_ID} --json`,
      { cwd: BARBER }
    );
    appId = JSON.parse(out)?.appId;
  } catch {
    const list = run(`${firebase} apps:list WEB --project ${PROJECT_ID} --json`, { cwd: BARBER });
    const apps = JSON.parse(list);
    appId = apps?.results?.[0]?.appId;
  }

  const sdk = JSON.parse(
    run(`${firebase} apps:sdkconfig WEB ${appId} --project ${PROJECT_ID} --json`, { cwd: BARBER })
  );
  const cfg = sdk.sdkConfig;

  console.log("📜 Deploy regole Firestore...");
  run(`${firebase} deploy --only firestore:rules,firestore:indexes --project ${PROJECT_ID}`, {
    cwd: BARBER,
    stdio: "inherit",
  });

  console.log("☁️  Aggiornamento variabili Vercel...");
  const envMap = {
    NEXT_PUBLIC_FIREBASE_API_KEY: cfg.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: cfg.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: cfg.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: cfg.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: cfg.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: cfg.appId,
    FIREBASE_ADMIN_PROJECT_ID: cfg.projectId,
    NEXT_PUBLIC_APP_URL: "https://barberpro-seven.vercel.app",
  };

  for (const [key, value] of Object.entries(envMap)) {
    if (value) await vercelEnv(key, value);
  }

  writeFileSync(
    resolve(BARBER, ".env.production.local"),
    Object.entries(envMap)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n") + "\n"
  );

  console.log("\n✅ Firebase configurato!");
  console.log(`   Project: ${cfg.projectId}`);
  console.log("   ⚠ Abilita Email/Password in Firebase Console → Authentication → Sign-in method");
  console.log("   Poi redeploy: VERCEL_TOKEN=xxx pnpm provision:barber");
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
