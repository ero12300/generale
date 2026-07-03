"use client";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function firebaseConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

export function fbApp(): FirebaseApp | null {
  if (!firebaseConfigured()) return null;
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  return _app;
}

export function fbAuth(): Auth | null {
  if (!firebaseConfigured()) return null;
  if (_auth) return _auth;
  const app = fbApp();
  if (!app) return null;
  _auth = getAuth(app);
  return _auth;
}

export function fbDb(): Firestore | null {
  if (!firebaseConfigured()) return null;
  if (_db) return _db;
  const app = fbApp();
  if (!app) return null;
  _db = getFirestore(app);
  return _db;
}
