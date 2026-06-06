import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/analytics-client";
import { demoStore } from "@/lib/demo-store";
import { analyzeSchema, parseBody } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: body, error } = await parseBody(request, analyzeSchema);
  if (error) return error;
  const deal = demoStore.getDeal(id);
  if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

  const property = demoStore.getProperty(id);
  const asking = body.asking_price ?? property?.price_asked ?? 200000;
  const capex = body.total_capex ?? 40000;
  const salePrice = body.expected_sale_price ?? asking * 1.35;

  try {
    const result = await runAnalysis({
      strategy: deal.strategy,
      acquisition: {
        asking_price: asking,
        target_discount_pct: body.target_discount_pct ?? 0.05,
      },
      renovation: {
        total_capex: capex,
        contingency_pct: body.contingency_pct ?? 0.1,
        duration_months: body.duration_months ?? 6,
      },
      financing: {
        loan_amount: body.loan_amount ?? asking * 0.6,
        interest_rate_annual: body.interest_rate ?? 0.04,
        property_value_for_ltv: asking,
      },
      rental: {
        monthly_rent: body.monthly_rent ?? 0,
        vacancy_rate: body.vacancy_rate ?? 0.08,
      },
      sale: {
        expected_sale_price: salePrice,
        holding_months: body.holding_months ?? 12,
      },
      timeline: { exit_month: body.exit_month ?? 12 },
    });
    demoStore.saveAnalysis(id, result);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 502 }
    );
  }
}
