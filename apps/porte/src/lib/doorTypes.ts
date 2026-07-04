export type DoorType = "battente" | "scorrevole" | "complanare";
export type OpeningDirection = "sinistra" | "destra";
export type OpeningVerse = "interno" | "esterno";
export type HandleSide = "sinistra" | "destra";

export interface WallMeasurements {
  width: number;   // luce muraria larghezza (mm)
  height: number;  // luce muraria altezza (mm)
  thickness: number; // spessore muro (mm)
}

export interface DoorOptions {
  hasFisso: boolean;
  fissoSide: "sinistra" | "destra";
  fissoWidth: number; // mm
  hasMostra: boolean;  // mostra/vetro superiore
  hasOvale: boolean;   // ovale decorativo
  hasBussola: boolean; // portellino/oblò aggiuntivo
  openingDirection: OpeningDirection;
  openingVerse: OpeningVerse;
  handleSide: HandleSide;
  doorType: DoorType;
}

export interface DoorCalculationResult {
  // Vano muro (input)
  luce_muraria_l: number;
  luce_muraria_h: number;
  spessore_muro: number;

  // Controtelaio (rough frame in wall)
  controtelaio_l: number;
  controtelaio_h: number;

  // Telaio (finished frame)
  telaio_l_esterno: number;
  telaio_h_esterno: number;
  telaio_luce_netta_l: number;
  telaio_luce_netta_h: number;

  // Anta (door leaf)
  anta_l: number;
  anta_h: number;

  // Fisso (fixed panel)
  fisso_l: number | null;
  fisso_h: number | null;

  // Coprifili (cover strips)
  coprifilo_larghezza: number;

  // Nearest standard size recommendation
  standard_suggerita_l: number;
  standard_suggerita_h: number;

  // Tolerances used
  profilo_telaio: number;
  giunto_morto_lato: number;
  giunto_morto_alto: number;
  giunto_pavimento: number;
}

export interface DoorConfiguration {
  measurements: WallMeasurements;
  options: DoorOptions;
  result: DoorCalculationResult | null;
}

export const STANDARD_WIDTHS = [600, 650, 700, 750, 800, 900, 1000, 1200];
export const STANDARD_HEIGHTS = [1950, 2000, 2050, 2100, 2150, 2200];
export const STANDARD_THICKNESSES = [70, 80, 90, 100, 110, 120];

export const DOOR_TYPE_LABELS: Record<DoorType, string> = {
  battente: "Battente",
  scorrevole: "Scorrevole",
  complanare: "Complanare (filomuro)",
};

export const DOOR_TYPE_DESCRIPTIONS: Record<DoorType, string> = {
  battente: "Porta standard con cerniere — si apre verso l'interno o l'esterno",
  scorrevole: "Scorre lateralmente — ideale per spazi ridotti",
  complanare: "Anta a filo muro — massima integrazione estetica",
};
