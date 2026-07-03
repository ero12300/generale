import type { DataStore } from "./interface";
import { DemoStore } from "./demo-store";

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

let storeInstance: DataStore | null = null;

/** Restituisce lo store attivo: Firestore se configurato, altrimenti demo in-memory. */
export async function getStore(): Promise<DataStore> {
  if (storeInstance) return storeInstance;
  if (isFirebaseConfigured()) {
    // Import dinamico intenzionale: evita di caricare firebase-admin
    // (e le sue credenziali) quando l'app gira in modalità demo.
    const { FirestoreStore } = await import("./firestore-store");
    storeInstance = new FirestoreStore();
  } else {
    storeInstance = new DemoStore();
  }
  return storeInstance;
}
