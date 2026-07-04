import { z } from "zod";
import { getDoorModelById } from "@/lib/catalog";
import type {
  DoorComposition,
  DoorConfigurationResult,
  DoorConfiguratorInput,
  DoorExportPayload,
  DoorModel,
  DoorProductionMetrics,
  GlassVariant,
  Side,
  SwingDirection,
} from "@/lib/types";

const inputSchema = z.object({
  modelId: z.enum(["classic-battente", "glass-suite", "atelier-oval"]),
  openingWidthMm: z.number().int().min(700),
  openingHeightMm: z.number().int().min(1900),
  wallThicknessMm: z.number().int().min(70),
  composition: z.enum(["single", "single-fixed-left", "single-fixed-right"]),
  glassVariant: z.enum(["none", "slit", "full"]),
  hasOvalWindow: z.boolean(),
  hingeSide: z.enum(["left", "right"]),
  swingDirection: z.enum(["push", "pull"]),
});

export function calculateDoorConfiguration(
  rawInput: DoorConfiguratorInput
): DoorConfigurationResult {
  const input = inputSchema.parse(rawInput);
  const model = getDoorModelById(input.modelId);

  validateDoorConfiguration(input, model);

  const frameWidthMm = input.openingWidthMm - model.frameReductionWidthMm;
  const frameHeightMm = input.openingHeightMm - model.frameReductionHeightMm;
  const fixedPanelWidthMm =
    input.composition === "single" ? 0 : model.fixedPanelWidthMm;
  const leafWidthMm = frameWidthMm - fixedPanelWidthMm;
  const leafHeightMm = frameHeightMm - model.leafReductionHeightMm;
  const clearPassageWidthMm = leafWidthMm - model.clearPassageWidthLossMm;
  const clearPassageHeightMm = leafHeightMm - model.clearPassageHeightLossMm;
  const handleSide = getOppositeSide(input.hingeSide);

  const production: DoorProductionMetrics = {
    frameWidthMm,
    frameHeightMm,
    leafWidthMm,
    leafHeightMm,
    fixedPanelWidthMm,
    clearPassageWidthMm,
    clearPassageHeightMm,
    widthAllowanceMm: input.openingWidthMm - frameWidthMm,
    heightAllowanceMm: input.openingHeightMm - frameHeightMm,
  };

  const features = [
    getCompositionLabel(input.composition),
    getGlassLabel(input.glassVariant),
  ];

  if (input.hasOvalWindow) {
    features.push("Oblo ovale");
  }

  return {
    input,
    model,
    orientation: {
      hingeSide: input.hingeSide,
      handleSide,
      swingDirection: input.swingDirection,
      openingLabel: getOpeningLabel(input.hingeSide, input.swingDirection),
    },
    production,
    summary: {
      features,
      notes: [
        "Misurare il vano in almeno tre punti e usare la misura minima.",
        "Verificare piombo, livello e squadro prima della produzione.",
        ...model.notes,
      ],
    },
  };
}

export function buildDoorExportPayload(
  configuration: DoorConfigurationResult
): DoorExportPayload {
  const baseName = `porta-${configuration.model.id}-${configuration.input.openingWidthMm}x${configuration.input.openingHeightMm}`;
  const productionSheet = [
    "SCHEDA PRODUZIONE PORTA",
    `Modello: ${configuration.model.name}`,
    `Descrizione: ${configuration.model.description}`,
    `Vano muro: ${configuration.input.openingWidthMm} x ${configuration.input.openingHeightMm} mm`,
    `Spessore muro: ${configuration.input.wallThicknessMm} mm`,
    `Apertura: ${configuration.orientation.openingLabel}`,
    `Maniglia: ${getSideLabel(configuration.orientation.handleSide)}`,
    `Composizione: ${getCompositionLabel(configuration.input.composition)}`,
    `Vetro: ${getGlassLabel(configuration.input.glassVariant)}`,
    `Oblo ovale: ${configuration.input.hasOvalWindow ? "si" : "no"}`,
    `Telaio produzione: ${configuration.production.frameWidthMm} x ${configuration.production.frameHeightMm} mm`,
    `Anta utile: ${configuration.production.leafWidthMm} x ${configuration.production.leafHeightMm} mm`,
    `Pannello fisso: ${configuration.production.fixedPanelWidthMm} mm`,
    `Luce passaggio: ${configuration.production.clearPassageWidthMm} x ${configuration.production.clearPassageHeightMm} mm`,
    `Riduzione larghezza: ${configuration.production.widthAllowanceMm} mm`,
    `Riduzione altezza: ${configuration.production.heightAllowanceMm} mm`,
    "",
    "Note di officina:",
    ...configuration.summary.notes.map((note) => `- ${note}`),
  ].join("\n");

  return {
    fileName: `${baseName}.svg`,
    jsonFileName: `${baseName}.json`,
    productionSheet,
    json: JSON.stringify(
      {
        model: configuration.model.name,
        opening: configuration.input,
        orientation: configuration.orientation,
        production: configuration.production,
        features: configuration.summary.features,
        notes: configuration.summary.notes,
      },
      null,
      2
    ),
    svg: createDoorSchemaSvg(configuration),
  };
}

