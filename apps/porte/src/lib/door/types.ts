import { z } from "zod";

/**
 * Tutte le misure sono in MILLIMETRI INTERI.
 * Non si usano float: le lavorazioni in falegnameria/serramenti
 * si esprimono in mm interi e i giochi sono valori discreti.
 */

export const TIPI_APERTURA = [
  "battente",
  "scorrevole_esterno",
  "scorrevole_scomparsa",
] as const;
export type TipoApertura = (typeof TIPI_APERTURA)[number];

/** Lato su cui sono montate le cerniere, guardando dal lato di apertura (DIN 107). */
export const LATI = ["sinistra", "destra"] as const;
export type Lato = (typeof LATI)[number];

/** Verso di apertura rispetto all'osservatore posto sul lato cerniere. */
export const VERSI_APERTURA = ["tiro", "spinta"] as const;
export type VersoApertura = (typeof VERSI_APERTURA)[number];

export const FORME_OBLO = ["nessuno", "ovale", "tondo", "rettangolare"] as const;
export type FormaOblo = (typeof FORME_OBLO)[number];

/** Parametri di gioco/costruzione, configurabili in base al proprio sistema porta. */
export const parametriGiocoSchema = z.object({
  giocoMuraturaLatoMm: z.number().int().min(0).max(60),
  giocoMuraturaAltoMm: z.number().int().min(0).max(60),
  giocoTelaioControtelaioLatoMm: z.number().int().min(0).max(40),
  giocoTelaioControtelaioAltoMm: z.number().int().min(0).max(40),
  spessoreTelaioMm: z.number().int().min(20).max(120),
  battutaTelaioMm: z.number().int().min(0).max(40),
  giocoAntaTelaioMm: z.number().int().min(0).max(20),
  giocoPavimentoMm: z.number().int().min(0).max(40),
  montanteCentraleMm: z.number().int().min(0).max(200),
  traversoSopraluceMm: z.number().int().min(0).max(200),
});
export type ParametriGioco = z.infer<typeof parametriGiocoSchema>;

/** Default coerenti con il mercato italiano (telaio 40 mm/lato, giochi standard). */
export const PARAMETRI_DEFAULT: ParametriGioco = {
  giocoMuraturaLatoMm: 10,
  giocoMuraturaAltoMm: 10,
  giocoTelaioControtelaioLatoMm: 5,
  giocoTelaioControtelaioAltoMm: 5,
  spessoreTelaioMm: 40,
  battutaTelaioMm: 12,
  giocoAntaTelaioMm: 3,
  giocoPavimentoMm: 10,
  montanteCentraleMm: 60,
  traversoSopraluceMm: 60,
};

export const opzioniSchema = z.object({
  antaFissa: z.boolean(),
  larghezzaAntaFissaMm: z.number().int().min(200).max(1500).optional(),
  sopraluce: z.boolean(),
  altezzaSopraluceMm: z.number().int().min(150).max(1200).optional(),
  vetro: z.boolean(),
  oblo: z.enum(FORME_OBLO),
  obloLarghezzaMm: z.number().int().min(80).max(1200).optional(),
  obloAltezzaMm: z.number().int().min(80).max(1600).optional(),
});
export type OpzioniPorta = z.infer<typeof opzioniSchema>;

export const inputPortaSchema = z.object({
  riferimentoCommessa: z.string().max(80).optional(),
  modello: z.string().max(80).optional(),
  foroLarghezzaMm: z.number().int().min(400).max(3000),
  foroAltezzaMm: z.number().int().min(1500).max(3500),
  spessoreMuroMm: z.number().int().min(60).max(600),
  tipoApertura: z.enum(TIPI_APERTURA),
  latoCerniere: z.enum(LATI),
  versoApertura: z.enum(VERSI_APERTURA),
  opzioni: opzioniSchema,
  parametri: parametriGiocoSchema.partial().optional(),
});
export type InputPorta = z.infer<typeof inputPortaSchema>;

export interface Componente {
  larghezzaMm: number;
  altezzaMm: number;
}

export interface MisuraStandard {
  larghezzaMm: number;
  altezzaMm: number;
  etichetta: string;
}

export interface RisultatoPorta {
  input: InputPorta;
  parametri: ParametriGioco;
  foro: Componente;
  controtelaio: Componente;
  telaioEsterno: Componente;
  lucePassaggio: Componente;
  anta: Componente;
  antaFissa?: Componente;
  sopraluce?: Componente;
  oblo?: Componente & { forma: FormaOblo };
  spessoreTelaioMuroMm: number;
  din: "SX" | "DX";
  latoManiglia: Lato;
  descrizioneApertura: string;
  misuraStandardVicina: MisuraStandard;
  fuoriMisura: boolean;
  avvisi: string[];
}
