import { z } from "zod";

/**
 * Dominio: configuratore porte per interni.
 * Tutte le misure sono espresse in MILLIMETRI (interi) per evitare errori
 * di arrotondamento con i decimali. Il vano viene misurato "al morto"
 * (foro muro grezzo) e da lì si ricava la porta, sempre piu' piccola.
 */

/** Tipologia di movimento dell'anta. */
export const TIPOLOGIE = ["battente", "scorrevole_esterno", "scorrevole_scomparsa"] as const;
export type Tipologia = (typeof TIPOLOGIE)[number];

/** Lato cerniere secondo DIN 107 (guardando il verso di apertura). */
export const MANI = ["destra", "sinistra"] as const;
export type Mano = (typeof MANI)[number];

/** Verso di apertura rispetto a chi guarda dal lato cerniere. */
export const VERSI = ["spingere", "tirare"] as const;
export type Verso = (typeof VERSI)[number];

/** Tipo di finestratura sull'anta ("display"/vetro/oblo'). */
export const OBLO = ["nessuno", "ovale", "rotondo", "rettangolare"] as const;
export type Oblo = (typeof OBLO)[number];

/** Parametri di deduzione: da foro muro a luce di passaggio e ad anta. */
export interface Deduzioni {
  /** mm tolti alla larghezza foro per ottenere la luce di passaggio (telaio/controtelaio). */
  telaioLarghezza: number;
  /** mm tolti all'altezza foro per ottenere la luce di passaggio. */
  telaioAltezza: number;
  /** gioco/tolleranza tra luce di passaggio e larghezza anta. */
  giocoAntaLarghezza: number;
  /** gioco/tolleranza tra luce di passaggio e altezza anta. */
  giocoAntaAltezza: number;
  /**
   * Per gli scorrevoli a scomparsa: fattore di ingombro in larghezza.
   * Ingombro = larghezzaLuce * fattore + extra. Se assente vale 1 (battente).
   */
  ingombroFattore?: number;
  ingombroExtra?: number;
}

/** Modello di porta del catalogo. */
export interface ModelloPorta {
  id: string;
  nome: string;
  tipologia: Tipologia;
  descrizione: string;
  deduzioni: Deduzioni;
  /** Opzioni ammesse per questo modello. */
  opzioni: {
    sopraluce: boolean;
    antaFissa: boolean;
    bussola: boolean;
    oblo: boolean;
  };
}

/** Opzioni scelte dall'utente in fase di configurazione. */
export const opzioniSchema = z.object({
  sopraluce: z.boolean().default(false),
  /** Altezza del sopraluce (mm), rilevante solo se sopraluce = true. */
  sopraluceAltezza: z.number().int().min(100).max(1200).default(400),
  antaFissa: z.boolean().default(false),
  /** Larghezza dell'anta fissa (semifissa) in mm, se antaFissa = true. */
  antaFissaLarghezza: z.number().int().min(100).max(2000).default(400),
  bussola: z.boolean().default(false),
  /** Larghezza fianco fisso sinistro della bussola (mm). */
  bussolaFiancoSx: z.number().int().min(0).max(2000).default(0),
  /** Larghezza fianco fisso destro della bussola (mm). */
  bussolaFiancoDx: z.number().int().min(0).max(2000).default(0),
  oblo: z.enum(OBLO).default("nessuno"),
});
export type Opzioni = z.infer<typeof opzioniSchema>;

/** Input completo di configurazione validato con zod. */
export const configSchema = z
  .object({
    commessa: z.string().trim().max(80).default(""),
    cliente: z.string().trim().max(120).default(""),
    modelloId: z.string().min(1, "Seleziona un modello di porta"),
    foroLarghezza: z
      .number({ invalid_type_error: "Inserisci la larghezza del foro muro" })
      .int("Usa numeri interi in mm")
      .min(300, "Larghezza minima 300 mm")
      .max(3000, "Larghezza massima 3000 mm"),
    foroAltezza: z
      .number({ invalid_type_error: "Inserisci l'altezza del foro muro" })
      .int("Usa numeri interi in mm")
      .min(1000, "Altezza minima 1000 mm")
      .max(3500, "Altezza massima 3500 mm"),
    spessoreParete: z
      .number({ invalid_type_error: "Inserisci lo spessore parete" })
      .int()
      .min(60, "Spessore minimo 60 mm")
      .max(500, "Spessore massimo 500 mm")
      .default(105),
    mano: z.enum(MANI).default("destra"),
    verso: z.enum(VERSI).default("spingere"),
    opzioni: opzioniSchema.default({}),
    /** Override manuale dei parametri di deduzione (uso avanzato). */
    deduzioniOverride: z
      .object({
        telaioLarghezza: z.number().int().min(0).max(600),
        telaioAltezza: z.number().int().min(0).max(600),
        giocoAntaLarghezza: z.number().int().min(0).max(200),
        giocoAntaAltezza: z.number().int().min(0).max(200),
      })
      .partial()
      .optional(),
  })
  .strict();

export type Config = z.infer<typeof configSchema>;

/** Dimensione in millimetri. */
export interface Dim {
  larghezza: number;
  altezza: number;
}

/** Un pannello disegnato nello schema (anta mobile, fissa, sopraluce...). */
export interface Pannello {
  tipo: "anta" | "fissa" | "sopraluce" | "fianco";
  /** Posizione X/Y e dimensioni in mm, riferite al foro muro (origine in alto a sinistra). */
  x: number;
  y: number;
  larghezza: number;
  altezza: number;
}

/** Risultato del calcolo: quote di produzione + pannelli per lo schema. */
export interface Risultato {
  modello: ModelloPorta;
  foro: Dim;
  lucePassaggio: Dim;
  anta: Dim;
  /** Presente solo per scorrevoli a scomparsa. */
  ingombroTotale?: Dim;
  /** Lato maniglia (opposto alle cerniere). */
  latoManiglia: Mano;
  latoCerniere: Mano;
  verso: Verso;
  /** Descrizione sintetica del senso di apertura (es. "Destra a spingere"). */
  sensoApertura: string;
  /** Altezza consigliata maniglia da pavimento (mm). */
  altezzaManiglia: number;
  pannelli: Pannello[];
  /** Note/avvisi non bloccanti (es. sotto la luce minima di legge). */
  avvisi: string[];
}
