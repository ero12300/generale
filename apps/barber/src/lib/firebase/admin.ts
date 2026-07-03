import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;

function loadServiceAccount(): Record<string, any> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    try {
      const json = Buffer.from(b64, "base64").toString("utf8");
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (json) {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
  return null;
}

export function getAdmin(): { app: App | null; db: Firestore | null; auth: Auth | null } {
  if (adminApp) {
    return { app: adminApp, db: getFirestore(adminApp), auth: getAuth(adminApp) };
  }
  const sa = loadServiceAccount();
  if (!sa) return { app: null, db: null, auth: null };
  adminApp =
    getApps()[0] ??
    initializeApp({
      credential: cert(sa as any),
    });
  return { app: adminApp, db: getFirestore(adminApp), auth: getAuth(adminApp) };
}

export function isAdminConfigured() {
  return loadServiceAccount() !== null;
}
