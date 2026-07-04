// Tipi condivisi del configuratore porte.
// Tutte le misure sono espresse in millimetri (interi) per evitare errori di
// arrotondamento tipici dei float; la conversione in cm avviene solo in UI.

export type OpeningType =
  | "battente"
  | "compasso"
  | "scorrevole_esterno"
  | "scomparsa";

export const OPENING_TYPES: OpeningType[] = [
  "battente",
  "compasso",
  "scorrevole_esterno",
  "scomparsa",
];

export const OPENING_LABELS: Record<OpeningType, string> = {
  battente: "Battente",
  compasso: "A compasso",
  scorrevole_esterno: "Scorrevole esterno muro",
  scomparsa: "Scorrevole a scomparsa",
};

/** Lato cerniere / senso di apertura. */
export type Verso = "sx" | "dx";

export const VERSO_LABELS: Record<Verso, string> = {
  sx: "Sinistra",
  dx: "Destra",
};

/** Direzione di spinta rispetto a chi guarda il disegno (lato di riferimento). */
export type Spinta = "spinge" | "tira";

export const SPINTA_LABELS: Record<Spinta, string> = {
  spinge: "Spinge (verso interno)",
  tira: "Tira (verso di sé)",
};

/** Oblò / vetratura circolare o ovale. */
export type Oblo = "nessuno" | "tondo" | "ovale";

export const OBLO_LABELS: Record<Oblo, string> = {
  nessuno: "Nessuno",
  tondo: "Oblò tondo",
  ovale: "Oblò ovale",
};

/**
 * Parametri di detrazione di un modello di porta.
 * Definiscono come, a partire dal foro muro, si ricavano anta, telaio e luce.
 * Sono editabili così il falegname può tarare il modello sul proprio sistema.
 */
export interface ModelDeductions {
  /** foro muro -> larghezza anta (mm sottratti) */
  antaLarghezza: number;
  /** foro muro -> altezza anta (mm sottratti) */
  antaAltezza: number;
  /** foro muro -> ingombro esterno telaio in larghezza (mm sottratti, gioco di posa) */
  telaioLarghezza: number;
  /** foro muro -> ingombro esterno telaio in altezza (mm sottratti, gioco di posa) */
  telaioAltezza: number;
  /** riduzione per lato tra anta e luce netta di passaggio (battuta/cerniera) */
  battutaPerLato: number;
}

export interface DoorModel {
  id: string;
  nome: string;
  descrizione: string;
  /** tipo di apertura predefinito del modello */
  tipoApertura: OpeningType;
  /** opzioni disponibili per questo modello */
  supportaCompasso: boolean;
  supportaAntaFissa: boolean;
  supportaVetro: boolean;
  supportaOblo: boolean;
  deduzioni: ModelDeductions;
}

/** Input dell'ordine: cosa inserisce l'utente. */
export interface DoorInput {
  modelId: string;
  tipoApertura: OpeningType;
  foroLarghezza: number; // mm
  foroAltezza: number; // mm
  spessoreMuro: number; // mm
  verso: Verso;
  spinta: Spinta;
  compasso: boolean;
  antaFissa: boolean;
  antaFissaLarghezza: number; // mm, valido se antaFissa
  vetro: boolean;
  oblo: Oblo;
  note: string;
}

export type Severity = "info" | "warning" | "error";

export interface CalcMessage {
  severity: Severity;
  testo: string;
}

/** Risultato del calcolo, pronto per la produzione. */
export interface DoorResult {
  input: DoorInput;
  modello: DoorModel;
  /** dimensioni anta principale (mm) — misura da mandare in produzione */
  anta: { larghezza: number; altezza: number };
  /** eventuale anta fissa (mm) */
  antaFissa: { larghezza: number; altezza: number } | null;
  /** ingombro esterno telaio (mm) — deve stare nel foro muro */
  telaio: { larghezza: number; altezza: number };
  /** luce netta di passaggio effettiva (mm) */
  lucePassaggio: { larghezza: number; altezza: number };
  /** profondità telaio consigliata (mm) in base allo spessore muro */
  profonditaTelaio: number;
  /** ingombro complessivo richiesto in parete (mm) — utile per scorrevoli */
  ingombroTotale: { larghezza: number; altezza: number };
  /** lato maniglia (opposto alle cerniere) */
  latoManiglia: Verso;
  /** altezza consigliata maniglia da pavimento (mm) */
  altezzaManiglia: number;
  messaggi: CalcMessage[];
}
