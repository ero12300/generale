import { isFirebaseConfigured } from "../firebase";
import type { DataStore } from "./datastore";
import { DemoStore } from "./demo-store";
import { FirestoreStore } from "./firestore-store";

let instance: DataStore | null = null;

export function getStore(): DataStore {
  if (!instance) {
    instance = isFirebaseConfigured() ? new FirestoreStore() : new DemoStore();
  }
  return instance;
}

export function isDemoMode(): boolean {
  return !isFirebaseConfigured();
}

export { generateId, generateReferralCode } from "./datastore";
export type { DataStore } from "./datastore";
