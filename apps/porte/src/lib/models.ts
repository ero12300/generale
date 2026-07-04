import type { DoorModel } from "./types";

/**
 * Catalogo modelli di porta.
 *
 * Le detrazioni di default sono basate sugli standard di mercato italiani per
 * porte per interni (fonti: tabelle FIP Porte / Porteinkit / Ermetika / ECLISSE):
 *  - Battente: anta ≈ foro muro − 100 mm (largh.) e − 50 mm (alt.);
 *    telaio ≈ foro muro − 20/15 mm (gioco di posa).
 *  - Scorrevole a scomparsa: ingombro ≈ 2 × luce + 110 mm (largh.), + 90 mm (alt.).
 *
 * Sono valori modificabili: ogni falegname può tararli sul proprio sistema.
 */

const BATTENTE = {
  antaLarghezza: 100,
  antaAltezza: 50,
  telaioLarghezza: 20,
  telaioAltezza: 15,
  battutaPerLato: 10,
};

export const DOOR_MODELS: DoorModel[] = [
  {
    id: "classica-battente",
    nome: "Classica Battente",
    descrizione:
      "Porta a battente tamburata, il modello più diffuso. Ideale per camere e ambienti standard.",
    tipoApertura: "battente",
    supportaCompasso: false,
    supportaAntaFissa: true,
    supportaVetro: true,
    supportaOblo: true,
    deduzioni: { ...BATTENTE },
  },
  {
    id: "vetrata-battente",
    nome: "Vetrata Battente",
    descrizione:
      "Battente con specchiatura in vetro. Porta più luce negli ambienti di passaggio.",
    tipoApertura: "battente",
    supportaCompasso: false,
    supportaAntaFissa: true,
    supportaVetro: true,
    supportaOblo: true,
    deduzioni: { ...BATTENTE },
  },
  {
    id: "compasso-tecnica",
    nome: "A Compasso (tecnica/bagno)",
    descrizione:
      "Cerniere a compasso: apre in spazi ridotti recuperando ingombro. Tipica per bagni e locali tecnici.",
    tipoApertura: "compasso",
    supportaCompasso: true,
    supportaAntaFissa: false,
    supportaVetro: true,
    supportaOblo: true,
    deduzioni: { ...BATTENTE },
  },
  {
    id: "scorrevole-esterno",
    nome: "Scorrevole Esterno Muro",
    descrizione:
      "Anta che scorre a parete su binario. Nessun ingombro di rotazione, ma serve spazio laterale.",
    tipoApertura: "scorrevole_esterno",
    supportaCompasso: false,
    supportaAntaFissa: false,
    supportaVetro: true,
    supportaOblo: true,
    // per scorrevole esterno l'anta COPRE il foro: valori negativi = maggiorazione
    deduzioni: {
      antaLarghezza: -60,
      antaAltezza: -50,
      telaioLarghezza: 0,
      telaioAltezza: 0,
      battutaPerLato: 0,
    },
  },
  {
    id: "scomparsa",
    nome: "Scorrevole a Scomparsa",
    descrizione:
      "L'anta scompare dentro la parete (controtelaio). Zero ingombro a vista, richiede muro predisposto.",
    tipoApertura: "scomparsa",
    supportaCompasso: false,
    supportaAntaFissa: false,
    supportaVetro: true,
    supportaOblo: true,
    deduzioni: {
      antaLarghezza: -40,
      antaAltezza: -40,
      telaioLarghezza: 0,
      telaioAltezza: 0,
      battutaPerLato: 0,
    },
  },
];

export function getModel(id: string): DoorModel | undefined {
  return DOOR_MODELS.find((m) => m.id === id);
}

/** Profondità telaio standard disponibili (mm). */
export const PROFONDITA_TELAIO = [70, 80, 90, 100, 110, 120];

/** Misure nominali standard di riferimento (mm) per aiuto UI. */
export const LARGHEZZE_NOMINALI = [600, 700, 800, 900, 1000];
export const ALTEZZE_NOMINALI = [2000, 2100];
