/**
 * Preset comodi per l'UI: dimensioni standard porte italiane, spessori muro,
 * etichette leggibili per tipologia e verso apertura.
 */

import type { Tipologia } from "./types";

/** Larghezze anta standard (mm). */
export const LARGHEZZE_ANTA = [600, 700, 800, 900, 1000, 1100, 1200] as const;

/** Altezze anta standard (mm). */
export const ALTEZZE_ANTA = [2000, 2100, 2400, 2700] as const;

/** Spessori muro tipici in mm (parete finita: laterizio + intonaco / cartongesso). */
export const SPESSORI_MURO = [80, 100, 105, 120, 125, 150, 200, 250, 300] as const;

/** Etichette leggibili per tipologia. */
export const TIPOLOGIE: Array<{ value: Tipologia; label: string; hint: string }> = [
  {
    value: "battente",
    label: "Battente",
    hint: "Porta classica con cerniere e apertura a rotazione",
  },
  {
    value: "scorrevole_esterno",
    label: "Scorrevole esterno muro",
    hint: "Anta a vista scorre su binario esterno alla parete",
  },
  {
    value: "scorrevole_scomparsa",
    label: "Scorrevole a scomparsa",
    hint: "Anta scompare in un controtelaio nel muro",
  },
  {
    value: "filo_muro",
    label: "Filo muro",
    hint: "Telaio a scomparsa nel muro, anta a filo intonaco",
  },
  {
    value: "pieghevole",
    label: "A libro / pieghevole",
    hint: "Anta divisa in due pannelli con cerniera centrale",
  },
];

/** Sopraluci standard: altezze (mm). */
export const ALTEZZE_SOPRALUCE = [300, 400, 500, 600] as const;

/** Larghezze fisso laterale standard (mm). */
export const LARGHEZZE_FISSO = [300, 400, 500, 600, 700] as const;

/** Presets configurazione porta pronta all'uso. */
export const CONFIG_DEFAULT = {
  tipologia: "battente" as Tipologia,
  foroMuro: {
    larghezza: 900,
    altezza: 2150,
    spessoreMuro: 100,
  },
  latoCerniere: "dx" as const,
  manovra: "spingere" as const,
  opzioni: {
    sopraluce: { presente: false as const },
    fissoLaterale: { presente: false as const },
    oblo: { presente: false as const },
    conControtelaio: true,
  },
} as const;
