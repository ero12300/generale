import type {
  DoorBatchInput,
  DoorBatchResult,
  DoorConfigurationInput,
  DoorConfigurationResult,
  DoorHandleSide,
  DoorModel,
} from "@deal-desk/types";
import { buildDoorSchemaSvg } from "@/lib/doors/schema-svg";

interface DoorModelPreset {
  label: string;
  frameAllowanceWidthMm: number;
  frameAllowanceHeightMm: number;
  leafDeltaFromPassageWidthMm: number;
  leafDeltaFromPassageHeightMm: number;
  maxLeafWidthMm: number;
  minLeafWidthMm: number;
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
    minLeafWidthMm: 400,
    needsShellHandle: false,
  },
  hinged_with_fixed_panel: {
    label: "Battente con fisso laterale",
    frameAllowanceWidthMm: 99,
    frameAllowanceHeightMm: 50,
    leafDeltaFromPassageWidthMm: 0,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 900,
    minLeafWidthMm: 400,
    needsShellHandle: false,
  },
  sliding_pocket: {
    label: "Scorrevole interno muro",
    frameAllowanceWidthMm: 60,
    frameAllowanceHeightMm: 50,
    leafDeltaFromPassageWidthMm: 25,
    leafDeltaFromPassageHeightMm: -4,
    maxLeafWidthMm: 1025,
    minLeafWidthMm: 400,
    needsShellHandle: true,
  },
  sliding_external: {
    label: "Scorrevole esterno muro",
    frameAllowanceWidthMm: 0,
    frameAllowanceHeightMm: 0,
    leafDeltaFromPassageWidthMm: 100,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 1200,
    minLeafWidthMm: 400,
    needsShellHandle: true,
  },
  folding_compass: {
    label: "Libro / compasso",
    frameAllowanceWidthMm: 70,
    frameAllowanceHeightMm: 45,
    leafDeltaFromPassageWidthMm: 0,
    leafDeltaFromPassageHeightMm: 0,
    maxLeafWidthMm: 950,
    minLeafWidthMm: 300,
    needsShellHandle: false,
  },
};

export function createDoorInput(roomName: string): DoorConfigurationInput {
  return {
    roomName,
    model: "hinged_single",
    openingDirection: "right",
    wallOpening: {
      widthTopMm: 900,
      widthMiddleMm: 900,
      widthBottomMm: 898,
      heightLeftMm: 2150,
      heightRightMm: 2150,
      wallDepthMm: 110,
      finishedFloor: true,
    },
    accessories: {
      hasDisplay: false,
      hasOvalWindow: false,
      hasFixedPanel: false,
    },
    fixedPanelSpec: {
      manualWidthMm: null,
      leafGapMm: 0,
    },
  };
}

export function calculateDoorBatch(input: DoorBatchInput): DoorBatchResult {
  const doors = input.doors.map((door) => calculateDoorConfiguration(door));
  const exportLines = [
    `Commessa: ${input.projectName}`,
    ...doors.flatMap((door, index) => [
      `--- Porta ${index + 1}: ${door.input.roomName} ---`,
      ...door.schemeLines,
      "",
    ]),
    `Totale porte: ${doors.length}`,
  ];

  return {
    projectName: input.projectName,
    doors,
    exportLines,
  };
}

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
  const leafQuantity = input.model === "folding_compass" ? 2 : 1;
  const gapMm = Math.max(0, input.fixedPanelSpec.leafGapMm);

  let leafWidthMm: number;
  let fixedPanel: DoorConfigurationResult["fixedPanel"] = null;

  if (input.model === "hinged_with_fixed_panel" && input.accessories.hasFixedPanel) {
    const layout = resolveFixedPanelLayout(
      input,
      passageWidthMm,
      clearHeightMm,
      preset,
      gapMm
    );
    leafWidthMm = layout.leafWidthMm;
    fixedPanel = layout.fixedPanel;
  } else {
    const rawLeafWidthMm = passageWidthMm + preset.leafDeltaFromPassageWidthMm;
    leafWidthMm = Math.min(
      Math.floor(rawLeafWidthMm / leafQuantity),
      preset.maxLeafWidthMm
    );
  }

  const leafHeightMm = passageHeightMm + preset.leafDeltaFromPassageHeightMm;
  const handleSide = getHandleSide(input.model, input.openingDirection);
  const hardwareNotes = buildHardwareNotes(input, handleSide, preset.needsShellHandle);
  const productionWarnings = buildProductionWarnings(
    input,
    fixedPanel,
    leafWidthMm,
    preset
  );

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
    schemaSvg: "",
  };

  const withScheme = {
    ...result,
    schemeLines: buildSchemeLines(result),
  };

  return {
    ...withScheme,
    schemaSvg: buildDoorSchemaSvg(withScheme),
  };
}

