import type { Config } from "./types";

const KEY = "porte:schede:v1";

export interface SchedaSalvata {
  id: string;
  nome: string;
  salvataIl: string;
  config: Config;
}

function read(): SchedaSalvata[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SchedaSalvata[]) : [];
  } catch {
    return [];
  }
}

function write(list: SchedaSalvata[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export function listaSchede(): SchedaSalvata[] {
  return read().sort((a, b) => b.salvataIl.localeCompare(a.salvataIl));
}

export function salvaScheda(nome: string, config: Config): SchedaSalvata {
  const list = read();
  const scheda: SchedaSalvata = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nome: nome || "Senza nome",
    salvataIl: new Date().toISOString(),
    config,
  };
  list.push(scheda);
  write(list);
  return scheda;
}

export function eliminaScheda(id: string): void {
  write(read().filter((s) => s.id !== id));
}
