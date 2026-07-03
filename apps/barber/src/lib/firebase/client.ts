"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Restituisce un client Firebase se le variabili d'ambiente sono configurate.
 * Se manca anche una sola variabile essenziale ritorna `null` e l'app
 * userà il demo store in-memory.
 */
export type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let cached: FirebaseClient | null | undefined;

export function getFirebase(): FirebaseClient | null {
  if (cached !== undefined) return cached;

  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const required: Array<keyof typeof cfg> = [
    "apiKey",
    "authDomain",
    "projectId",
    "appId",
  ];
  const missing = required.filter((k) => !cfg[k]);
  if (missing.length > 0) {
    cached = null;
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.info(
        "[BarberPro] Firebase non configurato — uso modalità demo. Mancano:",
        missing.join(", ")
      );
    }
    return null;
  }

  const app = getApps()[0] ?? initializeApp(cfg);
  cached = { app, auth: getAuth(app), db: getFirestore(app) };
  return cached;
}

export function isFirebaseEnabled(): boolean {
  return getFirebase() !== null;
}
