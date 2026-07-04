export type DoorModel =
  | "single_hinged"
  | "double_with_fixed"
  | "double_active"
  | "sliding_pocket"
  | "folding_compass";

export type DoorSide = "left" | "right";
export type DoorSwing = "pull" | "push";
export type LeafRole = "active" | "fixed" | "secondary" | "sliding" | "folding";

export type DoorProductionInput = {
  openingWidthMm: number;
  openingHeightMm: number;
  wallThicknessMm: number;
  model: DoorModel;
  hingeSide: DoorSide;
  swing: DoorSwing;
  installationGapWidthMm: number;
  installationGapHeightMm: number;
  frameProfileMm: number;
  thresholdClearanceMm: number;
  activeLeafPercent?: number;
  hasVisionPanel: boolean;
  hasDigitalViewer: boolean;
  hasOvalWindow: boolean;
};

export type DoorLeafSpec = {
  id: string;
  label: string;
  role: LeafRole;
  widthMm: number;
  heightMm: number;
};

export type DoorProductionSpec = {
  modelLabel: string;
  opening: {
    widthMm: number;
    heightMm: number;
    wallThicknessMm: number;
  };
  unit: {
    widthMm: number;
    heightMm: number;
  };
  clearPassage: {
    widthMm: number;
    heightMm: number;
  };
  frame: {
    profileMm: number;
    installationGapWidthMm: number;
    installationGapHeightMm: number;
    thresholdClearanceMm: number;
  };
  leaves: DoorLeafSpec[];
  handing: {
    doorHand: DoorSide;
    handleSide: DoorSide;
    swing: DoorSwing;
    label: string;
    description: string;
  };
  accessories: string[];
  productionWarnings: string[];
};

const MODEL_LABELS: Record<DoorModel, string> = {
  single_hinged: "Battente singola",
  double_with_fixed: "Doppia con anta fissa / opera morta",
  double_active: "Doppia con seconda anta apribile",
  sliding_pocket: "Scorrevole interno muro",
  folding_compass: "A compasso / libro",
};

export function calculateDoorProductionSpec(input: DoorProductionInput): DoorProductionSpec {
  const frameProfileMm = clampMinimum(input.frameProfileMm, 0);
  const unitWidthMm = clampMinimum(input.openingWidthMm - input.installationGapWidthMm, 0);
  const unitHeightMm = clampMinimum(input.openingHeightMm - input.installationGapHeightMm, 0);
  const clearPassageWidthMm = clampMinimum(unitWidthMm - frameProfileMm * 2, 0);
  const clearPassageHeightMm = clampMinimum(unitHeightMm - frameProfileMm - input.thresholdClearanceMm, 0);
  const leaves = buildLeaves(input, clearPassageWidthMm, clearPassageHeightMm);
  const handing = buildHanding(input.hingeSide, input.swing);
  const accessories = buildAccessories(input);
  const productionWarnings = buildWarnings(input, leaves, clearPassageWidthMm, clearPassageHeightMm);

  return {
    modelLabel: MODEL_LABELS[input.model],
    opening: {
      widthMm: input.openingWidthMm,
      heightMm: input.openingHeightMm,
      wallThicknessMm: input.wallThicknessMm,
    },
    unit: {
      widthMm: unitWidthMm,
      heightMm: unitHeightMm,
    },
    clearPassage: {
      widthMm: clearPassageWidthMm,
      heightMm: clearPassageHeightMm,
    },
    frame: {
      profileMm: frameProfileMm,
      installationGapWidthMm: input.installationGapWidthMm,
      installationGapHeightMm: input.installationGapHeightMm,
      thresholdClearanceMm: input.thresholdClearanceMm,
    },
    leaves,
    handing,
    accessories,
    productionWarnings,
  };
}

export function buildDoorProductionExport(spec: DoorProductionSpec): string {
  const accessories = spec.accessories.length > 0 ? spec.accessories.join(", ") : "Nessun accessorio";
  const warnings =
    spec.productionWarnings.length > 0
      ? spec.productionWarnings.map((warning) => `- ${warning}`).join("\n")
      : "- Nessun avviso";
  const leaves = spec.leaves
    .map((leaf) => `- ${leaf.label}: ${leaf.widthMm} x ${leaf.heightMm} mm (${leaf.role})`)
    .join("\n");

  return [
    "SCHEDA PORTA PER PRODUZIONE",
    `Modello: ${spec.modelLabel}`,
    `Vano muro: ${spec.opening.widthMm} x ${spec.opening.heightMm} mm, spessore ${spec.opening.wallThicknessMm} mm`,
    `Telaio finito: ${spec.unit.widthMm} x ${spec.unit.heightMm} mm`,
    `Luce passaggio: ${spec.clearPassage.widthMm} x ${spec.clearPassage.heightMm} mm`,
    `Profilo telaio: ${spec.frame.profileMm} mm`,
    `Giochi posa: ${spec.frame.installationGapWidthMm} mm larghezza, ${spec.frame.installationGapHeightMm} mm altezza`,
    `Franco pavimento: ${spec.frame.thresholdClearanceMm} mm`,
    `Mano/apertura: ${spec.handing.label}`,
    spec.handing.description,
    `Accessori: ${accessories}`,
    "Ante:",
    leaves,
    "Avvisi:",
    warnings,
  ].join("\n");
}

