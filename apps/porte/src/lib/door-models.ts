import type { DeadWork, DoorModel } from "./types";

/**
 * Modelli porta basati su standard Federlegno / produttori italiani.
 * Riferimento: tabelle Micheloni Porte, Porte in Kit, Barausse.
 */
export const DOOR_MODELS: DoorModel[] = [
  {
    id: "battente-liscia",
    name: "Battente liscia",
    description: "Porta a battente classica, pannello liscio senza vetri",
    system: "battente",
    features: { hasDisplay: false, hasOval: false, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "battente-display",
    name: "Battente con display",
    description: "Porta a battente con vetro display centrale rettangolare",
    system: "battente",
    features: { hasDisplay: true, hasOval: false, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "battente-ovale",
    name: "Battente con oblò ovale",
    description: "Porta a battente con oblò ovale decorativo",
    system: "battente",
    features: { hasDisplay: false, hasOval: true, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "battente-display-ovale",
    name: "Battente display + ovale",
    description: "Porta con vetro display e oblò ovale superiore",
    system: "battente",
    features: { hasDisplay: true, hasOval: true, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "bussola-liscia",
    name: "Bussola liscia",
    description: "Sistema bussola con anta pivotante, pannello liscio",
    system: "bussola",
    features: { hasDisplay: false, hasOval: false, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "bussola-fissa",
    name: "Bussola con anta fissa",
    description: "Sistema bussola con anta fissa laterale e anta apribile",
    system: "bussola",
    features: { hasDisplay: false, hasOval: false, hasFixedPanel: true },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "bussola-display",
    name: "Bussola con display",
    description: "Bussola con vetro display su anta apribile",
    system: "bussola",
    features: { hasDisplay: true, hasOval: false, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
  {
    id: "fissa-liscia",
    name: "Anta fissa",
    description: "Pannello fisso senza apertura, per partizioni o complementi",
    system: "fissa",
    features: { hasDisplay: false, hasOval: false, hasFixedPanel: true },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 0,
  },
  {
    id: "fissa-display",
    name: "Anta fissa con display",
    description: "Pannello fisso con vetro display centrale",
    system: "fissa",
    features: { hasDisplay: true, hasOval: false, hasFixedPanel: true },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 0,
  },
  {
    id: "scorrevole-liscia",
    name: "Scorrevole esterno muro",
    description: "Porta scorrevole a binario esterno, pannello liscio",
    system: "scorrevole",
    features: { hasDisplay: false, hasOval: false, hasFixedPanel: false },
    panelThicknessMm: 44,
    frameStileWidthMm: 80,
    defaultDeadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
    handleHeightMm: 1050,
  },
];

export const DEAD_WORK_PRESETS: { id: string; label: string; deadWork: DeadWork }[] = [
  {
    id: "standard",
    label: "Standard (+10 cm larghezza, +5 cm altezza)",
    deadWork: { widthMm: 100, heightMm: 50, floorClearanceMm: 10 },
  },
  {
    id: "compatto",
    label: "Compatto (+8 cm larghezza, +4 cm altezza)",
    deadWork: { widthMm: 80, heightMm: 40, floorClearanceMm: 10 },
  },
  {
    id: "ampio",
    label: "Ampio (+12 cm larghezza, +6 cm altezza)",
    deadWork: { widthMm: 120, heightMm: 60, floorClearanceMm: 10 },
  },
];

export function getDoorModel(id: string): DoorModel | undefined {
  return DOOR_MODELS.find((m) => m.id === id);
}

export const OPENING_DIRECTION_LABELS: Record<string, string> = {
  dx_tirare: "Destra a tirare",
  dx_spingere: "Destra a spingere",
  sx_tirare: "Sinistra a tirare",
  sx_spingere: "Sinistra a spingere",
};

export const SYSTEM_LABELS: Record<string, string> = {
  battente: "A battente",
  bussola: "Bussola",
  fissa: "Fissa",
  scorrevole: "Scorrevole",
};
