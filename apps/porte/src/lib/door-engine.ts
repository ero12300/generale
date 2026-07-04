import type {
  CalculatedDoor,
  DeadWork,
  DoorModel,
  HandleSide,
  HingeSide,
  OpeningDirection,
  WallOpening,
} from "./types";
import { OPENING_DIRECTION_LABELS } from "./door-models";

/** Arrotonda al mm più vicino divisibile per 5 (standard produzione) */
export function roundToProductionMm(value: number): number {
  return Math.round(value / 5) * 5;
}

/**
 * Calcola le dimensioni anta dal foro muro sottraendo il lavoro morto.
 *
 * Standard italiano (Micheloni / Federlegno):
 * - Foro muro 900×2150 mm → anta nominale 800×2100 mm
 * - Lavoro morto tipico: 100 mm in larghezza, 50 mm in altezza
 */
export function calculatePanelDimensions(
  opening: WallOpening,
  deadWork: DeadWork,
): { panelWidthMm: number; panelHeightMm: number } {
  const rawWidth = opening.widthMm - deadWork.widthMm;
  const rawHeight =
    opening.heightMm - deadWork.heightMm - deadWork.floorClearanceMm;

  return {
    panelWidthMm: roundToProductionMm(Math.max(rawWidth, 400)),
    panelHeightMm: roundToProductionMm(Math.max(rawHeight, 1800)),
  };
}

/**
 * Calcola dimensioni esterno telaio.
 * Riferimento: anta 800 → esterno telaio 880 (+80 mm larghezza, +40 mm altezza)
 */
export function calculateFrameDimensions(
  panelWidthMm: number,
  panelHeightMm: number,
  frameStileWidthMm: number,
): { frameOuterWidthMm: number; frameOuterHeightMm: number; passageWidthMm: number; passageHeightMm: number } {
  const frameAddWidth = frameStileWidthMm;
  const frameAddHeight = 40;

  const frameOuterWidthMm = panelWidthMm + frameAddWidth;
  const frameOuterHeightMm = panelHeightMm + frameAddHeight;
  const passageWidthMm = panelWidthMm - 20;
  const passageHeightMm = panelHeightMm - 20;

  return {
    frameOuterWidthMm: roundToProductionMm(frameOuterWidthMm),
    frameOuterHeightMm: roundToProductionMm(frameOuterHeightMm),
    passageWidthMm: roundToProductionMm(Math.max(passageWidthMm, 380)),
    passageHeightMm: roundToProductionMm(Math.max(passageHeightMm, 1780)),
  };
}

/**
 * Determina lato cerniere e maniglia dal senso di apertura.
 * Regola: stando dal lato a tirare/spingere, le cerniere sono sul lato indicato.
 */
export function resolveHardwareSides(
  direction: OpeningDirection,
): { hingeSide: HingeSide; handleSide: HandleSide } {
  switch (direction) {
    case "dx_tirare":
    case "dx_spingere":
      return { hingeSide: "right", handleSide: "left" };
    case "sx_tirare":
    case "sx_spingere":
      return { hingeSide: "left", handleSide: "right" };
    default: {
      const _exhaustive: never = direction;
      return _exhaustive;
    }
  }
}

export function getHandleLabel(side: HandleSide | null): string {
  if (!side) return "N/A";
  return side === "right" ? "Maniglia a destra" : "Maniglia a sinistra";
}

export function getHingeLabel(side: HingeSide | null): string {
  if (!side) return "N/A";
  return side === "right" ? "Cerniere a destra" : "Cerniere a sinistra";
}

export function calculateDoor(
  opening: WallOpening,
  deadWork: DeadWork,
  model: DoorModel,
  openingDirection: OpeningDirection | null,
): CalculatedDoor {
  const { panelWidthMm, panelHeightMm } = calculatePanelDimensions(opening, deadWork);
  const frame = calculateFrameDimensions(
    panelWidthMm,
    panelHeightMm,
    model.frameStileWidthMm,
  );

  const needsOpening = model.system !== "fissa";
  const hardware =
    needsOpening && openingDirection
      ? resolveHardwareSides(openingDirection)
      : { hingeSide: null, handleSide: null };

  const openingLabel =
    openingDirection && needsOpening
      ? OPENING_DIRECTION_LABELS[openingDirection] ?? openingDirection
      : model.system === "fissa"
        ? "Senza apertura (anta fissa)"
        : "Da definire";

  return {
    panelWidthMm,
    panelHeightMm,
    ...frame,
    wallOpening: opening,
    deadWork,
    model,
    openingDirection: needsOpening ? openingDirection : null,
    handleSide: hardware.handleSide,
    hingeSide: hardware.hingeSide,
    openingLabel,
    handleLabel: getHandleLabel(hardware.handleSide),
  };
}

/** Verifica che il foro muro sia sufficiente per il modello scelto */
export function validateOpening(
  opening: WallOpening,
  deadWork: DeadWork,
): { valid: boolean; message?: string } {
  const { panelWidthMm, panelHeightMm } = calculatePanelDimensions(opening, deadWork);

  if (panelWidthMm < 500) {
    return {
      valid: false,
      message: `Foro troppo stretto: anta risultante ${panelWidthMm} mm (minimo 500 mm)`,
    };
  }
  if (panelHeightMm < 1900) {
    return {
      valid: false,
      message: `Foro troppo basso: anta risultante ${panelHeightMm} mm (minimo 1900 mm)`,
    };
  }
  if (opening.wallThicknessMm < 80) {
    return {
      valid: false,
      message: "Spessore muro insufficiente per telaio standard (min 80 mm)",
    };
  }
  return { valid: true };
}

/** Formatta mm in cm con una decimale */
export function formatMm(mm: number): string {
  if (mm % 10 === 0) return `${mm / 10} cm`;
  return `${(mm / 10).toFixed(1)} cm`;
}

export function formatMmRaw(mm: number): string {
  return `${mm} mm`;
}
