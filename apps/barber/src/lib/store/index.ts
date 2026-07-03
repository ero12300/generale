import type { DataStore } from "./types";
import { DemoStore } from "./demoStore";

let store: DataStore | null = null;

export function isDemoMode(): boolean {
  return !process.env.FIREBASE_SERVICE_ACCOUNT;
}

export async function getStore(): Promise<DataStore> {
  if (store) return store;
  if (isDemoMode()) {
    store = new DemoStore();
  } else {
    const { FirestoreStore } = await import("./firestoreStore");
    store = new FirestoreStore();
  }
  return store;
}
