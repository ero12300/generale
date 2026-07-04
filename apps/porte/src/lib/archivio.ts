import type { PortaSalvata } from "@/lib/door-engine";

const CHIAVE = "portapro.archivio.v1";

function leggiTutte(): PortaSalvata[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHIAVE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PortaSalvata[]) : [];
  } catch {
    return [];
  }
}

export const archivio = {
  elenca(): PortaSalvata[] {
    return leggiTutte().sort((a, b) => b.creataIl.localeCompare(a.creataIl));
  },
  salva(porta: PortaSalvata): void {
    const tutte = leggiTutte().filter((p) => p.id !== porta.id);
    tutte.push(porta);
    window.localStorage.setItem(CHIAVE, JSON.stringify(tutte));
  },
  elimina(id: string): void {
    window.localStorage.setItem(
      CHIAVE,
      JSON.stringify(leggiTutte().filter((p) => p.id !== id)),
    );
  },
};
