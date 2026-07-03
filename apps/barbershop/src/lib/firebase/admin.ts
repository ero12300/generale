/**
 * Firebase Admin SDK (server).
 * Usato dalle API route per verificare i token e scrivere su Firestore in sicurezza.
 * Attivo solo se le variabili FIREBASE_* server sono configurate.
 */
import {
  getApps,
  initializeApp,
  cert,
  getApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

let adminApp: App | null = null;

export function getAdminApp(): App | null {
  if (!isAdminConfigured()) return null;
  if (!adminApp) {
    adminApp = getApps().length
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Le chiavi private nelle env hanno i newline come "\n" letterali.
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });
  }
  return adminApp;
}

export function getAdminDb(): Firestore | null {
  const a = getAdminApp();
  return a ? getFirestore(a) : null;
}
