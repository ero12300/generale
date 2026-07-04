"use client";

import type { ConfigurazionePorta, RisultatoCalcolo } from "./types";

export function esportaJSON(
  nome: string,
  config: ConfigurazionePorta,
  risultato: RisultatoCalcolo
): void {
  const payload = {
    generatoIl: new Date().toISOString(),
    nome,
    configurazione: config,
    risultato,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug(nome || "porta")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function stampaScheda(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
