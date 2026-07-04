/**
 * Tipi di dominio del configuratore porte.
 * Tutte le misure sono in MILLIMETRI (numeri interi, mai float).
 */

export type ModelloPorta =
  | "battente" // porta girevole classica a 1 anta
  | "bussola" // porta a 2 ante (anta apribile + anta semifissa)
  | "scorrevole_scomparsa" // scorre dentro il controtelaio nel muro
  | "scorrevole_esterno" // scorre esterno muro su binario a vista
  | "ventola"; // va e vieni bidirezionale (tipo saloon)

export type LatoApertura = "destra" | "sinistra";
export type Movimento = "spingere" | "tirare";
export type FormaOblo = "tondo" | "quadro";

/** Rilievo del vano vuoto nel muro (foro muro grezzo). */
export interface ForoMuro {
  larghezza: number;
  altezza: number;
  spessoreMuro: number;
}

export interface OpzioneFisso {
  presente: boolean;
  lato: LatoApertura;
  larghezza: number;
}

/** Sopraluce vetrato sopra l'anta ("display"). */
export interface OpzioneDisplay {
  presente: boolean;
  altezza: number;
}

export interface OpzioneOblo {
  presente: boolean;
  forma: FormaOblo;
  /** Diametro se tondo, lato se quadro. */
  dimensione: number;
  /** Quota del centro oblò dal pavimento. */
  altezzaCentro: number;
}

export interface ConfigurazionePorta {
  commessa: string;
  modello: ModelloPorta;
  foroMuro: ForoMuro;
  apertura: {
    lato: LatoApertura;
    movimento: Movimento;
  };
  fisso: OpzioneFisso;
  display: OpzioneDisplay;
  oblo: OpzioneOblo;
  /** Quota maniglia dal pavimento (standard 900 mm). */
  altezzaManiglia: number;
}

export interface Dimensione {
  larghezza: number;
  altezza: number;
}

export interface RisultatoCalcolo {
  ok: boolean;
  errori: string[];
  avvisi: string[];
  /** Luce netta di passaggio a porta aperta. */
  lucePassaggio: Dimensione;
  /** Misura dell'anta apribile da mandare in produzione. */
  anta: Dimensione;
  /** Anta semifissa (solo bussola a 2 ante). */
  antaSemifissa: Dimensione | null;
  /** Ingombro esterno del telaio finito. */
  esternoTelaio: Dimensione;
  /** Opera morta: controtelaio / falso telaio da murare. */
  controtelaio: Dimensione;
  /** Pannello fisso laterale (se presente). */
  pannelloFisso: (Dimensione & { lato: LatoApertura }) | null;
  /** Taglio vetro del sopraluce/display (se presente). */
  vetroDisplay: Dimensione | null;
  /** Oblò verificato (se presente). */
  oblo: (OpzioneOblo & { presente: true }) | null;
  ferramenta: {
    numeroCerniere: number;
    latoCerniere: LatoApertura | null;
    latoManiglia: LatoApertura | null;
    altezzaManiglia: number;
    descrizioneApertura: string;
  };
  telaio: {
    spessoreMuro: number;
    fuoriStandard: boolean;
    allargamentiNecessari: boolean;
  };
  /** Ingombro totale per scorrevoli (controtelaio o binario). */
  ingombroScorrevole: Dimensione | null;
  misuraStandard: {
    esatta: boolean;
    larghezza: number;
    altezza: number;
  } | null;
}
