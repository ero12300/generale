"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseClientConfig, isFirebaseConfigured } from "@/lib/env";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function getFirebase() {
  if (!isFirebaseConfigured) return { app: null, auth: null, db: null };
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseClientConfig as any);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}
