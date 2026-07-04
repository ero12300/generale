import { z } from "zod";

const dealStrategySchema = z.enum(["fix_flip", "buy_renovate_rent", "buy_hold_sell"]);
const dealStageSchema = z.enum([
  "lead",
  "analysis",
  "offer",
  "renovation",
  "rental",
  "exit",
  "archived",
]);
const doorModelSchema = z.enum([
  "hinged_single",
  "hinged_with_fixed_panel",
  "sliding_pocket",
  "sliding_external",
  "folding_compass",
]);
const doorOpeningDirectionSchema = z.enum(["right", "left"]);

const doorMeasureSchema = z.number().int().min(400).max(3200);

export const createDealSchema = z.object({
  title: z.string().trim().min(1, "Titolo obbligatorio").max(200),
  strategy: dealStrategySchema.default("fix_flip"),
  source_url: z.string().url().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export const intakeSchema = z.object({
  url: z.string().url("URL non valido"),
});

export const analyzeDealSchema = z.object({
  asking_price: z.number().positive().optional(),
  target_discount_pct: z.number().min(0).max(1).optional(),
  total_capex: z.number().min(0).optional(),
  contingency_pct: z.number().min(0).max(1).optional(),
  duration_months: z.number().int().min(1).max(60).optional(),
  loan_amount: z.number().min(0).optional(),
  interest_rate: z.number().min(0).max(1).optional(),
  monthly_rent: z.number().min(0).optional(),
  vacancy_rate: z.number().min(0).max(1).optional(),
  expected_sale_price: z.number().min(0).optional(),
  holding_months: z.number().int().min(1).max(120).optional(),
  exit_month: z.number().int().min(1).max(120).optional(),
});

export const offerLetterSchema = z.object({
  offered_price: z.number().positive().optional(),
  asking_price: z.number().min(0).optional(),
  key_points: z.array(z.string().max(500)).max(20).optional(),
  closing_days: z.number().int().min(7).max(180).optional(),
});

export const workListSchema = z.object({
  surface_sqm: z.number().positive().optional(),
  rooms: z.number().int().min(1).max(20).optional(),
  condition: z.string().max(100).optional(),
  include_kitchen: z.boolean().optional(),
  include_bathrooms: z.number().int().min(0).max(10).optional(),
});

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

export const updateDealSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    stage: dealStageSchema.optional(),
    strategy: dealStrategySchema.optional(),
    notes: z.string().max(5000).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Nessun campo da aggiornare",
  });

export const freedomSnapshotSchema = z.object({
  snapshot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  active_income: z.number().min(0),
  passive_income: z.number().min(0),
  fixed_expenses: z.number().min(0),
  liquidity: z.number().min(0),
  reserves: z.number().min(0),
});

export const propertyUpdateSchema = z.object({
  price_asked: z.number().min(0).nullable().optional(),
  surface_sqm: z.number().positive().nullable().optional(),
  address: z.string().max(500).nullable().optional(),
  zone: z.string().max(200).nullable().optional(),
  city: z.string().max(200).nullable().optional(),
  province: z.string().max(10).nullable().optional(),
  property_type: z.string().max(100).nullable().optional(),
  condition: z.string().max(100).nullable().optional(),
  rooms: z.number().int().min(0).max(50).nullable().optional(),
  floor: z.string().max(50).nullable().optional(),
  energy_class: z.string().max(10).nullable().optional(),
  condo_fees_monthly: z.number().min(0).nullable().optional(),
  has_elevator: z.boolean().nullable().optional(),
  has_terrace: z.boolean().nullable().optional(),
  has_parking: z.boolean().nullable().optional(),
  description: z.string().max(10000).nullable().optional(),
  media_urls: z.array(z.string().url()).optional(),
  raw_fields: z.record(z.unknown()).optional(),
  status: z.enum(["draft", "confirmed"]).optional(),
});

export function parseBody<T extends z.ZodTypeAny>(
  schema: T,
  body: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join("; ");
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
