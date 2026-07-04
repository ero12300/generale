import { z } from "zod";

/** Sistema di apertura della porta */
export const doorSystemSchema = z.enum([
  "battente",
  "bussola",
  "fissa",
  "scorrevole",
]);
export type DoorSystem = z.infer<typeof doorSystemSchema>;

/** Senso di apertura standard italiano */
export const openingDirectionSchema = z.enum([
  "dx_tirare",
  "dx_spingere",
  "sx_tirare",
  "sx_spingere",
]);
export type OpeningDirection = z.infer<typeof openingDirectionSchema>;

export const handleSideSchema = z.enum(["left", "right"]);
export type HandleSide = z.infer<typeof handleSideSchema>;

export const hingeSideSchema = z.enum(["left", "right"]);
export type HingeSide = z.infer<typeof hingeSideSchema>;

/** Lavoro morto: margini da sottrarre al foro muro */
export const deadWorkSchema = z.object({
  widthMm: z.number().min(0).max(200),
  heightMm: z.number().min(0).max(100),
  /** Margine inferiore per pavimento finito */
  floorClearanceMm: z.number().min(0).max(50).default(10),
});
export type DeadWork = z.infer<typeof deadWorkSchema>;

/** Foro muro / vano luce */
export const wallOpeningSchema = z.object({
  widthMm: z.number().min(400).max(3000),
  heightMm: z.number().min(1500).max(3500),
  wallThicknessMm: z.number().min(60).max(400),
  label: z.string().max(80).optional(),
});
export type WallOpening = z.infer<typeof wallOpeningSchema>;

/** Caratteristiche estetiche del pannello */
export const panelFeaturesSchema = z.object({
  hasDisplay: z.boolean(),
  hasOval: z.boolean(),
  hasFixedPanel: z.boolean(),
});
export type PanelFeatures = z.infer<typeof panelFeaturesSchema>;

/** Modello porta predefinito */
export interface DoorModel {
  id: string;
  name: string;
  description: string;
  system: DoorSystem;
  features: PanelFeatures;
  /** Spessore anta in mm */
  panelThicknessMm: number;
  /** Larghezza montante telaio in mm */
  frameStileWidthMm: number;
  /** Lavoro morto consigliato per questo modello */
  defaultDeadWork: DeadWork;
  /** Altezza maniglia dal pavimento finito */
  handleHeightMm: number;
}

export interface CalculatedDoor {
  /** Misure anta (pannello) */
  panelWidthMm: number;
  panelHeightMm: number;
  /** Misure esterno telaio */
  frameOuterWidthMm: number;
  frameOuterHeightMm: number;
  /** Luce passaggio netta */
  passageWidthMm: number;
  passageHeightMm: number;
  /** Misure foro muro in ingresso */
  wallOpening: WallOpening;
  deadWork: DeadWork;
  model: DoorModel;
  openingDirection: OpeningDirection | null;
  handleSide: HandleSide | null;
  hingeSide: HingeSide | null;
  /** Etichetta leggibile apertura */
  openingLabel: string;
  handleLabel: string;
}

export interface DoorProject {
  id: string;
  createdAt: string;
  updatedAt: string;
  wallOpening: WallOpening;
  deadWork: DeadWork;
  modelId: string;
  openingDirection: OpeningDirection | null;
  calculated: CalculatedDoor | null;
}

export const doorConfigSchema = z.object({
  wallOpening: wallOpeningSchema,
  deadWork: deadWorkSchema,
  modelId: z.string().min(1),
  openingDirection: openingDirectionSchema.nullable(),
});
export type DoorConfig = z.infer<typeof doorConfigSchema>;
