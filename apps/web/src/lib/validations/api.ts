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

export const doorConfiguratorSchema = z
  .object({
    projectName: z.string().trim().min(1, "Nome progetto obbligatorio").max(120),
    roomName: z.string().trim().min(1, "Ambiente obbligatorio").max(120),
    model: z.enum(["hinged", "sliding", "pocket", "compass"]),
    openingDirection: z.enum(["push", "pull", "slide"]),
    hingeSide: z.enum(["left", "right"]),
    wallOpening: z.object({
      widthTopMm: z.number().int().min(450).max(4000),
      widthMiddleMm: z.number().int().min(450).max(4000),
      widthBottomMm: z.number().int().min(450).max(4000),
      heightLeftMm: z.number().int().min(1900).max(3200),
      heightRightMm: z.number().int().min(1900).max(3200),
      wallThicknessMm: z.number().int().min(70).max(500),
    }),
    options: z.object({
      hasFixedPanel: z.boolean(),
      hasCompassLeaf: z.boolean(),
      hasDisplay: z.boolean(),
      hasOval: z.boolean(),
    }),
    allowances: z.object({
      installGapSideMm: z.number().int().min(0).max(50),
      installGapTopMm: z.number().int().min(0).max(80),
      undercutMm: z.number().int().min(0).max(40),
      frameFaceMm: z.number().int().min(10).max(120),
      deadWorkDepthMm: z.number().int().min(0).max(200),
    }),
  })
  .superRefine((value, ctx) => {
    if ((value.model === "pocket" || value.model === "sliding") && value.openingDirection !== "slide") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["openingDirection"],
        message: "Le porte scorrevoli devono usare direzione scorrevole",
      });
    }
    if (value.model !== "pocket" && value.openingDirection === "slide" && value.model !== "sliding") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["openingDirection"],
        message: "Direzione scorrevole ammessa solo per porte scorrevoli",
      });
    }
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
