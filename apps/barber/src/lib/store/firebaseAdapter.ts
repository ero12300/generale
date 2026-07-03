import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getFirebaseApp } from "../firebase";
import type { AppState, PersistenceAdapter, StateKey } from "./state";

const SHOP_ID = process.env.NEXT_PUBLIC_SHOP_ID ?? "default";

/**
 * Persistenza su Firestore: un documento per chiave di stato sotto
 * shops/{shopId}/state/{key}. Per il volume di una barberia (centinaia
 * di record) un documento-array per collezione è semplice e ben sotto
 * il limite di 1MB per documento. Vedi docs/adr/0001-barber-suite.md.
 */
export function createFirebaseAdapter(): PersistenceAdapter {
  const db = getFirestore(getFirebaseApp());

  function ref(key: StateKey) {
    return doc(db, "shops", SHOP_ID, "state", key);
  }

  return {
    mode: "firebase",
    async load() {
      const keys: StateKey[] = [
        "settings",
        "services",
        "barbers",
        "customers",
        "bookings",
        "sales",
        "campaigns",
      ];
      const snapshots = await Promise.all(keys.map((k) => getDoc(ref(k))));
      if (snapshots.some((s) => !s.exists())) return null;
      const state = {} as Record<StateKey, unknown>;
      keys.forEach((key, i) => {
        const data = snapshots[i].data() as { value: unknown };
        state[key] = data.value;
      });
      return state as unknown as AppState;
    },
    async save<K extends StateKey>(key: K, value: AppState[K]) {
      await setDoc(ref(key), { value, updatedAt: new Date().toISOString() });
    },
    async reset(state: AppState) {
      await Promise.all(
        (Object.keys(state) as StateKey[]).map((key) =>
          setDoc(ref(key), {
            value: state[key],
            updatedAt: new Date().toISOString(),
          }),
        ),
      );
    },
  };
}
