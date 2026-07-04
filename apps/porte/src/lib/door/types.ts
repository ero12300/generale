/**
 * Tutte le misure sono in millimetri (mm), numeri interi.
 * Nessun uso di float per le quote di produzione.
 */

export type TipologiaPorta =
  | "battente"
  | "doppia_battente"
  | "battente_fisso"
  | "scorrevole_scomparsa"
  | "scorrevole_esterno";

export const TIPOLOGIA_LABEL: Record<TipologiaPorta, string> = {
  battente: "Battente singola (bussola)",
  doppia_battente: "Doppia anta (due battenti)",
  battente_fisso: "Battente + fianco fisso",
  scorrevole_scomparsa: "Scorrevole a scomparsa",
  scorrevole_esterno: "Scorrevole esterno muro",
};

/** Lato guardando la porta dal lato di rilievo (lato di chi apre). */
export type Lato = "destra" | "sinistra";

/** Verso di apertura per porte a battente. */
export type VersoApertura = "spingere" | "tirare";

export type TipoSopraluce = "nessuno" | "vetrato" | "cieco";

export type RipartizioneAnte = "simmetrica" | "asimmetrica";

export interface MisureVano {
  /** Larghezza foro grezzo muro, da muro a muro (mm). */
  larghezza: number;
  /** Altezza da pavimento finito a sotto-architrave (mm). */
  altezza: number;
  /** Spessore muro finito (mm). */
  spessoreMuro: number;
}

export interface OpzioniPorta {
  sopraluce: TipoSopraluce;
  /** Altezza del sopraluce (mm), usata solo se sopraluce !== "nessuno". */
  altezzaSopraluce: number;
  /** Specchiatura vetrata nell'anta. */
  vetro: boolean;
  /** Oblò ovale nell'anta. */
  oblo: boolean;
  /** Lato del fianco fisso (solo tipologia battente_fisso). */
  latoFisso: Lato;
  /** Larghezza fianco fisso in mm; 0 = calcolo automatico (1/3 del vano). */
  larghezzaFisso: number;
  /** Ripartizione delle due ante (solo doppia_battente). */
  ripartizioneAnte: RipartizioneAnte;
}

export interface ConfigPorta {
  /** Riferimento commessa / cliente. */
  nome: string;
  modelloId: string;
  tipologia: TipologiaPorta;
  vano: MisureVano;
  /**
   * Lato cerniere guardando la porta dal lato di rilievo.
   * Per le scorrevoli indica il lato verso cui scorre l'anta.
   */
  latoCerniere: Lato;
  verso: VersoApertura;
  opzioni: OpzioniPorta;
}

export interface DetrazioniModello {
  /** vano.larghezza − X = larghezza anta (battente). */
  antaLarghezza: number;
  /** altezza utile − X = altezza anta (battente). */
  antaAltezza: number;
  /** Gioco di posa per lato tra vano grezzo e falso telaio (mm). */
  giocoFalsoTelaio: number;
  /** Sormonto anta su telaio per lato (mm), determina la luce di passaggio. */
  sormontoBattuta: number;
  /** Battuta centrale tra due ante (mm), doppia battente. */
  battutaCentrale: number;
  /** Sormonto anta scorrevole sulla luce, per la larghezza (mm). */
  sormontoScorrevoleLarghezza: number;
  /** Sormonto anta scorrevole sulla luce, per l'altezza (mm). */
  sormontoScorrevoleAltezza: number;
}

export interface ModelloPorta {
  id: string;
  nome: string;
  descrizione: string;
  /** Spessore anta finita (mm). */
  spessoreAnta: number;
  tipologie: TipologiaPorta[];
  detrazioni: DetrazioniModello;
  vanoMin: { larghezza: number; altezza: number };
  vanoMax: { larghezza: number; altezza: number };
  spessoreMuroMin: number;
  spessoreMuroMax: number;
  supportaVetro: boolean;
  supportaOblo: boolean;
  supportaSopraluce: boolean;
}

export interface Quota {
  larghezza: number;
  altezza: number;
}

export interface QuotaAnta extends Quota {
  spessore: number;
  ruolo: "principale" | "semifissa";
}

export interface SchedaProduzione {
  config: ConfigPorta;
  modello: ModelloPorta;
  /** Falso telaio / controtelaio ("opera morta") — misura esterna. */
  falsoTelaio: Quota & { profondita: number };
  /** Telaio finito — misura esterna. */
  telaio: Quota;
  ante: QuotaAnta[];
  fisso?: Quota & { lato: Lato };
  sopraluce?: Quota & { tipo: Exclude<TipoSopraluce, "nessuno"> };
  lucePassaggio: Quota;
  /** Solo scorrevole a scomparsa: ingombro totale controtelaio nel muro. */
  ingombroControtelaio?: Quota;
  /** Solo scorrevole esterno muro: lunghezza binario. */
  lunghezzaBinario?: number;
  /** Descrizione normalizzata dell'apertura, es. "Porta DESTRA a spingere". */
  aperturaDescrizione: string;
  latoManiglia: Lato;
  latoCerniere: Lato;
  /** Misura anta standard più vicina, se entro tolleranza (es. "800 × 2100"). */
  misuraStandardVicina?: string;
  avvisi: string[];
  generataIl: string;
}

export interface EsitoCalcolo {
  ok: boolean;
  errori: string[];
  scheda?: SchedaProduzione;
}
