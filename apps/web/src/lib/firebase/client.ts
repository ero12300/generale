import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseWebConfig, isFirebaseConfigured } from "@/lib/firebase/config";

export function getFirebaseClientApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  return getApps()[0] ?? initializeApp(firebaseWebConfig);
}

export function getFirebaseServices() {
  const app = getFirebaseClientApp();
  if (!app) return null;

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
}
