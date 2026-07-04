import type {
  DoorCalculationInput,
  DoorModel,
  DoorPlan,
  DoorSide,
  HandleSide,
} from "./types";

type DoorModelPreset = {
  label: string;
  wallGapSideMm: number;
  topGapMm: number;
  floorGapMm: number;
  frameProfileMm: number;
  leafClearanceMm: number;
  leafTopClearanceMm: number;
  leafThicknessMm: number;
  maxActiveLeafWidthMm: number | null;
  hardware: string[];
};

const MODEL_PRESETS: Record<DoorModel, DoorModelPreset> = {
  hinged: {
    label: "Porta battente",
    wallGapSideMm: 10,
    topGapMm: 10,
    floorGapMm: 7,
    frameProfileMm: 45,
    leafClearanceMm: 4,
    leafTopClearanceMm: 10,
    leafThicknessMm: 44,
    maxActiveLeafWidthMm: 920,
    hardware: ["3 cerniere", "Serratura magnetica", "Maniglia passante"],
  },
  compass: {
    label: "Porta a compasso",
    wallGapSideMm: 10,
    topGapMm: 10,
    floorGapMm: 7,
    frameProfileMm: 50,
    leafClearanceMm: 6,
    leafTopClearanceMm: 12,
    leafThicknessMm: 44,
    maxActiveLeafWidthMm: 860,
    hardware: ["Kit compasso", "Guida superiore", "Maniglia passante"],
  },
  fixed: {
    label: "Pannello fisso",
    wallGapSideMm: 8,
    topGapMm: 8,
    floorGapMm: 6,
    frameProfileMm: 40,
    leafClearanceMm: 4,
    leafTopClearanceMm: 8,
    leafThicknessMm: 40,
    maxActiveLeafWidthMm: null,
    hardware: ["Pannello fisso senza ferramenta di apertura"],
  },
};

function oppositeSide(side: DoorSide): DoorSide {
  return side === "left" ? "right" : "left";
}

function sideLabel(side: DoorSide): string {
  return side === "left" ? "sinistra" : "destra";
}

function swingLabel(swing: DoorCalculationInput["swing"]): string {
  return swing === "in" ? "a tirare" : "a spingere";
}

export function calculateDoorPlan(input: DoorCalculationInput): DoorPlan {
  const preset = MODEL_PRESETS[input.model];
  const frameOuterWidthMm =
    input.roughOpening.widthMm - preset.wallGapSideMm * 2;
  const frameOuterHeightMm =
    input.roughOpening.heightMm - preset.topGapMm - preset.floorGapMm;
  const availableLeafWidthMm =
    frameOuterWidthMm - preset.frameProfileMm * 2 - preset.leafClearanceMm;
  const handleSide: HandleSide =
    input.model === "fixed" ? "none" : oppositeSide(input.hingeSide);
  const maxLeaf = preset.maxActiveLeafWidthMm;
  const shouldAddDeadWork =
    input.options.fixedPanel !== "none" &&
    maxLeaf !== null &&
    availableLeafWidthMm > maxLeaf;
  const deadWorkWidthMm = shouldAddDeadWork ? availableLeafWidthMm - maxLeaf : 0;
  const activeLeafWidthMm = shouldAddDeadWork && maxLeaf ? maxLeaf : availableLeafWidthMm;
  const openingLabel =
    input.model === "fixed"
      ? "pannello fisso"
      : `${sideLabel(input.hingeSide)} ${swingLabel(input.swing)}`;

  const hardware = [...preset.hardware];
  if (input.options.hasDisplay) {
    hardware.push("Predisposizione display");
  }
  if (input.options.hasOvalWindow) {
    hardware.push("Oblo ovale");
  }

  return {
    model: input.model,
    modelLabel: preset.label,
    frame: {
      outerWidthMm: frameOuterWidthMm,
      outerHeightMm: frameOuterHeightMm,
      depthMm: input.roughOpening.wallThicknessMm,
      profileMm: preset.frameProfileMm,
    },
    activeLeaf: {
      widthMm: activeLeafWidthMm,
      heightMm:
        frameOuterHeightMm - preset.frameProfileMm - preset.leafTopClearanceMm,
      thicknessMm: preset.leafThicknessMm,
    },
    deadWork: {
      side: deadWorkWidthMm > 0 && handleSide !== "none" ? handleSide : "none",
      widthMm: deadWorkWidthMm,
      reason:
        deadWorkWidthMm > 0 && maxLeaf
          ? `Anta massima ${maxLeaf} mm superata`
          : "",
    },
    handing: {
      hingeSide: input.hingeSide,
      handleSide,
      swing: input.swing,
      openingLabel,
    },
    accessories: {
      hasDisplay: input.options.hasDisplay,
      hasOvalWindow: input.options.hasOvalWindow,
    },
    hardware,
    productionNotes:
      input.model === "fixed"
        ? [`${preset.label} ${frameOuterWidthMm}x${frameOuterHeightMm} mm`]
        : [
            `${preset.label} ${openingLabel}`,
            `Maniglia ${handleSide === "none" ? "non prevista" : sideLabel(handleSide)}`,
          ],
  };
}
