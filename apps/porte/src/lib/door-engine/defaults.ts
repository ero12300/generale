import type { ConfigurazionePortaInput, Giochi, ModelloPorta } from "./types";

/**
 * Detrazioni tipiche del sistema costruttivo ("opera morta") per modello.
 * Valori medi di mercato in mm, regolabili dall'utente nelle opzioni avanzate.
 */
export const GIOCHI_PREDEFINITI: Record<ModelloPorta, Giochi> = {
  interna: {
    ariaLaterale: 10,
    ariaSuperiore: 10,
    montanteTelaio: 45,
    traversoTelaio: 45,
    battuta: 12,
    giocoPavimento: 7,
  },
  ingresso: {
    ariaLaterale: 10,
    ariaSuperiore: 10,
    montanteTelaio: 60,
    traversoTelaio: 60,
    battuta: 15,
    giocoPavimento: 5,
  },
};

export const SPESSORE_ANTA: Record<ModelloPorta, number> = {
  interna: 44,
  ingresso: 68,
};

/** Luce netta minima prevista dal DM 236/1989 (mm). */
export const LUCE_NETTA_MINIMA: Record<ModelloPorta, number> = {
  interna: 750,
  ingresso: 800,
};

/** Misure anta commerciali standard (mm), larghezza x altezza. */
export const ANTE_STANDARD: ReadonlyArray<{ larghezza: number; altezza: number }> = [
  { larghezza: 600, altezza: 2000 },
  { larghezza: 600, altezza: 2100 },
  { larghezza: 700, altezza: 2000 },
  { larghezza: 700, altezza: 2100 },
  { larghezza: 800, altezza: 2000 },
  { larghezza: 800, altezza: 2100 },
  { larghezza: 900, altezza: 2000 },
  { larghezza: 900, altezza: 2100 },
];

export function configurazionePredefinita(
  modello: ModelloPorta = "interna",
): ConfigurazionePortaInput {
  return {
    nome: "",
    modello,
    foroLarghezza: modello === "interna" ? 900 : 1000,
    foroAltezza: modello === "interna" ? 2160 : 2250,
    spessoreMuro: modello === "interna" ? 105 : 300,
    fissoPosizione: "nessuno",
    fissoLarghezza: 400,
    sopraluceTipo: "nessuno",
    sopraluceAltezza: 350,
    vetroDisplay: false,
    oblo: false,
    mano: "destra",
    verso: "spingere",
    giochi: GIOCHI_PREDEFINITI[modello],
  };
}
