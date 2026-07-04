import type { Commessa, InputPorta } from "../domain/types";

const CHIAVE = "portapro.commesse.v1";

function leggiTutte(): Commessa[] {
  try {
    const raw = localStorage.getItem(CHIAVE);
    if (!raw) return [];
    const dati = JSON.parse(raw);
    return Array.isArray(dati) ? (dati as Commessa[]) : [];
  } catch {
    return [];
  }
}

function scrivi(commesse: Commessa[]): void {
  localStorage.setItem(CHIAVE, JSON.stringify(commesse));
}

export const archivio = {
  lista(): Commessa[] {
    return leggiTutte().sort((a, b) => b.creataIl.localeCompare(a.creataIl));
  },
  salva(riferimento: string, input: InputPorta): Commessa {
    const commessa: Commessa = {
      id: crypto.randomUUID(),
      riferimento: riferimento.trim() || "Senza riferimento",
      creataIl: new Date().toISOString(),
      input,
    };
    scrivi([...leggiTutte(), commessa]);
    return commessa;
  },
  elimina(id: string): void {
    scrivi(leggiTutte().filter((c) => c.id !== id));
  },
};