export function createDoorSchemaSvg(
  configuration: DoorConfigurationResult
): string {
  const canvasWidth = 680;
  const canvasHeight = 420;
  const scale = Math.min(
    520 / configuration.input.openingWidthMm,
    220 / configuration.input.openingHeightMm
  );
  const frameWidth = Math.round(configuration.production.frameWidthMm * scale);
  const frameHeight = Math.round(configuration.production.frameHeightMm * scale);
  const leafWidth = Math.round(configuration.production.leafWidthMm * scale);
  const fixedPanelWidth = Math.round(
    configuration.production.fixedPanelWidthMm * scale
  );
  const x = 80;
  const y = 120;
  const leafX =
    configuration.input.composition === "single-fixed-left"
      ? x + fixedPanelWidth
      : x;
  const fixedPanelX =
    configuration.input.composition === "single-fixed-right"
      ? x + leafWidth
      : x;
  const arcSweep = getArcSweepFlag(
    configuration.orientation.hingeSide,
    configuration.orientation.swingDirection
  );
  const hingeX =
    configuration.orientation.hingeSide === "left" ? leafX : leafX + leafWidth;
  const swingTargetX =
    configuration.orientation.hingeSide === "left"
      ? leafX + leafWidth
      : leafX;
  const compositionLabel = getCompositionLabel(configuration.input.composition);

  const fixedPanelMarkup =
    configuration.production.fixedPanelWidthMm > 0
      ? `<rect x="${fixedPanelX}" y="${y}" width="${fixedPanelWidth}" height="${frameHeight}" fill="#fbbf24" fill-opacity="0.18" stroke="#fbbf24" stroke-width="2" />
         <text x="${fixedPanelX + fixedPanelWidth / 2}" y="${y + frameHeight / 2}" fill="#f8fafc" font-size="14" text-anchor="middle">Fisso</text>`
      : "";

  const glassMarkup =
    configuration.input.glassVariant === "none"
      ? ""
      : configuration.input.glassVariant === "full"
        ? `<rect x="${leafX + 18}" y="${y + 18}" width="${leafWidth - 36}" height="${frameHeight - 36}" fill="#7dd3fc" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2" />`
        : `<rect x="${leafX + leafWidth / 2 - 24}" y="${y + 24}" width="48" height="${frameHeight - 48}" fill="#7dd3fc" fill-opacity="0.2" stroke="#38bdf8" stroke-width="2" />`;

  const ovalMarkup =
    configuration.input.hasOvalWindow
      ? `<ellipse cx="${leafX + leafWidth / 2}" cy="${y + frameHeight / 2}" rx="48" ry="30" fill="#bfdbfe" fill-opacity="0.3" stroke="#93c5fd" stroke-width="2" />`
      : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" role="img" aria-label="Schema porta ${configuration.model.name}">
  <rect width="${canvasWidth}" height="${canvasHeight}" fill="#020617" rx="24" />
  <text x="40" y="48" fill="#f8fafc" font-family="Arial, sans-serif" font-size="24" font-weight="700">${escapeXml(
    configuration.model.name
  )}</text>
  <text x="40" y="74" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="14">${escapeXml(
    compositionLabel
  )} · ${escapeXml(configuration.orientation.openingLabel)}</text>
  <rect x="${x}" y="${y}" width="${frameWidth}" height="${frameHeight}" fill="none" stroke="#94a3b8" stroke-width="8" rx="10" />
  ${fixedPanelMarkup}
  <rect x="${leafX}" y="${y}" width="${leafWidth}" height="${frameHeight}" fill="#1e293b" stroke="#f8fafc" stroke-width="3" rx="6" />
  ${glassMarkup}
  ${ovalMarkup}
  <circle cx="${hingeX}" cy="${y + 22}" r="5" fill="#f8fafc" />
  <circle cx="${hingeX}" cy="${y + frameHeight / 2}" r="5" fill="#f8fafc" />
  <circle cx="${hingeX}" cy="${y + frameHeight - 22}" r="5" fill="#f8fafc" />
  <path d="M ${hingeX} ${y + frameHeight - 8} A ${leafWidth} ${leafWidth} ${arcSweep} ${swingTargetX} ${y}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="10 8" />
  <text x="40" y="326" fill="#f8fafc" font-family="Arial, sans-serif" font-size="15">Vano muro: ${configuration.input.openingWidthMm} x ${configuration.input.openingHeightMm} mm</text>
  <text x="40" y="350" fill="#f8fafc" font-family="Arial, sans-serif" font-size="15">Telaio: ${configuration.production.frameWidthMm} x ${configuration.production.frameHeightMm} mm</text>
  <text x="40" y="374" fill="#f8fafc" font-family="Arial, sans-serif" font-size="15">Anta: ${configuration.production.leafWidthMm} x ${configuration.production.leafHeightMm} mm</text>
  <text x="40" y="398" fill="#f8fafc" font-family="Arial, sans-serif" font-size="15">Maniglia ${getSideLabel(
    configuration.orientation.handleSide
  )} · ${escapeXml(getGlassLabel(configuration.input.glassVariant))}${configuration.input.hasOvalWindow ? " · Oblo ovale" : ""}</text>
</svg>`;
}

function validateDoorConfiguration(
  input: DoorConfiguratorInput,
  model: DoorModel
): void {
  if (input.wallThicknessMm < model.minWallThicknessMm) {
    throw new Error("Spessore muro insufficiente");
  }

  if (!model.supportedGlass.includes(input.glassVariant)) {
    throw new Error("Vetro non disponibile per il modello selezionato");
  }

  if (input.hasOvalWindow && !model.supportsOvalWindow) {
    throw new Error("Oblo ovale non disponibile per il modello selezionato");
  }

  const frameWidthMm = input.openingWidthMm - model.frameReductionWidthMm;
  const frameHeightMm = input.openingHeightMm - model.frameReductionHeightMm;
  const fixedPanelWidthMm =
    input.composition === "single" ? 0 : model.fixedPanelWidthMm;
  const leafWidthMm = frameWidthMm - fixedPanelWidthMm;

  if (frameWidthMm <= 0 || frameHeightMm <= 0) {
    throw new Error("Vano muro insufficiente");
  }

  if (leafWidthMm < model.minLeafWidthMm) {
    throw new Error("Vano troppo stretto per il modello selezionato");
  }
}

function getOppositeSide(side: Side): Side {
  return side === "left" ? "right" : "left";
}

function getOpeningLabel(side: Side, swingDirection: SwingDirection): string {
  return `${capitalize(getSideLabel(side))} a ${getSwingLabel(swingDirection)}`;
}

function getArcSweepFlag(side: Side, swingDirection: SwingDirection): string {
  const opensAway =
    (side === "left" && swingDirection === "push") ||
    (side === "right" && swingDirection === "pull");

  return opensAway ? "0 0 1" : "0 0 0";
}

function getSwingLabel(swingDirection: SwingDirection): string {
  return swingDirection === "push" ? "spingere" : "tirare";
}

function getCompositionLabel(composition: DoorComposition): string {
  switch (composition) {
    case "single":
      return "Anta singola";
    case "single-fixed-left":
      return "Fisso sinistro";
    case "single-fixed-right":
      return "Fisso destro";
    default:
      return assertNever(composition);
  }
}

function getGlassLabel(glassVariant: GlassVariant): string {
  switch (glassVariant) {
    case "none":
      return "Senza vetro";
    case "slit":
      return "Feritoia verticale";
    case "full":
      return "Vetrata intera";
    default:
      return assertNever(glassVariant);
  }
}

function getSideLabel(side: Side): string {
  switch (side) {
    case "left":
      return "sinistra";
    case "right":
      return "destra";
    default:
      return assertNever(side);
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function assertNever(value: never): never {
  throw new Error(`Valore non gestito: ${String(value)}`);
}