function buildLeaves(
  input: DoorProductionInput,
  clearPassageWidthMm: number,
  clearPassageHeightMm: number
): DoorLeafSpec[] {
  switch (input.model) {
    case "single_hinged":
      return [
        {
          id: "anta",
          label: "Anta mobile",
          role: "active",
          widthMm: clearPassageWidthMm,
          heightMm: clearPassageHeightMm,
        },
      ];
    case "double_with_fixed": {
      const activeWidthMm = Math.round(clearPassageWidthMm * normalizedActivePercent(input.activeLeafPercent));
      return [
        {
          id: "anta-attiva",
          label: "Anta attiva",
          role: "active",
          widthMm: activeWidthMm,
          heightMm: clearPassageHeightMm,
        },
        {
          id: "parte-fissa",
          label: "Anta fissa / opera morta",
          role: "fixed",
          widthMm: clearPassageWidthMm - activeWidthMm,
          heightMm: clearPassageHeightMm,
        },
      ];
    }
    case "double_active": {
      const primaryWidthMm = Math.round(clearPassageWidthMm / 2);
      return [
        {
          id: "anta-attiva",
          label: "Anta attiva",
          role: "active",
          widthMm: primaryWidthMm,
          heightMm: clearPassageHeightMm,
        },
        {
          id: "anta-secondaria",
          label: "Seconda anta apribile",
          role: "secondary",
          widthMm: clearPassageWidthMm - primaryWidthMm,
          heightMm: clearPassageHeightMm,
        },
      ];
    }
    case "sliding_pocket":
      return [
        {
          id: "anta-scorrevole",
          label: "Anta scorrevole",
          role: "sliding",
          widthMm: clearPassageWidthMm + 40,
          heightMm: clearPassageHeightMm,
        },
      ];
    case "folding_compass": {
      const panelWidthMm = Math.round(clearPassageWidthMm / 2);
      return [
        {
          id: "pannello-1",
          label: "Pannello compasso 1",
          role: "folding",
          widthMm: panelWidthMm,
          heightMm: clearPassageHeightMm,
        },
        {
          id: "pannello-2",
          label: "Pannello compasso 2",
          role: "folding",
          widthMm: clearPassageWidthMm - panelWidthMm,
          heightMm: clearPassageHeightMm,
        },
      ];
    }
    default: {
      const exhaustiveCheck: never = input.model;
      return exhaustiveCheck;
    }
  }
}

function buildHanding(hingeSide: DoorSide, swing: DoorSwing): DoorProductionSpec["handing"] {
  const handleSide = oppositeSide(hingeSide);
  const swingLabel = swing === "pull" ? "a tirare" : "a spingere";
  const doorHandLabel = sideLabel(hingeSide);
  const handleLabel = sideLabel(handleSide);

  return {
    doorHand: hingeSide,
    handleSide,
    swing,
    label: `Porta ${doorHandLabel} ${swingLabel}`,
    description: `Vista dal lato di apertura: cerniere a ${doorHandLabel}, maniglia a ${handleLabel}.`,
  };
}

function buildAccessories(input: DoorProductionInput): string[] {
  const accessories: string[] = [];

  if (input.hasVisionPanel) accessories.push("Vetro/display visivo");
  if (input.hasDigitalViewer) accessories.push("Display digitale");
  if (input.hasOvalWindow) accessories.push("Oblo ovale");

  return accessories;
}

function buildWarnings(
  input: DoorProductionInput,
  leaves: DoorLeafSpec[],
  clearPassageWidthMm: number,
  clearPassageHeightMm: number
): string[] {
  const warnings: string[] = [];
  const activeLeaf = leaves.find((leaf) => leaf.role === "active") ?? leaves[0];
  const fixedLeaf = leaves.find((leaf) => leaf.role === "fixed");

  if (activeLeaf.widthMm < 600) {
    warnings.push("Larghezza anta sotto 600 mm: verificare fattibilita con il produttore.");
  }

  if (clearPassageHeightMm < 1900) {
    warnings.push("Altezza anta sotto 1900 mm: verificare passaggio e norme locali.");
  }

  if (fixedLeaf && fixedLeaf.widthMm < 300) {
    warnings.push("Opera morta sotto 300 mm: valutare una porta singola o ripartizione diversa.");
  }

  if (input.wallThicknessMm < 80) {
    warnings.push("Spessore muro sotto 80 mm: controllare telaio, coprifili e ferramenta.");
  }

  if (input.model === "sliding_pocket") {
    const pocketWidthMm = activeLeaf.widthMm * 2 + 100;
    warnings.push(`Per scorrevole interno muro servono circa ${pocketWidthMm} mm di parete libera.`);
  }

  if (clearPassageWidthMm <= 0 || clearPassageHeightMm <= 0) {
    warnings.push("Vano insufficiente dopo giochi e telaio: controllare le misure inserite.");
  }

  return warnings;
}

function normalizedActivePercent(activeLeafPercent = 60): number {
  return clamp(activeLeafPercent, 40, 80) / 100;
}

function oppositeSide(side: DoorSide): DoorSide {
  return side === "left" ? "right" : "left";
}

function sideLabel(side: DoorSide): string {
  return side === "left" ? "sinistra" : "destra";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function clampMinimum(value: number, min: number): number {
  return Math.max(value, min);
}
