import { z } from "zod";

export const doorModelValues = [
  "battente_compasso",
  "battente_con_fisso",
  "filomuro",
  "scorrevole_scomparsa",
] as const;

export type DoorModel = (typeof doorModelValues)[number];
export type DoorSide = "destra" | "sinistra";

export interface DoorModelPreset {
  label: string;
  notes: string;
  frameReductionWidthMm: number;
  frameReductionHeightMm: number;
  leafReductionWidthMm: number;
  leafReductionHeightMm: number;
  defaultFixedPanelWidthMm?: number;
}

export const DOOR_MODEL_PRESETS: Record<DoorModel, DoorModelPreset> = {
  battente_compasso: {
    label: "Battente (a compasso)",
    notes: "Porta tradizionale con anta su cerniere.",
    frameReductionWidthMm: 10,
    frameReductionHeightMm: 10,
    leafReductionWidthMm: 100,
    leafReductionHeightMm: 50,
  },
  battente_con_fisso: {
    label: "Battente + fisso laterale",
    notes: "Anta principale con pannello fisso laterale.",
    frameReductionWidthMm: 12,
    frameReductionHeightMm: 10,
    leafReductionWidthMm: 90,
    leafReductionHeightMm: 50,
    defaultFixedPanelWidthMm: 300,
  },
  filomuro: {
    label: "Filomuro",
    notes: "Sistema senza stipiti/coprifili visibili.",
    frameReductionWidthMm: 10,
    frameReductionHeightMm: 10,
    leafReductionWidthMm: 100,
    leafReductionHeightMm: 50,
  },
  scorrevole_scomparsa: {
    label: "Scorrevole a scomparsa",
    notes: "Anta su controtelaio interno parete.",
    frameReductionWidthMm: 20,
    frameReductionHeightMm: 10,
    leafReductionWidthMm: 80,
    leafReductionHeightMm: 45,
  },
};

export const doorConfiguratorSchema = z.object({
  model: z.enum(doorModelValues),
  roughOpeningWidthMm: z.number().min(500).max(3000),
  roughOpeningHeightMm: z.number().min(1500).max(3500),
  wallThicknessMm: z.number().min(60).max(600),
  deadWorkMm: z.number().min(0).max(50),
  openingDirection: z.enum(["destra", "sinistra"]),
  handleSide: z.enum(["destra", "sinistra"]),
  hasGlass: z.boolean(),
  hasOval: z.boolean(),
  hasDisplay: z.boolean(),
  includeFixedPanel: z.boolean(),
  fixedPanelWidthMm: z.number().min(150).max(1200).optional(),
});

export type DoorConfiguratorInput = z.infer<typeof doorConfiguratorSchema>;

export interface DoorConfigurationResult {
  model: DoorModel;
  modelLabel: string;
  roughOpening: { widthMm: number; heightMm: number; wallThicknessMm: number };
  production: {
    frameWidthMm: number;
    frameHeightMm: number;
    leafWidthMm: number;
    leafHeightMm: number;
    fixedPanelWidthMm: number | null;
    activeLeafWidthMm: number;
    deadWorkMm: number;
  };
  handing: {
    openingDirection: DoorSide;
    handleSide: DoorSide;
    hingeSide: DoorSide;
    summary: string;
  };
  features: {
    hasGlass: boolean;
    hasOval: boolean;
    hasDisplay: boolean;
    includeFixedPanel: boolean;
  };
  warnings: string[];
}

