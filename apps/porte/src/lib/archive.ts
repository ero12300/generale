"use client";

import type { SchedaProduzione } from "./door/types";

const KEY = "porte-pro:archivio:v1";

export interface VoceArchivio {
  id: string;
  salvataIl: string;
  scheda: SchedaProduzione;
}

function leggi(): VoceArchivio[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as VoceArchivio[]) : [];
  } catch {
    return [];
  }
}

export function caricaArchivio(): VoceArchivio[] {
  return leggi().sort((a, b) => b.salvataIl.localeCompare(a.salvataIl));
}

export function salvaInArchivio(scheda: SchedaProduzione): VoceArchivio {
  const voce: VoceArchivio = {
    id: `porta-${Date.now().toString(36)}`,
    salvataIl: new Date().toISOString(),
    scheda,
  };
  const tutte = [voce, ...leggi()].slice(0, 100);
  window.localStorage.setItem(KEY, JSON.stringify(tutte));
  return voce;
}

export function eliminaDaArchivio(id: string): VoceArchivio[] {
  const rimaste = leggi().filter((v) => v.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(rimaste));
  return rimaste.sort((a, b) => b.salvataIl.localeCompare(a.salvataIl));
}
