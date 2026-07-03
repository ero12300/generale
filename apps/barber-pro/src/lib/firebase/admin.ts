// Firebase Admin (server only). Usato dai webhook Stripe / route handler protetti.
// Se le credenziali service-account non sono configurate → export null: nessun crash.
import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let _adminApp: App | null = null;

export function adminApp(): App | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  if (_adminApp) return _adminApp;

  const existing = getApps();
  if (existing.length) {
    _adminApp = existing[0]!;
    return _adminApp;
  }
  try {
    const parsed = raw.trim().startsWith("{")
      ? JSON.parse(raw)
      : JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    _adminApp = initializeApp({ credential: cert(parsed) });
    return _adminApp;
  } catch (err) {
    console.warn("[barber-pro] Firebase admin init failed:", err);
    return null;
  }
}

export function adminDb(): Firestore | null {
  const app = adminApp();
  if (!app) return null;
  return getFirestore(app);
}
