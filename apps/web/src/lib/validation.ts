import { NextResponse } from "next/server";
import { z } from "zod";

export const dealStrategySchema = z.enum([
  "fix_flip",
  "buy_renovate_rent",
  "buy_hold_sell",
]);

export const dealStageSchema = z.enum([
  "lead",
  "analysis",
  "offer",
  "renovation",
  "rental",
  "exit",
  "archived",
]);

export const createDealSchema = z.object({
  title: z.string().trim().min(1, "Titolo richiesto").max(200),
  strategy: dealStrategySchema.optional(),
  source_url: z.string().trim().url("URL non valido").max(2000).nullish(),
  stage: dealStageSchema.optional(),
  notes: z.string().max(5000).nullish(),
});

export const intakeSchema = z.object({
  url: z.string().trim().url("URL non valido").max(2000),
});

const nullableNumber = z.number().finite().nullish();

export const propertySchema = z.object({
  status: z.enum(["draft", "confirmed"]).optional(),
  price_asked: nullableNumber,
  surface_sqm: nullableNumber,
  address: z.string().max(500).nullish(),
  zone: z.string().max(200).nullish(),
  city: z.string().max(200).nullish(),
  province: z.string().max(100).nullish(),
  property_type: z.string().max(100).nullish(),
  condition: z.string().max(100).nullish(),
  rooms: z.number().int().nonnegative().nullish(),
  floor: z.string().max(50).nullish(),
  energy_class: z.string().max(10).nullish(),
  condo_fees_monthly: nullableNumber,
  has_elevator: z.boolean().nullish(),
  has_terrace: z.boolean().nullish(),
  has_parking: z.boolean().nullish(),
  description: z.string().max(5000).nullish(),
  media_urls: z.array(z.string().url()).optional(),
  raw_fields: z.record(z.string(), z.unknown()).optional(),
});

const pct = z.number().min(0).max(1);
const positive = z.number().positive();

export const analyzeSchema = z.object({
  asking_price: positive.optional(),
  target_discount_pct: pct.optional(),
  total_capex: z.number().min(0).optional(),
  contingency_pct: pct.optional(),
  duration_months: z.number().int().min(1).optional(),
  loan_amount: z.number().min(0).optional(),
  interest_rate: pct.optional(),
  monthly_rent: z.number().min(0).optional(),
  vacancy_rate: pct.optional(),
  expected_sale_price: z.number().min(0).optional(),
  holding_months: z.number().int().min(1).optional(),
  exit_month: z.number().int().min(0).optional(),
});

export type ParsedBody<T extends z.ZodTypeAny> = z.infer<T>;

/**
 * Legge e valida il body JSON di una richiesta.
 * Restituisce i dati validati oppure una NextResponse 400 pronta da ritornare.
 */
export async function parseBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<{ data: z.infer<T>; error: null } | { data: null; error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      data: null,
      error: NextResponse.json({ error: "Body JSON non valido" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      data: null,
      error: NextResponse.json(
        {
          error: "Dati non validi",
          issues: result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      ),
    };
  }

  return { data: result.data, error: null };
}