function resolveFixedPanelLayout(
  input: DoorConfigurationInput,
  passageWidthMm: number,
  clearHeightMm: number,
  preset: DoorModelPreset,
  gapMm: number
): { leafWidthMm: number; fixedPanel: NonNullable<DoorConfigurationResult["fixedPanel"]> } {
  const fixedSide: DoorHandleSide =
    input.openingDirection === "right" ? "left" : "right";
  const fixedHeightMm = clearHeightMm - preset.frameAllowanceHeightMm;
  const manualFixed = input.fixedPanelSpec.manualWidthMm;

  let fixedWidthMm: number;
  let leafWidthMm: number;

  if (manualFixed != null) {
    fixedWidthMm = manualFixed;
    leafWidthMm = passageWidthMm - fixedWidthMm - gapMm;
  } else {
    leafWidthMm = Math.min(preset.maxLeafWidthMm, passageWidthMm - gapMm);
    fixedWidthMm = passageWidthMm - leafWidthMm - gapMm;
  }

  return {
    leafWidthMm: Math.max(0, Math.floor(leafWidthMm)),
    fixedPanel: {
      widthMm: Math.max(0, Math.floor(fixedWidthMm)),
      heightMm: fixedHeightMm,
      side: fixedSide,
      leafGapMm: gapMm,
    },
  };
}

function getHandleSide(model: DoorModel, openingDirection: "right" | "left"): DoorHandleSide {
  if (model === "sliding_external" || model === "sliding_pocket") {
    return openingDirection;
  }
  return openingDirection === "right" ? "left" : "right";
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
  fixedPanel: DoorConfigurationResult["fixedPanel"],
  leafWidthMm: number,
  preset: DoorModelPreset
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
  if (leafWidthMm < preset.minLeafWidthMm) {
    warnings.push(
      `Anta ${leafWidthMm} mm sotto il minimo consigliato (${preset.minLeafWidthMm} mm): verificare opera morta e aria.`
    );
  }
  if (leafWidthMm > preset.maxLeafWidthMm) {
    warnings.push(`Anta ${leafWidthMm} mm oltre il massimo standard (${preset.maxLeafWidthMm} mm).`);
  }

  return warnings;
}

function buildSchemeLines(result: DoorConfigurationResult): string[] {
  const fixedPanelLine = result.fixedPanel
    ? `${result.fixedPanel.widthMm} x ${result.fixedPanel.heightMm} mm lato ${translateSide(
        result.fixedPanel.side
      )}`
    : "no";

  const lines = [
    `Ambiente: ${result.input.roomName}`,
    `Modello: ${result.modelLabel}`,
    `Foro muro netto: ${result.clearOpening.widthMm} x ${result.clearOpening.heightMm} x ${result.clearOpening.wallDepthMm} mm`,
    `Luce passaggio telaio: ${result.frame.passageWidthMm} x ${result.frame.passageHeightMm} mm`,
    `Anta produzione: ${result.leaf.quantity} x ${result.leaf.widthMm} x ${result.leaf.heightMm} mm`,
    `Opera morta / fisso: ${fixedPanelLine}`,
  ];

  if (result.fixedPanel) {
    lines.push(`Aria anta/opera morta: ${result.fixedPanel.leafGapMm} mm`);
    if (result.input.fixedPanelSpec.manualWidthMm != null) {
      lines.push(`Opera morta manuale: ${result.input.fixedPanelSpec.manualWidthMm} mm`);
    }
  }

  lines.push(
    `Apertura: ${translateDirection(result.openingDirection)}`,
    `Maniglia: ${translateDirection(result.handleSide)}`,
    `Display: ${result.input.accessories.hasDisplay ? "si" : "no"}`,
    `Ovale: ${result.input.accessories.hasOvalWindow ? "si" : "no"}`,
    `Finitura pavimento: ${result.input.wallOpening.finishedFloor ? "finito" : "da verificare"}`
  );

  return lines;
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
