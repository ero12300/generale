import type { AppState, PersistenceAdapter, StateKey } from "./state";

const STORAGE_KEY = "barber-suite-state-v1";

export function createLocalAdapter(): PersistenceAdapter {
  let cache: AppState | null = null;

  function read(): AppState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AppState) : null;
    } catch {
      return null;
    }
  }

  function write(state: AppState): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota piena o storage disabilitato: lo stato resta in memoria
    }
  }

  return {
    mode: "demo",
    async load() {
      cache = read();
      return cache;
    },
    async save<K extends StateKey>(key: K, value: AppState[K]) {
      if (!cache) cache = read();
      if (!cache) return;
      cache = { ...cache, [key]: value };
      write(cache);
    },
    async reset(state: AppState) {
      cache = state;
      write(state);
    },
  };
}
