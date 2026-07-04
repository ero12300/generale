import type {
  DoorConfigurationInput,
  DoorConfigurationResult,
  DoorHandleSide,
  DoorModel,
} from "@deal-desk/types";

interface DoorModelPreset {
  label: string;
  frameAllowanceWidthMm: number;
  frameAllowanceHeightMm: number;
  leafDeltaFromPassageWidthMm: number;
  leafDeltaFromPassageHeightMm: number;
  maxLeafWidthMm: number;
  needsShellHandle: boolean;
}

const PRESETS: Record<DoorModel, DoorModelPreset> = {
  hinged_single: {
    label: "Battente singola",
    frameAllowanceWidthMm: 89,
    frameAllowanceHeightMm: 50,
    leafDeltaFromPassageWidthMm: 0,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 900,
    needsShellHandle: false,
  },
  hinged_with_fixed_panel: {
    label: "Battente con fisso laterale",
    frameAllowanceWidthMm: 99,
    frameAllowanceHeightMm: 50,
    leafDeltaFromPassageWidthMm: 0,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 900,
    needsShellHandle: false,
  },
  sliding_pocket: {
    label: "Scorrevole interno muro",
    frameAllowanceWidthMm: 60,
    frameAllowanceHeightMm: 50,
    leafDeltaFromPassageWidthMm: 25,
    leafDeltaFromPassageHeightMm: -4,
    maxLeafWidthMm: 1025,
    needsShellHandle: true,
  },
  sliding_external: {
    label: "Scorrevole esterno muro",
    frameAllowanceWidthMm: 0,
    frameAllowanceHeightMm: 0,
    leafDeltaFromPassageWidthMm: 100,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 1200,
    needsShellHandle: true,
  },
  folding_compass: {
    label: "Libro / compasso",
    frameAllowanceWidthMm: 70,
    frameAllowanceHeightMm: 45,
    leafDeltaFromPassageWidthMm: 0,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 950,
    needsShellHandle: false,
  },
};

export function calculateDoorConfiguration(
  input: DoorConfigurationInput
): DoorConfigurationResult {
  const preset = PRESETS[input.model];
  const clearWidthMm = Math.min(
    input.wallOpening.widthTopMm,
    input.wallOpening.widthMiddleMm,
    input.wallOpening.widthBottomMm
  );
  const clearHeightMm = Math.min(input.wallOpening.heightLeftMm, input.wallOpening.heightRightMm);
  const passageWidthMm = Math.max(0, clearWidthMm - preset.frameAllowanceWidthMm);
  const passageHeightMm = Math.max(0, clearHeightMm - preset.frameAllowanceHeightMm);
  const rawLeafWidthMm = passageWidthMm + preset.leafDeltaFromPassageWidthMm;
  const leafQuantity = input.model === "folding_compass" ? 2 : 1;
  const leafWidthMm = Math.min(
    Math.floor(rawLeafWidthMm / leafQuantity),
    preset.maxLeafWidthMm
  );
  const leafHeightMm = passageHeightMm + preset.leafDeltaFromPassageHeightMm;
  const handleSide = getHandleSide(input.model, input.openingDirection);
  const fixedPanel = buildFixedPanel(input, clearWidthMm, leafWidthMm, clearHeightMm);
  const hardwareNotes = buildHardwareNotes(input, handleSide, preset.needsShellHandle);
  const productionWarnings = buildProductionWarnings(input, fixedPanel);
  const result: DoorConfigurationResult = {
    input,
    modelLabel: preset.label,
    clearOpening: {
      widthMm: clearWidthMm,
      heightMm: clearHeightMm,
      wallDepthMm: input.wallOpening.wallDepthMm,
    },
    frame: {
      outsideWidthMm: clearWidthMm,
      outsideHeightMm: clearHeightMm,
      passageWidthMm,
      passageHeightMm,
    },
    leaf: {
      widthMm: leafWidthMm,
      heightMm: leafHeightMm,
      quantity: leafQuantity,
    },
    fixedPanel,
    openingDirection: input.openingDirection,
    handleSide,
    hardwareNotes,
    productionWarnings,
    schemeLines: [],
  };

  return {
    ...result,
    schemeLines: buildSchemeLines(result),
  };
}

