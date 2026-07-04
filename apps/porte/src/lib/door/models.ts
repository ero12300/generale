import type { ModelloPorta } from "./types";

/**
 * Catalogo modelli con detrazioni di produzione.
 *
 * Convenzioni di mercato (porte interne italiane):
 * - anta standard 600/700/800/900 × 2100 mm;
 * - vano muro ≈ anta + 80 mm in larghezza, + 45÷50 mm in altezza;
 * - scorrevole a scomparsa: ingombro controtelaio ≈ 2·L + 110 mm, H + 90 mm.
 */
export const MODELLI: ModelloPorta[] = [
  {
    id: "classica-legno",
    nome: "Classica Legno",
    descrizione: "Porta tamburata in legno, telaio con coprifili telescopici.",
    spessoreAnta: 44,
    tipologie: ["battente", "doppia_battente", "battente_fisso"],
    detrazioni: {
      antaLarghezza: 80,
      antaAltezza: 50,
      giocoFalsoTelaio: 5,
      sormontoBattuta: 12,
      battutaCentrale: 25,
      sormontoScorrevoleLarghezza: 50,
      sormontoScorrevoleAltezza: 40,
    },
    vanoMin: { larghezza: 630, altezza: 1900 },
    vanoMax: { larghezza: 1900, altezza: 2700 },
    spessoreMuroMin: 90,
    spessoreMuroMax: 300,
    supportaVetro: true,
    supportaOblo: true,
    supportaSopraluce: true,
  },
  {
    id: "laccata-moderna",
    nome: "Laccata Moderna",
    descrizione: "Anta liscia laccata, cerniere a scomparsa, battuta ridotta.",
    spessoreAnta: 40,
    tipologie: ["battente", "doppia_battente", "battente_fisso"],
    detrazioni: {
      antaLarghezza: 76,
      antaAltezza: 46,
      giocoFalsoTelaio: 5,
      sormontoBattuta: 10,
      battutaCentrale: 20,
      sormontoScorrevoleLarghezza: 50,
      sormontoScorrevoleAltezza: 40,
    },
    vanoMin: { larghezza: 620, altezza: 1900 },
    vanoMax: { larghezza: 2000, altezza: 2800 },
    spessoreMuroMin: 90,
    spessoreMuroMax: 350,
    supportaVetro: true,
    supportaOblo: true,
    supportaSopraluce: true,
  },
  {
    id: "filomuro",
    nome: "Filomuro Rasoparete",
    descrizione: "Telaio a scomparsa complanare alla parete, senza coprifili.",
    spessoreAnta: 44,
    tipologie: ["battente"],
    detrazioni: {
      antaLarghezza: 120,
      antaAltezza: 60,
      giocoFalsoTelaio: 0,
      sormontoBattuta: 0,
      battutaCentrale: 0,
      sormontoScorrevoleLarghezza: 0,
      sormontoScorrevoleAltezza: 0,
    },
    vanoMin: { larghezza: 700, altezza: 2000 },
    vanoMax: { larghezza: 1120, altezza: 2760 },
    spessoreMuroMin: 100,
    spessoreMuroMax: 150,
    supportaVetro: false,
    supportaOblo: false,
    supportaSopraluce: false,
  },
  {
    id: "scorrevole-scomparsa",
    nome: "Scorrevole a Scomparsa",
    descrizione: "Anta che scompare nel controtelaio dentro il muro.",
    spessoreAnta: 40,
    tipologie: ["scorrevole_scomparsa"],
    detrazioni: {
      antaLarghezza: 0,
      antaAltezza: 0,
      giocoFalsoTelaio: 5,
      sormontoBattuta: 0,
      battutaCentrale: 0,
      sormontoScorrevoleLarghezza: 50,
      sormontoScorrevoleAltezza: 40,
    },
    vanoMin: { larghezza: 600, altezza: 1000 },
    vanoMax: { larghezza: 1200, altezza: 2700 },
    spessoreMuroMin: 100,
    spessoreMuroMax: 150,
    supportaVetro: true,
    supportaOblo: false,
    supportaSopraluce: false,
  },
  {
    id: "scorrevole-esterno",
    nome: "Scorrevole Esterno Muro",
    descrizione: "Anta a vista su binario esterno alla parete.",
    spessoreAnta: 40,
    tipologie: ["scorrevole_esterno"],
    detrazioni: {
      antaLarghezza: 0,
      antaAltezza: 0,
      giocoFalsoTelaio: 0,
      sormontoBattuta: 0,
      battutaCentrale: 0,
      sormontoScorrevoleLarghezza: 100,
      sormontoScorrevoleAltezza: 60,
    },
    vanoMin: { larghezza: 600, altezza: 1800 },
    vanoMax: { larghezza: 1500, altezza: 2700 },
    spessoreMuroMin: 80,
    spessoreMuroMax: 500,
    supportaVetro: true,
    supportaOblo: true,
    supportaSopraluce: false,
  },
];

export function getModello(id: string): ModelloPorta | undefined {
  return MODELLI.find((m) => m.id === id);
}

/** Ante standard di mercato (larghezza × altezza, mm). */
export const ANTE_STANDARD: ReadonlyArray<readonly [number, number]> = [
  [600, 2000],
  [600, 2100],
  [700, 2000],
  [700, 2100],
  [750, 2100],
  [800, 2000],
  [800, 2100],
  [900, 2100],
];
