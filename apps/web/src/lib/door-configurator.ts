export type DoorModel = "compasso" | "compasso_fisso" | "scorrevole" | "pivot";

export type OpeningDirection = "sinistra" | "destra";
export type SwingType = "spinge" | "tira";
export type HandleSide = "sinistra" | "destra";

export interface DoorConfiguratorInput {
  model: DoorModel;
  wallOpeningWidthMm: number;
  wallOpeningHeightMm: number;
  deadWorkSideMm: number;
  deadWorkTopMm: number;
  deadWorkBottomMm: number;
  hasDisplayPanel: boolean;
  hasOvalWindow: boolean;
  openingDirection: OpeningDirection;
  swingType: SwingType;
  handleSide: HandleSide;
}

interface ModelRules {
  frameSideReductionMm: number;
  frameTopReductionMm: number;
  frameBottomReductionMm: number;
  leafSideGapMm: number;
  leafTopGapMm: number;
  leafBottomGapMm: number;
  fixedPanelShare: number;
  slidingOverlapMm: number;
}

const MODEL_RULES: Record<DoorModel, ModelRules> = {
  compasso: {
    frameSideReductionMm: 14,
    frameTopReductionMm: 10,
    frameBottomReductionMm: 8,
    leafSideGapMm: 3,
    leafTopGapMm: 3,
    leafBottomGapMm: 8,
    fixedPanelShare: 0,
    slidingOverlapMm: 0,
  },
  compasso_fisso: {
    frameSideReductionMm: 14,
    frameTopReductionMm: 10,
    frameBottomReductionMm: 8,
    leafSideGapMm: 3,
    leafTopGapMm: 3,
    leafBottomGapMm: 8,
    fixedPanelShare: 0.32,
    slidingOverlapMm: 0,
  },
  scorrevole: {
    frameSideReductionMm: 8,
    frameTopReductionMm: 8,
    frameBottomReductionMm: 6,
    leafSideGapMm: 0,
    leafTopGapMm: 4,
    leafBottomGapMm: 10,
    fixedPanelShare: 0,
    slidingOverlapMm: 40,
  },
  pivot: {
    frameSideReductionMm: 10,
    frameTopReductionMm: 8,
    frameBottomReductionMm: 8,
    leafSideGapMm: 8,
    leafTopGapMm: 6,
    leafBottomGapMm: 8,
    fixedPanelShare: 0,
    slidingOverlapMm: 0,
  },
};

export interface DoorConfiguratorResult {
  modelLabel: string;
  netFrameWidthMm: number;
  netFrameHeightMm: number;
  leafWidthMm: number;
  leafHeightMm: number;
  fixedPanelWidthMm: number | null;
  openingSummary: string;
  handleSummary: string;
  notes: string[];
}

export function computeDoorConfiguration(input: DoorConfiguratorInput): DoorConfiguratorResult {
  const rules = MODEL_RULES[input.model];
  const totalSideReduction = (input.deadWorkSideMm + rules.frameSideReductionMm) * 2;
  const totalTopReduction = input.deadWorkTopMm + rules.frameTopReductionMm;
  const totalBottomReduction = input.deadWorkBottomMm + rules.frameBottomReductionMm;

  const netFrameWidthMm = clampPositive(input.wallOpeningWidthMm - totalSideReduction);
  const netFrameHeightMm = clampPositive(input.wallOpeningHeightMm - totalTopReduction - totalBottomReduction);

  const fixedPanelWidthMm =
    input.model === "compasso_fisso" ? roundMm(netFrameWidthMm * rules.fixedPanelShare) : null;

  let leafWidthMm: number;
  if (input.model === "compasso_fisso" && fixedPanelWidthMm) {
    const activeSection = netFrameWidthMm - fixedPanelWidthMm - 4;
    leafWidthMm = clampPositive(activeSection - rules.leafSideGapMm * 2);
  } else if (input.model === "scorrevole") {
    leafWidthMm = clampPositive(netFrameWidthMm + rules.slidingOverlapMm);
  } else {
    leafWidthMm = clampPositive(netFrameWidthMm - rules.leafSideGapMm * 2);
  }

  const leafHeightMm = clampPositive(
    netFrameHeightMm - rules.leafTopGapMm - rules.leafBottomGapMm
  );

  const notes: string[] = [];
  if (input.hasDisplayPanel) {
    notes.push("Display/vetrata inclusa nel disegno tecnico.");
  }
  if (input.hasOvalWindow) {
    notes.push("Oblò ovale previsto sul pannello anta.");
  }
  if (input.model === "scorrevole") {
    notes.push("Calcolo anta scorrevole con sovrapposizione standard di 40 mm.");
  }
  if (input.model === "compasso_fisso") {
    notes.push("Fisso laterale dimensionato al 32% della luce telaio netta.");
  }

  return {
    modelLabel: modelToLabel(input.model),
    netFrameWidthMm,
    netFrameHeightMm,
    leafWidthMm,
    leafHeightMm,
    fixedPanelWidthMm,
    openingSummary: `${capitalize(input.openingDirection)} ${input.swingType}`,
    handleSummary: `Maniglia ${input.handleSide}`,
    notes,
  };
}

export function buildDoorScheme(
  input: DoorConfiguratorInput,
  result: DoorConfiguratorResult
): string {
  const lines = [
    "=== SCHEMA PORTA PRODUZIONE ===",
    `Modello: ${result.modelLabel}`,
    `Vano muro: ${input.wallOpeningWidthMm} x ${input.wallOpeningHeightMm} mm`,
    `Luce telaio netta: ${result.netFrameWidthMm} x ${result.netFrameHeightMm} mm`,
    `Dimensione anta: ${result.leafWidthMm} x ${result.leafHeightMm} mm`,
    `Verso apertura: ${result.openingSummary}`,
    `Lato maniglia: ${result.handleSummary}`,
    `Display/vetrata: ${input.hasDisplayPanel ? "SI" : "NO"}`,
    `Oblo ovale: ${input.hasOvalWindow ? "SI" : "NO"}`,
    `Opera morta (L/T/B): ${input.deadWorkSideMm} / ${input.deadWorkTopMm} / ${input.deadWorkBottomMm} mm`,
  ];

  if (result.fixedPanelWidthMm) {
    lines.push(`Pannello fisso: ${result.fixedPanelWidthMm} mm`);
  }
  if (result.notes.length > 0) {
    lines.push(`Note: ${result.notes.join(" | ")}`);
  }

  return lines.join("\n");
}

function clampPositive(value: number): number {
  return roundMm(Math.max(value, 0));
}

function roundMm(value: number): number {
  return Math.round(value);
}

function capitalize(value: string): string {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
}

function modelToLabel(model: DoorModel): string {
  switch (model) {
    case "compasso":
      return "Porta a compasso";
    case "compasso_fisso":
      return "Porta a compasso con fisso";
    case "scorrevole":
      return "Porta scorrevole";
    case "pivot":
      return "Porta pivot";
    default: {
      const neverModel: never = model;
      throw new Error(`Modello non gestito: ${neverModel}`);
    }
  }
}
