import type { DoorConfiguratorInput, DoorSpecification } from "@deal-desk/types";

const modelLabels: Record<DoorSpecification["model"], string> = {
  hinged: "Battente",
  sliding: "Scorrevole esterno muro",
  pocket: "Scorrevole a scomparsa",
  compass: "A compasso / libro",
};

export function calculateDoorSpec(input: DoorConfiguratorInput): DoorSpecification {
  const clearOpening = {
    widthMm: Math.min(
      input.wallOpening.widthTopMm,
      input.wallOpening.widthMiddleMm,
      input.wallOpening.widthBottomMm
    ),
    heightMm: Math.min(input.wallOpening.heightLeftMm, input.wallOpening.heightRightMm),
    wallThicknessMm: input.wallOpening.wallThicknessMm,
  };
  const frameOuterWidthMm = Math.max(
    0,
    clearOpening.widthMm - input.allowances.installGapSideMm * 2
  );
  const frameOuterHeightMm = Math.max(
    0,
    clearOpening.heightMm - input.allowances.installGapTopMm
  );
  const leafWidthMm = calculateLeafWidth(input, frameOuterWidthMm, clearOpening.widthMm);
  const leafHeightMm = Math.max(0, frameOuterHeightMm - input.allowances.undercutMm);
  const handleSide = oppositeSide(input.hingeSide);
  const warnings = buildWarnings(input, clearOpening.widthMm, leafWidthMm);

  return {
    projectName: input.projectName,
    roomName: input.roomName,
    model: input.model,
    clearOpening,
    production: {
      frameOuterWidthMm,
      frameOuterHeightMm,
      leafWidthMm,
      leafHeightMm,
      deadWork: {
        widthMm: frameOuterWidthMm + input.allowances.frameFaceMm * 2,
        heightMm: frameOuterHeightMm + input.allowances.frameFaceMm,
        depthMm: input.allowances.deadWorkDepthMm,
      },
    },
    handing: {
      hingeSide: input.hingeSide,
      handleSide,
      openingDirection: input.openingDirection,
      label: buildHandingLabel(input.openingDirection, input.hingeSide, handleSide),
    },
    options: input.options,
    hardware: buildHardware(input),
    warnings,
  };
}

export function createDoorExport(spec: DoorSpecification): string {
  return [
    `SCHEMA PORTA - ${spec.projectName}`,
    `Ambiente: ${spec.roomName}`,
    `Modello: ${modelLabels[spec.model]}`,
    `Vano muro utile: ${spec.clearOpening.widthMm} x ${spec.clearOpening.heightMm} mm`,
    `Spessore muro: ${spec.clearOpening.wallThicknessMm} mm`,
    `Telaio esterno produzione: ${spec.production.frameOuterWidthMm} x ${spec.production.frameOuterHeightMm} mm`,
    `Anta produzione: ${spec.production.leafWidthMm} x ${spec.production.leafHeightMm} mm`,
    `Opera morta: ${spec.production.deadWork.widthMm} x ${spec.production.deadWork.heightMm} x ${spec.production.deadWork.depthMm} mm`,
    `Verso: ${spec.handing.label}`,
    `Lato cerniere/binario: ${sideLabel(spec.handing.hingeSide)}`,
    `Lato maniglia/presa: ${sideLabel(spec.handing.handleSide)}`,
    `Anta fissa: ${yesNo(spec.options.hasFixedPanel)}`,
    `Compasso/libro: ${yesNo(spec.options.hasCompassLeaf)}`,
    `Display/visore: ${yesNo(spec.options.hasDisplay)}`,
    `Ovale: ${yesNo(spec.options.hasOval)}`,
    `Ferramenta: ${spec.hardware.join(", ")}`,
    spec.warnings.length > 0 ? `Note: ${spec.warnings.join(" | ")}` : "Note: nessuna criticità automatica",
  ].join("\n");
}

function calculateLeafWidth(
  input: DoorConfiguratorInput,
  frameOuterWidthMm: number,
  clearWidthMm: number
): number {
  switch (input.model) {
    case "hinged":
      return Math.max(0, frameOuterWidthMm - input.allowances.frameFaceMm * 2);
    case "sliding":
      return Math.max(0, clearWidthMm + 80);
    case "pocket":
      return Math.max(0, Math.round(frameOuterWidthMm / 2) - input.allowances.installGapSideMm);
    case "compass":
      return Math.max(
        0,
        Math.floor((frameOuterWidthMm - input.allowances.frameFaceMm * 2) / 2)
      );
    default: {
      const exhaustive: never = input.model;
      return exhaustive;
    }
  }
}

function buildHandingLabel(
  direction: DoorSpecification["handing"]["openingDirection"],
  hingeSide: DoorSpecification["handing"]["hingeSide"],
  handleSide: DoorSpecification["handing"]["handleSide"]
): string {
  if (direction === "slide") {
    return `Scorre verso ${sideLabel(hingeSide)}, presa a ${sideLabel(handleSide)}`;
  }

  const verb = direction === "push" ? "spingere" : "tirare";
  return `A ${verb} ${sideLabel(hingeSide)}, maniglia a ${sideLabel(handleSide)}`;
}

function buildHardware(input: DoorConfiguratorInput): string[] {
  const hardware: string[] = [];

  switch (input.model) {
    case "hinged":
      hardware.push("Telaio", "3 cerniere", "Serratura", "Maniglia");
      break;
    case "sliding":
      hardware.push("Binario esterno", "Carrelli", "Guida pavimento", "Maniglione/presa");
      break;
    case "pocket":
      hardware.push("Kit controtelaio/scrigno", "Carrelli", "Guida pavimento", "Serratura a gancio");
      break;
    case "compass":
      hardware.push("Kit libro/compasso", "Cerniere centrali", "Binario superiore", "Maniglia");
      break;
    default: {
      const exhaustive: never = input.model;
      return exhaustive;
    }
  }

  if (input.options.hasFixedPanel) hardware.push("Ferramenta anta fissa");
  if (input.options.hasDisplay) hardware.push("Predisposizione display/visore");
  if (input.options.hasOval) hardware.push("Predisposizione ovale");

  return hardware;
}

function buildWarnings(
  input: DoorConfiguratorInput,
  clearWidthMm: number,
  leafWidthMm: number
): string[] {
  const warnings: string[] = [];

  if (input.options.hasDisplay || input.options.hasOval) {
    warnings.push("Verifica vetro di sicurezza per display/ovale.");
  }
  if (input.model === "pocket") {
    warnings.push("Serve parete libera laterale almeno pari alla larghezza anta.");
  }
  if (input.model === "sliding" && leafWidthMm < clearWidthMm + 60) {
    warnings.push("Verifica sormonto laterale per privacy e luce.");
  }
  if (input.options.hasFixedPanel && clearWidthMm < 900) {
    warnings.push("Anta fissa consigliata solo con vano largo o progetto su misura.");
  }

  return warnings;
}

function oppositeSide(side: DoorSpecification["handing"]["hingeSide"]) {
  return side === "left" ? "right" : "left";
}

function sideLabel(side: DoorSpecification["handing"]["hingeSide"]) {
  return side === "left" ? "sinistra" : "destra";
}

function yesNo(value: boolean) {
  return value ? "sì" : "no";
}
