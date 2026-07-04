import type { AccessoriPorta, DeduzioniSistema, SistemaPorta } from "./types";

// Deduzioni di riferimento per un battente standard con controtelaio in legno.
// Valori basati sulle prassi di posa comuni per porte interne (mm).
const DEDUZIONI_BATTENTE_STANDARD: DeduzioniSistema = {
  giocoPosaLato: 10,
  giocoPosaSuperiore: 10,
  spessoreControtelaio: 20,
  ingombroTelaioLato: 12,
  ingombroTelaioSuperiore: 12,
  sormontoAnta: 10,
  giocoAnta: 3,
  montanteIntermedio: 40,
  traversoIntermedio: 40,
  giocoCentraleBussola: 4,
  ricoperturaScorrevole: 25,
};

// Battente filo muro: telaio più esile, minori ingombri.
const DEDUZIONI_BATTENTE_FILOMURO: DeduzioniSistema = {
  ...DEDUZIONI_BATTENTE_STANDARD,
  spessoreControtelaio: 15,
  ingombroTelaioLato: 8,
  ingombroTelaioSuperiore: 8,
};

// Scorrevole esterno muro: nessun controtelaio, binario a parete.
const DEDUZIONI_SCORREVOLE_ESTERNO: DeduzioniSistema = {
  ...DEDUZIONI_BATTENTE_STANDARD,
  giocoPosaLato: 0,
  giocoPosaSuperiore: 0,
  spessoreControtelaio: 0,
  ingombroTelaioLato: 0,
  ingombroTelaioSuperiore: 0,
  sormontoAnta: 0,
  giocoAnta: 0,
  ricoperturaScorrevole: 25,
};

// Scorrevole a scomparsa: controtelaio metallico interno al muro.
const DEDUZIONI_SCORREVOLE_SCOMPARSA: DeduzioniSistema = {
  ...DEDUZIONI_BATTENTE_STANDARD,
  giocoPosaLato: 5,
  giocoPosaSuperiore: 5,
  spessoreControtelaio: 20,
  ingombroTelaioLato: 10,
  ingombroTelaioSuperiore: 10,
};

export const SISTEMI: SistemaPorta[] = [
  {
    id: "battente-standard",
    nome: "Battente standard",
    descrizione: "Porta a battente con controtelaio in legno e coprifili.",
    tipologia: "battente",
    deduzioni: DEDUZIONI_BATTENTE_STANDARD,
  },
  {
    id: "battente-filomuro",
    nome: "Battente filo muro",
    descrizione: "Battente a filo parete, telaio ridotto senza coprifili.",
    tipologia: "battente",
    deduzioni: DEDUZIONI_BATTENTE_FILOMURO,
  },
  {
    id: "scorrevole-esterno",
    nome: "Scorrevole esterno muro",
    descrizione: "Anta che scorre lungo la parete su binario esterno.",
    tipologia: "scorrevole_esterno",
    deduzioni: DEDUZIONI_SCORREVOLE_ESTERNO,
  },
  {
    id: "scorrevole-scomparsa",
    nome: "Scorrevole a scomparsa",
    descrizione: "Anta che scompare dentro il muro nel controtelaio metallico.",
    tipologia: "scorrevole_scomparsa",
    deduzioni: DEDUZIONI_SCORREVOLE_SCOMPARSA,
    spessoreMuroMin: 105,
  },
];

export function getSistema(id: string): SistemaPorta {
  return SISTEMI.find((s) => s.id === id) ?? SISTEMI[0];
}

export const ACCESSORI_DEFAULT: AccessoriPorta = {
  bussola: false,
  fissoLaterale: false,
  larghezzaFisso: 400,
  sopraluce: false,
  altezzaSopraluce: 400,
  vetro: false,
  ovale: false,
};
