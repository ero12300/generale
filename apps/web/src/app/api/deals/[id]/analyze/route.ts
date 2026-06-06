import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/analytics-client";
import { demoStore } from "@/lib/demo-store";
import { notFoundError, upstreamError, validationError } from "@/lib/api-response";
import { analyzeDealSchema, parseBody } from "@/lib/validations/api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(analyzeDealSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const deal = demoStore.getDeal(id);
  if (!deal) return notFoundError("Deal non trovato");

  const property = demoStore.getProperty(id);
  const asking = parsed.data.asking_price ?? property?.price_asked ?? 200000;
  const capex = parsed.data.total_capex ?? 40000;
  const salePrice = parsed.data.expected_sale_price ?? asking * 1.35;

  try {
    const result = await runAnalysis({
      strategy: deal.strategy,
      acquisition: {
        asking_price: asking,
        target_discount_pct: parsed.data.target_discount_pct ?? 0.05,
      },
      renovation: {
        total_capex: capex,
        contingency_pct: parsed.data.contingency_pct ?? 0.1,
        duration_months: parsed.data.duration_months ?? 6,
      },
      financing: {
        loan_amount: parsed.data.loan_amount ?? asking * 0.6,
        interest_rate_annual: parsed.data.interest_rate ?? 0.04,
        property_value_for_ltv: asking,
      },
      rental: {
        monthly_rent: parsed.data.monthly_rent ?? 0,
        vacancy_rate: parsed.data.vacancy_rate ?? 0.08,
      },
      sale: {
        expected_sale_price: salePrice,
        holding_months: parsed.data.holding_months ?? 12,
      },
      timeline: { exit_month: parsed.data.exit_month ?? 12 },
    });
    demoStore.saveAnalysis(id, result);
    return NextResponse.json(result);
  } catch (err) {
    return upstreamError(err instanceof Error ? err.message : "Analisi non riuscita");
  }
}
