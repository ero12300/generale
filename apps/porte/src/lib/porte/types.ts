/**
 * Tipi dominio per il configuratore porte.
 *
 * Convenzione: tutte le dimensioni interne sono in **millimetri** (numero intero).
 * L'UI accetta cm o mm e converte prima di passare al dominio.
 */

/** Tipologia costruttiva della porta. */
export type Tipologia =
  | "battente"
  | "scorrevole_esterno"
  | "scorrevole_scomparsa"
  | "filo_muro"
  | "pieghevole";

/**
 * Verso di apertura secondo convenzione DIN (usata in Italia).
 * Ci si posiziona sul lato in cui sono visibili le cerniere:
 * - `dx`: cerniere a destra (la maniglia è a sinistra)
 * - `sx`: cerniere a sinistra (la maniglia è a destra)
 *
 * Combinato con `manovra` (spingere/tirare) → 4 varianti canoniche:
 *   DX-spingere, SX-spingere, DX-tirare, SX-tirare.
 */
export type LatoCerniere = "dx" | "sx";
export type ManovraApertura = "spingere" | "tirare";

/** Posizione dell'oblò (se presente). */
export type FormaOblo = "tondo" | "ovale";

/** Lato del fisso laterale (se presente). */
export type LatoFisso = "dx" | "sx" | "entrambi";

/**
 * Foro muro (vano grezzo).
 * - `larghezza` e `altezza`: dimensioni dell'apertura nel muro
 * - `spessoreMuro`: spessore parete finita (per dimensionare il controtelaio)
 * Tutti in mm.
 */
export interface ForoMuro {
  larghezza: number;
  altezza: number;
  spessoreMuro: number;
}

/** Opzioni configurabili sulla porta. */
export interface OpzioniPorta {
  /** Aggiunge un sopraluce (finestra fissa sopra la porta). Altezza in mm. */
  sopraluce: { presente: false } | { presente: true; altezza: number };
  /** Aggiunge uno o due fissi laterali. Larghezza per lato in mm. */
  fissoLaterale:
    | { presente: false }
    | { presente: true; lato: LatoFisso; larghezza: number };
  /** Oblò sull'anta. */
  oblo: { presente: false } | { presente: true; forma: FormaOblo };
  /** Se true, dimensionare anche il controtelaio (battente / filo muro). */
  conControtelaio: boolean;
}

/** Input completo del configuratore. */
export interface ConfigurazionePorta {
  tipologia: Tipologia;
  foroMuro: ForoMuro;
  latoCerniere: LatoCerniere;
  manovra: ManovraApertura;
  opzioni: OpzioniPorta;
  /** Codice/riferimento commessa (facoltativo). */
  riferimento?: string;
  /** Note produzione (facoltativo). */
  note?: string;
}

/** Dimensioni di un elemento rettangolare (in mm). */
export interface Dimensioni {
  larghezza: number;
  altezza: number;
}

/** Un avviso non-bloccante (misura non standard, ecc.). */
export interface Avviso {
  livello: "info" | "warning" | "error";
  messaggio: string;
}

/**
 * Risultato del calcolo. Contiene le misure di tutti gli elementi
 * necessari alla produzione + eventuali avvisi.
 */
export interface RisultatoCalcolo {
  tipologia: Tipologia;
  foroMuro: ForoMuro;

  /** Controtelaio: sempre presente per scorrevole a scomparsa; opzionale per gli altri. */
  controtelaio: { presente: false } | { presente: true; esterno: Dimensioni; interno: Dimensioni };

  /** Telaio (cornice fissa visibile). */
  telaio: { esterno: Dimensioni; interno: Dimensioni; spessoreMontante: number };

  /** Anta / battente principale. */
  anta: Dimensioni;

  /** Luce di passaggio netta (l'apertura effettiva quando la porta è aperta). */
  lucePassaggio: Dimensioni;

  /** Sopraluce (se richiesto). */
  sopraluce: null | Dimensioni;

  /** Fisso laterale (se richiesto). Larghezza per lato + altezza. */
  fissoLaterale:
    | null
    | { lato: LatoFisso; larghezza: number; altezza: number };

  /** Oblò (se richiesto). Dimensioni indicative in mm. */
  oblo: null | { forma: FormaOblo; larghezza: number; altezza: number };

  /**
   * Ingombro complessivo in parete (solo scorrevoli, dove il "foro muro"
   * comunicato è la sola luce di passaggio e serve spazio aggiuntivo).
   */
  ingombroParete: null | Dimensioni;

  /**
   * Sintesi del verso di apertura in stringa canonica.
   * Es. "DX a spingere", "SX a tirare".
   */
  versoApertura: string;

  /** Posizione derivata della maniglia. */
  posizioneManiglia: LatoCerniere;

  /** Avvisi non bloccanti generati durante il calcolo. */
  avvisi: Avviso[];
}
