"use client";

import type { Ordine, OrdineInput, RisultatoCalcolo } from "./types";
import { generaId } from "./utils";

const CHIAVE = "portepro.ordini.v1";

export function leggiOrdini(): Ordine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHIAVE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ordine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function leggiOrdine(id: string): Ordine | undefined {
  return leggiOrdini().find((o) => o.id === id);
}

export function salvaOrdine(input: OrdineInput, calcolo: RisultatoCalcolo): Ordine {
  const ordine: Ordine = {
    ...input,
    id: generaId(),
    creatoIl: new Date().toISOString(),
    calcolo,
  };
  const attuali = leggiOrdini();
  const nuovi = [ordine, ...attuali];
  window.localStorage.setItem(CHIAVE, JSON.stringify(nuovi));
  return ordine;
}

export function eliminaOrdine(id: string): void {
  const attuali = leggiOrdini().filter((o) => o.id !== id);
  window.localStorage.setItem(CHIAVE, JSON.stringify(attuali));
}