export function calculateDoorConfiguration(rawInput: DoorConfiguratorInput): DoorConfigurationResult {
  const input = doorConfiguratorSchema.parse(rawInput);
  const preset = DOOR_MODEL_PRESETS[input.model];
  const warnings: string[] = [];

  const frameWidthMm =
    input.roughOpeningWidthMm - preset.frameReductionWidthMm - input.deadWorkMm * 2;
  const frameHeightMm =
    input.roughOpeningHeightMm - preset.frameReductionHeightMm - input.deadWorkMm;
  const leafWidthMm = frameWidthMm - preset.leafReductionWidthMm;
  const leafHeightMm = frameHeightMm - preset.leafReductionHeightMm;

  if (frameWidthMm <= 0 || frameHeightMm <= 0 || leafWidthMm <= 0 || leafHeightMm <= 0) {
    throw new Error("Misure non valide: il foro muro e i giochi non lasciano spazio sufficiente.");
  }

  const includeFixedPanel = input.includeFixedPanel || input.model === "battente_con_fisso";
  let fixedPanelWidthMm: number | null = null;
  let activeLeafWidthMm = leafWidthMm;

  if (includeFixedPanel) {
    const requestedFixedWidth =
      input.fixedPanelWidthMm ?? preset.defaultFixedPanelWidthMm ?? Math.round(leafWidthMm * 0.3);
    fixedPanelWidthMm = Math.min(Math.max(requestedFixedWidth, 150), Math.max(150, leafWidthMm - 400));
    activeLeafWidthMm = leafWidthMm - fixedPanelWidthMm;
    if (activeLeafWidthMm < 550) {
      warnings.push(
        "Anta attiva sotto 550 mm: valutare foro piu largo o ridurre larghezza del pannello fisso."
      );
    }
  }

  if (input.deadWorkMm > 20) {
    warnings.push("Gioco di posa elevato: verifica allineamento murario prima della produzione.");
  }

  if (input.hasOval && !input.hasGlass) {
    warnings.push("Oblo selezionato senza vetrata: verra considerato come inserto decorativo pieno.");
  }

  if (frameHeightMm < 2000) {
    warnings.push("Altezza telaio ridotta: controllare normativa/accessibilita del varco.");
  }

  const hingeSide: DoorSide = input.handleSide === "destra" ? "sinistra" : "destra";
  const summary = `Apertura ${input.openingDirection}, maniglia ${input.handleSide}, cerniere ${hingeSide}`;

  return {
    model: input.model,
    modelLabel: preset.label,
    roughOpening: {
      widthMm: input.roughOpeningWidthMm,
      heightMm: input.roughOpeningHeightMm,
      wallThicknessMm: input.wallThicknessMm,
    },
    production: {
      frameWidthMm,
      frameHeightMm,
      leafWidthMm,
      leafHeightMm,
      fixedPanelWidthMm,
      activeLeafWidthMm,
      deadWorkMm: input.deadWorkMm,
    },
    handing: {
      openingDirection: input.openingDirection,
      handleSide: input.handleSide,
      hingeSide,
      summary,
    },
    features: {
      hasGlass: input.hasGlass,
      hasOval: input.hasOval,
      hasDisplay: input.hasDisplay,
      includeFixedPanel,
    },
    warnings,
  };
}

export function buildDoorProductionExport(result: DoorConfigurationResult): string {
  const lines = [
    "SCHEMA PRODUZIONE PORTA",
    "=======================",
    "",
    `Modello: ${result.modelLabel}`,
    `Foro muro (LxH): ${result.roughOpening.widthMm} x ${result.roughOpening.heightMm} mm`,
    `Spessore muro: ${result.roughOpening.wallThicknessMm} mm`,
    `Gioco/Dead work: ${result.production.deadWorkMm} mm`,
    "",
    "MISURE PRODUZIONE",
    `- Telaio: ${result.production.frameWidthMm} x ${result.production.frameHeightMm} mm`,
    `- Anta totale: ${result.production.leafWidthMm} x ${result.production.leafHeightMm} mm`,
    `- Anta attiva: ${result.production.activeLeafWidthMm} x ${result.production.leafHeightMm} mm`,
    result.production.fixedPanelWidthMm
      ? `- Fisso laterale: ${result.production.fixedPanelWidthMm} mm`
      : "- Fisso laterale: assente",
    "",
    "CONFIGURAZIONE",
    `- Verso apertura: ${result.handing.openingDirection}`,
    `- Lato maniglia: ${result.handing.handleSide}`,
    `- Lato cerniere: ${result.handing.hingeSide}`,
    `- Vetrata: ${result.features.hasGlass ? "si" : "no"}`,
    `- Oblo/ovale: ${result.features.hasOval ? "si" : "no"}`,
    `- Display: ${result.features.hasDisplay ? "si" : "no"}`,
    "",
    "NOTE TECNICHE",
    "- Verificare piombo, livello e squadro del foro prima del montaggio.",
    "- Tolleranze da confermare con produzione in base al sistema telaio scelto.",
  ];

  if (result.warnings.length > 0) {
    lines.push("", "ATTENZIONI");
    result.warnings.forEach((warning, index) => lines.push(`${index + 1}. ${warning}`));
  }

  return lines.join("\n");
}
