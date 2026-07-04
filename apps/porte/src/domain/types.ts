/**
 * Tutte le misure sono espresse in millimetri (mm) come numeri interi.
 * Nessun importo/misura usa float con decimali: gli arrotondamenti sono espliciti.
 */

export type ModelloId = "battente-classic" | "filo-muro" | "rei-60" | "rei-120";

export type NumeroAnte = 1 | 2;

/** Tipo dell'anta secondaria in una porta a due ante. */
export type TipoAntaSecondaria = "compasso" | "fissa";

/** Ripartizione delle ante in una porta doppia. */
export type Ripartizione = "simmetrica" | "asimmetrica";

/** Verso di apertura guardando la porta dal lato serratura (lato a spingere). */
export type Verso = "destra" | "sinistra";

export type Movimento = "spingere" | "tirare";

export type FormaOblo = "tondo" | "ovale";

export interface DefinizioneModello {
  id: ModelloId;
  nome: string;
  descrizione: string;
  /** Detrazione totale dal foro muro alla luce netta telaio (larghezza). */
  detrazioneTelaioL: number;
  /** Detrazione totale dal foro muro alla luce netta telaio (altezza). */
  detrazioneTelaioH: number;
  /** Sovrapposizione dell'anta sulla battuta del telaio, per lato verticale. */
  battutaLaterale: number;
  /** Sovrapposizione dell'anta sulla battuta superiore. */
  battutaSuperiore: number;
  /** Gioco aria tra anta e telaio, per lato (porte senza battuta, es. filo muro). */
  giocoLaterale: number;
  /** Gioco aria tra anta e pavimento. */
  giocoPavimento: number;
  /** Spessore anta. */
  spessoreAnta: number;
  /** Larghezza del montante/battuta centrale tra le due ante (porte doppie). */
  sormontoCentrale: number;
  /** Limiti foro muro per 1 anta. */
  minL1: number;
  maxL1: number;
  /** Limiti foro muro per 2 ante. */
  minL2: number;
  maxL2: number;
  minH: number;
  maxH: number;
  consenteDueAnte: boolean;
  consenteOblo: boolean;
  consenteVetrina: boolean;
  /** Limite foro muro L oltre il quale l'oblò non è ammesso (porte 1 anta). */
  maxL1ConOblo: number | null;
  /** Tolleranza di posa per il controtelaio / opera morta (per lato). */
  tolleranzaPosa: number;
}

export interface InputPorta {
  modello: ModelloId;
  /** Foro muro — larghezza (mm). */
  foroL: number;
  /** Foro muro — altezza (mm). */
  foroH: number;
  /** Spessore muro finito (mm). */
  spessoreMuro: number;
  numeroAnte: NumeroAnte;
  tipoAntaSecondaria: TipoAntaSecondaria;
  ripartizione: Ripartizione;
  verso: Verso;
  movimento: Movimento;
  conOblo: boolean;
  formaOblo: FormaOblo;
  conVetrina: boolean;
}

export interface Anta {
  ruolo: "unica" | "principale" | "semifissa" | "fissa";
  larghezza: number;
  altezza: number;
  spessore: number;
}

export interface DettaglioOblo {
  forma: FormaOblo;
  /** Diametro (tondo) o larghezza (ovale). */
  larghezza: number;
  altezza: number;
  /** Quota dal pavimento al centro dell'oblò. */
  quotaCentroDaPavimento: number;
}

export interface DettaglioVetrina {
  larghezza: number;
  altezza: number;
  /** Quota dal pavimento al bordo inferiore del vetro. */
  quotaInferioreDaPavimento: number;
}

export interface SchedaProduzione {
  input: InputPorta;
  modello: DefinizioneModello;
  /** Luce netta interna del telaio. */
  luceTelaioL: number;
  luceTelaioH: number;
  /** Luce di passaggio effettiva ad anta aperta a 90°. */
  lucePassaggioL: number;
  lucePassaggioH: number;
  ante: Anta[];
  /** Lato cerniere guardando dal lato a spingere. */
  latoCerniere: Verso;
  /** Lato maniglia guardando dal lato a spingere. */
  latoManiglia: Verso;
  numeroCerniere: number;
  altezzaManiglia: number;
  oblo: DettaglioOblo | null;
  vetrina: DettaglioVetrina | null;
  /** Dimensioni interne del controtelaio (opera morta) con tolleranza di posa. */
  controtelaioL: number;
  controtelaioH: number;
  avvertenze: string[];
}

export interface EsitoCalcolo {
  ok: boolean;
  errori: string[];
  scheda: SchedaProduzione | null;
}

export interface Commessa {
  id: string;
  riferimento: string;
  creataIl: string;
  input: InputPorta;
}
