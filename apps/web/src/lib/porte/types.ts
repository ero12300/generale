export type TipologiaPorta =
  | "battente"
  | "battente_fisso"
  | "battente_sopraluce"
  | "battente_fisso_sopraluce"
  | "doppia_battente";

export type AperturaPorta = "destra" | "sinistra";
export type VersoApertura = "verso" | "lontano";
export type TipoVetro = "nessuno" | "intero" | "ovale" | "parziale";
export type PosizioneManigliaPorta = "sinistra" | "destra";

export interface VanoPausa {
  larghezzaVano: number; // mm
  altezzaVano: number; // mm
  spessoreMuro: number; // mm
}

export interface ConfigurazionePorta {
  vano: VanoPausa;
  tipologia: TipologiaPorta;
  apertura: AperturaPorta;
  versoApertura: VersoApertura;
  tipoVetro: TipoVetro;
  posizioneManigliaPorta: PosizioneManigliaPorta;
  larghezzaAntaPersonalizzata?: number; // mm - se vuole anta specifica
  altezzaAntaPersonalizzata?: number; // mm
  conCerniere: boolean;
  conSerratura: boolean;
  noteExtra?: string;
}

export interface DimensioniPorta {
  // Dimensioni vano muro
  larghezzaVano: number;
  altezzaVano: number;
  spessoreMuro: number;

  // Controtelaio (falso telaio - parte murata)
  larghezzaControtelaio: number;
  altezzaControtelaio: number;

  // Luce telaio (apertura netta dentro il controtelaio)
  larghezzaLuce: number;
  altezzaLuce: number;

  // Anta principale
  larghezzaAnta: number;
  altezzaAnta: number;

  // Fisso laterale (se presente)
  larghezzaFisso?: number;
  altezzaFisso?: number;

  // Sopraluce (se presente)
  larghezzaSopraluce?: number;
  altezzaSopraluce?: number;

  // Telaio spessore
  spessoreTelaio: number;

  // Apertura
  apertura: AperturaPorta;
  versoApertura: VersoApertura;
  posizioneManigliaPorta: PosizioneManigliaPorta;

  // Tipologia
  tipologia: TipologiaPorta;
  tipoVetro: TipoVetro;

  // Altezza standard anta più vicina
  antaStandardSuggerita: number;
  larghezzaStandardSuggerita: number;

  // Note e avvisi
  avvisi: string[];
}

export const LARGHEZZE_STANDARD_ANTA = [60, 70, 75, 80, 90, 100] as const;
export const ALTEZZE_STANDARD_ANTA = [200, 205, 210, 215, 220, 240] as const;
