import { z } from "zod";

const doorModelSchema = z.enum([
  "hinged_single",
  "hinged_with_fixed_panel",
  "sliding_pocket",
  "sliding_external",
  "folding_compass",
]);
const doorOpeningDirectionSchema = z.enum(["right", "left"]);
const doorMeasureSchema = z.number().int().min(400).max(3200);

export const doorConfigurationSchema = z
  .object({
    roomName: z.string().trim().min(1, "Nome ambiente obbligatorio").max(120),
    model: doorModelSchema,
    openingDirection: doorOpeningDirectionSchema,
    wallOpening: z.object({
      widthTopMm: doorMeasureSchema,
      widthMiddleMm: doorMeasureSchema,
      widthBottomMm: doorMeasureSchema,
      heightLeftMm: doorMeasureSchema,
      heightRightMm: doorMeasureSchema,
      wallDepthMm: z.number().int().min(70).max(500),
      finishedFloor: z.boolean(),
    }),
    accessories: z.object({
      hasDisplay: z.boolean(),
      hasOvalWindow: z.boolean(),
      hasFixedPanel: z.boolean(),
    }),
  })
  .refine(
    (data) => data.model !== "hinged_with_fixed_panel" || data.accessories.hasFixedPanel,
    {
      message: "Il modello con opera morta richiede il fisso laterale",
      path: ["accessories", "hasFixedPanel"],
    }
  )
  .refine(
    (data) => data.model === "hinged_with_fixed_panel" || !data.accessories.hasFixedPanel,
    {
      message: "Il fisso laterale e disponibile solo sul modello Battente con fisso",
      path: ["accessories", "hasFixedPanel"],
    }
  );

export const doorBatchSchema = z.object({
  projectName: z.string().trim().min(1, "Nome commessa obbligatorio").max(120),
  doors: z.array(doorConfigurationSchema).min(1, "Aggiungi almeno una porta").max(50),
});
