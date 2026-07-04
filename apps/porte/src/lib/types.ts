/**
 * Tipi di dominio per la gestione porte.
 *
 * Terminologia (standard italiano porte interne):
 * - Foro muro (vano grezzo): apertura nella parete misurata larghezza × altezza (cm).
 * - Controtelaio: struttura in legno murata nel foro (opzionale, dipende dalla posa).
 * - Telaio (stipite): profilo che sostiene l'anta; battuta 12 mm, spessore ~33 mm.
 * - Anta: pannello mobile della porta (misura nominale).
 * - Coprifilo: profilo di finitura tra telaio e muro; dritto o telescopico.
 * - Bussola / Imbotte: rivestimento del vano su tutto lo spessore del muro.
 * - Luce netta: passaggio reale utile (anta - battuta).
 * - Fisso: pannello laterale non apribile abbinato alla porta.
 * - Sopraluce: pannello superiore fisso sopra la porta.
 */

export type ModelloPorta =
  | "battente"
  | "filo-muro"
  | "scorrevole-esterno"
  | "scorrevole-interno-scomparsa";

export type LatoCerniere = "sinistra" | "destra";
export type VersoApertura = "spinta" | "tira";

export type TipoVetro = "nessuno" | "rettangolare" | "ovale" | "tondo";

export type TipoCoprifilo = "dritto" | "telescopico" | "nessuno";

export interface OpzioniPorta {
  bussola: boolean;
  fisso: boolean;
  fissoLarghezzaCm?: number;
  sopraluce: boolean;
  sopraluceAltezzaCm?: number;
  vetro: TipoVetro;
  maniglia: LatoCerniere;
  versoApertura: VersoApertura;
  coprifilo: TipoCoprifilo;
}

export interface DimensioniInput {
  foroLarghezzaCm: number;
  foroAltezzaCm: number;
  spessoreMuroCm: number;
}

export interface OrdineInput {
  cliente: string;
  riferimento: string;
  ambiente?: string;
  modello: ModelloPorta;
  dimensioni: DimensioniInput;
  opzioni: OpzioniPorta;
  note?: string;
}

export interface Ordine extends OrdineInput {
  id: string;
  creatoIl: string;
  calcolo: RisultatoCalcolo;
}

export interface DimensioniAnta {
  larghezzaCm: number;
  altezzaCm: number;
  spessoreMm: number;
}

export interface DimensioniTelaio {
  larghezzaCm: number;
  altezzaCm: number;
  profondita: {
    minMm: number;
    maxMm: number;
    consigliatoMm: number;
  };
  battutaMm: number;
}

export interface DimensioniCoprifilo {
  larghezzaMm: number;
  spessoreMm: number;
  tipo: TipoCoprifilo;
  telescopicoRangeMm?: [number, number];
}

export interface DimensioniFisso {
  larghezzaCm: number;
  altezzaCm: number;
}

export interface DimensioniSopraluce {
  larghezzaCm: number;
  altezzaCm: number;
}

export interface Avvertenza {
  livello: "info" | "attenzione" | "errore";
  messaggio: string;
}

export interface RisultatoCalcolo {
  anta: DimensioniAnta;
  telaio: DimensioniTelaio;
  coprifilo: DimensioniCoprifilo;
  fisso?: DimensioniFisso;
  sopraluce?: DimensioniSopraluce;
  luceNettaCm: number;
  ingombroTotaleLarghezzaCm: number;
  ingombroTotaleAltezzaCm: number;
  avvertenze: Avvertenza[];
  descrizioneModello: string;
}
