import { z } from "zod";

/**
 * Tutte le misure sono in millimetri (mm), numeri interi.
 * Convenzione mano: ci si posiziona sul lato dal quale la porta si apre
 * (lato cerniere visibili, norma DIN): cerniere a destra = mano destra.
 */

export const MODELLI_PORTA = ["interna", "ingresso"] as const;
export type ModelloPorta = (typeof MODELLI_PORTA)[number];

export const POSIZIONI_FISSO = ["nessuno", "sinistra", "destra", "entrambi"] as const;
export type PosizioneFisso = (typeof POSIZIONI_FISSO)[number];

export const TIPI_SOPRALUCE = ["nessuno", "fisso", "compasso"] as const;
export type TipoSopraluce = (typeof TIPI_SOPRALUCE)[number];

export const MANI = ["destra", "sinistra"] as const;
export type Mano = (typeof MANI)[number];

export const VERSI = ["spingere", "tirare"] as const;
export type Verso = (typeof VERSI)[number];

/** Parametri di detrazione ("opera morta") regolabili per sistema costruttivo. */
export const giochiSchema = z.object({
  /** Aria di posa per lato tra foro muro e telaio (mm) */
  ariaLaterale: z.number().int().min(0).max(50),
  /** Aria di posa superiore tra foro muro e telaio (mm) */
  ariaSuperiore: z.number().int().min(0).max(50),
  /** Larghezza montante verticale del telaio (mm) */
  montanteTelaio: z.number().int().min(20).max(150),
  /** Altezza traverso orizzontale del telaio (mm) */
  traversoTelaio: z.number().int().min(20).max(150),
  /** Sormonto battuta dell'anta sul telaio, per lato (mm) */
  battuta: z.number().int().min(0).max(40),
  /** Gioco tra anta e pavimento finito (mm) */
  giocoPavimento: z.number().int().min(0).max(30),
});
export type Giochi = z.infer<typeof giochiSchema>;

export const configurazionePortaSchema = z
  .object({
    nome: z.string().trim().max(120).default(""),
    modello: z.enum(MODELLI_PORTA),
    /** Foro muro: larghezza del vano grezzo nella parete (mm) */
    foroLarghezza: z
      .number({ invalid_type_error: "Inserisci un numero in mm" })
      .int("Usa millimetri interi")
      .min(400, "Minimo 400 mm")
      .max(4000, "Massimo 4000 mm"),
    /** Foro muro: altezza del vano grezzo dal pavimento finito (mm) */
    foroAltezza: z
      .number({ invalid_type_error: "Inserisci un numero in mm" })
      .int("Usa millimetri interi")
      .min(600, "Minimo 600 mm")
      .max(4000, "Massimo 4000 mm"),
    /** Spessore della parete finita (mm) */
    spessoreMuro: z
      .number({ invalid_type_error: "Inserisci un numero in mm" })
      .int("Usa millimetri interi")
      .min(50, "Minimo 50 mm")
      .max(600, "Massimo 600 mm"),
    fissoPosizione: z.enum(POSIZIONI_FISSO),
    /** Larghezza luce di ciascun modulo fisso laterale (mm) */
    fissoLarghezza: z
      .number({ invalid_type_error: "Inserisci un numero in mm" })
      .int("Usa millimetri interi")
      .min(100, "Minimo 100 mm")
      .max(1500, "Massimo 1500 mm"),
    sopraluceTipo: z.enum(TIPI_SOPRALUCE),
    /** Altezza luce del sopraluce (mm) */
    sopraluceAltezza: z
      .number({ invalid_type_error: "Inserisci un numero in mm" })
      .int("Usa millimetri interi")
      .min(100, "Minimo 100 mm")
      .max(1200, "Massimo 1200 mm"),
    /** Display vetrato verticale nell'anta */
    vetroDisplay: z.boolean(),
    /** Oblò ovale nell'anta */
    oblo: z.boolean(),
    mano: z.enum(MANI),
    verso: z.enum(VERSI),
    giochi: giochiSchema,
  })
  .superRefine((value, ctx) => {
    if (value.fissoPosizione !== "nessuno") {
      const numeroFissi = value.fissoPosizione === "entrambi" ? 2 : 1;
      const spazioMinimoAnta = 400;
      const larghezzaOccupata =
        numeroFissi * value.fissoLarghezza +
        (2 + numeroFissi) * value.giochi.montanteTelaio +
        2 * value.giochi.ariaLaterale;
      if (value.foroLarghezza - larghezzaOccupata < spazioMinimoAnta) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fissoLarghezza"],
          message:
            "Fisso laterale troppo largo: lo spazio residuo per l'anta è inferiore a 400 mm.",
        });
      }
    }
    if (value.sopraluceTipo !== "nessuno") {
      const altezzaResidua =
        value.foroAltezza -
        value.giochi.ariaSuperiore -
        2 * value.giochi.traversoTelaio -
        value.sopraluceAltezza;
      if (altezzaResidua < 1800) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sopraluceAltezza"],
          message:
            "Sopraluce troppo alto: la luce di passaggio residua è inferiore a 1800 mm.",
        });
      }
    }
  });

export type ConfigurazionePorta = z.infer<typeof configurazionePortaSchema>;
export type ConfigurazionePortaInput = z.input<typeof configurazionePortaSchema>;

export interface Dimensione {
  larghezza: number;
  altezza: number;
}

export type LivelloAvviso = "errore" | "avviso" | "info";

export interface Avviso {
  livello: LivelloAvviso;
  codice: string;
  messaggio: string;
}

export interface RigaCalcolo {
  voce: string;
  formula: string;
  risultato: string;
}

export interface RisultatoPorta {
  /** Dimensioni esterne del telaio (esterno telaio) */
  telaio: Dimensione;
  /** Dimensioni dell'anta mobile, pronte per la produzione */
  anta: Dimensione & { spessore: number };
  /** Luce netta di passaggio a porta installata */
  luceNetta: Dimensione;
  /** Dimensioni luce di ciascun fisso laterale (se presente) */
  fisso: Dimensione | null;
  numeroFissi: number;
  /** Dimensioni luce del sopraluce (se presente) */
  sopraluce: (Dimensione & { tipo: Exclude<TipoSopraluce, "nessuno"> }) | null;
  /** Lato maniglia visto dal lato di apertura (opposto alle cerniere) */
  latoManiglia: Mano;
  /** Lato cerniere visto dal lato di apertura */
  latoCerniere: Mano;
  /** Etichetta commerciale es. "Destra a spingere" */
  etichettaApertura: string;
  /** Misura anta standard corrispondente, se rientra nelle tolleranze */
  misuraStandard: string | null;
  avvisi: Avviso[];
  dettaglioCalcolo: RigaCalcolo[];
}

export interface PortaSalvata {
  id: string;
  creataIl: string;
  configurazione: ConfigurazionePorta;
  risultato: RisultatoPorta;
}
