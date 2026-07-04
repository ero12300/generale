"use client";

import type { Progetto } from "./door/types";

const KEY = "portacalc.progetti.v1";

export function caricaProgetti(): Progetto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Progetto[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function salvaTutti(progetti: Progetto[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(progetti));
}

export function salvaProgetto(progetto: Progetto): Progetto[] {
  const progetti = caricaProgetti();
  const idx = progetti.findIndex((p) => p.id === progetto.id);
  if (idx >= 0) {
    progetti[idx] = progetto;
  } else {
    progetti.unshift(progetto);
  }
  salvaTutti(progetti);
  return progetti;
}

export function eliminaProgetto(id: string): Progetto[] {
  const progetti = caricaProgetti().filter((p) => p.id !== id);
  salvaTutti(progetti);
  return progetti;
}
