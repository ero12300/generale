export type DoorModelId = "classic-battente" | "glass-suite" | "atelier-oval";

export type DoorComposition =
  | "single"
  | "single-fixed-left"
  | "single-fixed-right";

export type GlassVariant = "none" | "slit" | "full";

export type Side = "left" | "right";

export type SwingDirection = "push" | "pull";

export interface DoorModel {
  id: DoorModelId;
  name: string;
  description: string;
  frameReductionWidthMm: number;
  frameReductionHeightMm: number;
  leafReductionHeightMm: number;
  clearPassageWidthLossMm: number;
  clearPassageHeightLossMm: number;
  minWallThicknessMm: number;
  fixedPanelWidthMm: number;
  minLeafWidthMm: number;
  supportedGlass: GlassVariant[];
  supportsOvalWindow: boolean;
  notes: string[];
}

export interface DoorConfiguratorInput {
  modelId: DoorModelId;
  openingWidthMm: number;
  openingHeightMm: number;
  wallThicknessMm: number;
  composition: DoorComposition;
  glassVariant: GlassVariant;
  hasOvalWindow: boolean;
  hingeSide: Side;
  swingDirection: SwingDirection;
}

export interface DoorOrientation {
  hingeSide: Side;
  handleSide: Side;
  swingDirection: SwingDirection;
  openingLabel: string;
}

export interface DoorProductionMetrics {
  frameWidthMm: number;
  frameHeightMm: number;
  leafWidthMm: number;
  leafHeightMm: number;
  fixedPanelWidthMm: number;
  clearPassageWidthMm: number;
  clearPassageHeightMm: number;
  widthAllowanceMm: number;
  heightAllowanceMm: number;
}

export interface DoorSummary {
  features: string[];
  notes: string[];
}

export interface DoorConfigurationResult {
  input: DoorConfiguratorInput;
  model: DoorModel;
  orientation: DoorOrientation;
  production: DoorProductionMetrics;
  summary: DoorSummary;
}

export interface DoorExportPayload {
  fileName: string;
  jsonFileName: string;
  productionSheet: string;
  json: string;
  svg: string;
}
