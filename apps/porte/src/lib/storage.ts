"use client";

import type { ConfigurazionePorta } from "./door-engine";

export interface ProgettoSalvato {
  id: string;
  nome: string;
  cliente?: string;
  creatoIl: string; // ISO
  aggiornatoIl: string;
  configurazione: ConfigurazionePorta;
}

const STORAGE_KEY = "porteforge.progetti.v1";

export function listaProgetti(): ProgettoSalvato[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProgettoSalvato[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function ottieniProgetto(id: string): ProgettoSalvato | null {
  return listaProgetti().find((p) => p.id === id) ?? null;
}

export function salvaProgetto(p: ProgettoSalvato): void {
  if (typeof window === "undefined") return;
  const attuali = listaProgetti().filter((x) => x.id !== p.id);
  attuali.unshift(p);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attuali.slice(0, 50)));
}

export function eliminaProgetto(id: string): void {
  if (typeof window === "undefined") return;
  const attuali = listaProgetti().filter((x) => x.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attuali));
}

export function generaId(): string {
  return "prg_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