function getHandleSide(model: DoorModel, openingDirection: "right" | "left"): DoorHandleSide {
  if (model === "sliding_external" || model === "sliding_pocket") {
    return openingDirection;
  }
  return openingDirection === "right" ? "left" : "right";
}

function buildFixedPanel(
  input: DoorConfigurationInput,
  clearWidthMm: number,
  leafWidthMm: number,
  clearHeightMm: number
): DoorConfigurationResult["fixedPanel"] {
  if (!input.accessories.hasFixedPanel) return null;
  if (input.model !== "hinged_with_fixed_panel") return null;

  const preset = PRESETS[input.model];
  const fixedWidthMm = Math.max(
    0,
    clearWidthMm - preset.frameAllowanceWidthMm - leafWidthMm
  );

  return {
    widthMm: fixedWidthMm,
    heightMm: clearHeightMm - preset.frameAllowanceHeightMm,
    side: input.openingDirection === "right" ? "left" : "right",
  };
}

function buildHardwareNotes(
  input: DoorConfigurationInput,
  handleSide: DoorHandleSide,
  needsShellHandle: boolean
): string[] {
  const notes = [
    `Maniglia lato ${translateLatoSide(handleSide)}`,
    `Apertura ${translateDirection(input.openingDirection)}`,
  ];

  if (needsShellHandle) {
    notes.push(`Maniglia a conchiglia lato ${translateLatoSide(handleSide)}`);
  }
  if (input.accessories.hasDisplay) {
    notes.push("Predisporre display/visore sull'anta secondo distinta ferramenta");
  }
  if (input.accessories.hasOvalWindow) {
    notes.push("Predisporre ovale/vetro sull'anta prima della finitura");
  }

  return notes;
}

function buildProductionWarnings(
  input: DoorConfigurationInput,
  fixedPanel: DoorConfigurationResult["fixedPanel"]
): string[] {
  const warnings = [
    "Rilevare sempre tre larghezze e due altezze: il calcolo usa la quota piu piccola.",
  ];

  if (!input.wallOpening.finishedFloor) {
    warnings.push("Pavimento non finito: verificare quota finale prima dell'ordine.");
  }
  if (fixedPanel && fixedPanel.widthMm < 120) {
    warnings.push("Fisso laterale sotto 120 mm: verificare fattibilita con il produttore.");
  }

  return warnings;
}

function buildSchemeLines(result: DoorConfigurationResult): string[] {
  const fixedPanelLine = result.fixedPanel
    ? `${result.fixedPanel.widthMm} x ${result.fixedPanel.heightMm} mm lato ${translateSide(
        result.fixedPanel.side
      )}`
    : "no";

  return [
    `Ambiente: ${result.input.roomName}`,
    `Modello: ${result.modelLabel}`,
    `Foro muro netto: ${result.clearOpening.widthMm} x ${result.clearOpening.heightMm} x ${result.clearOpening.wallDepthMm} mm`,
    `Luce passaggio telaio: ${result.frame.passageWidthMm} x ${result.frame.passageHeightMm} mm`,
    `Anta produzione: ${result.leaf.quantity} x ${result.leaf.widthMm} x ${result.leaf.heightMm} mm`,
    `Opera morta / fisso: ${fixedPanelLine}`,
    `Apertura: ${translateDirection(result.openingDirection)}`,
    `Maniglia: ${translateDirection(result.handleSide)}`,
    `Display: ${result.input.accessories.hasDisplay ? "si" : "no"}`,
    `Ovale: ${result.input.accessories.hasOvalWindow ? "si" : "no"}`,
    `Finitura pavimento: ${result.input.wallOpening.finishedFloor ? "finito" : "da verificare"}`,
  ];
}

function translateSide(side: DoorHandleSide | "right" | "left"): string {
  return side === "right" ? "destro" : side === "left" ? "sinistro" : "centrale";
}

function translateLatoSide(side: DoorHandleSide | "right" | "left"): string {
  return translateSide(side);
}

function translateDirection(side: DoorHandleSide | "right" | "left"): string {
  return side === "right" ? "destra" : side === "left" ? "sinistra" : "centro";
}
