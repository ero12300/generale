import type { WorkspaceData } from "../types";
import { buildSeedData } from "../seed";
import { getDb } from "../firebase/client";
import { firebaseEnabled } from "../firebase/config";

const LS_KEY = "barberpro:workspace:v1";

// ---- Persistenza locale (modalità demo) ----

export function loadLocal(): WorkspaceData {
  if (typeof window === "undefined") return buildSeedData();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) {
      const seed = buildSeedData();
      window.localStorage.setItem(LS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as WorkspaceData;
  } catch {
    return buildSeedData();
  }
}

export function saveLocal(data: WorkspaceData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // storage pieno o non disponibile: ignoriamo silenziosamente
  }
}

export function resetLocal(): WorkspaceData {
  const seed = buildSeedData();
  saveLocal(seed);
  return seed;
}

// ---- Persistenza Firestore (modalità reale) ----
// Salviamo l'intero workspace in un unico documento per utente: semplice e
// adatto ai volumi di un salone. Facilmente migrabile a collezioni separate.

export async function loadFirestore(uid: string): Promise<WorkspaceData> {
  const db = getDb();
  if (!db) return buildSeedData();
  const { doc, getDoc, setDoc } = await import("firebase/firestore");
  const ref = doc(db, "workspaces", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const seed = buildSeedData();
    await setDoc(ref, seed);
    return seed;
  }
  return snap.data() as WorkspaceData;
}

export async function saveFirestore(uid: string, data: WorkspaceData): Promise<void> {
  const db = getDb();
  if (!db) return;
  const { doc, setDoc } = await import("firebase/firestore");
  await setDoc(doc(db, "workspaces", uid), data);
}

export function isFirebaseMode(): boolean {
  return firebaseEnabled;
}
