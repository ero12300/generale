import type { AnalysisResult } from "@deal-desk/types";

const ANALYTICS_URL =
  process.env.ANALYTICS_API_URL ?? process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "http://localhost:8000";

export interface AnalysisRequestPayload {
  strategy: string;
  acquisition: {
    asking_price: number;
    target_discount_pct?: number;
    notary_and_fees_pct?: number;
  };
  renovation: {
    total_capex: number;
    contingency_pct?: number;
    duration_months?: number;
  };
  financing?: {
    loan_amount?: number;
    interest_rate_annual?: number;
    loan_term_years?: number;
    property_value_for_ltv?: number;
  };
  rental?: {
    monthly_rent?: number;
    vacancy_rate?: number;
  };
  sale?: {
    expected_sale_price?: number;
    sale_costs_pct?: number;
    holding_months?: number;
  };
  tax_profile?: Record<string, number | string>;
  timeline?: {
    exit_month?: number;
    discount_rate_annual?: number;
  };
}

function mapScenario(s: Record<string, unknown>) {
  return {
    initial_capital_required: Number(s.initial_capital_required),
    total_project_cost: Number(s.total_project_cost),
    gross_sale_margin: s.gross_sale_margin != null ? Number(s.gross_sale_margin) : null,
    net_sale_margin: s.net_sale_margin != null ? Number(s.net_sale_margin) : null,
    annual_net_rental_income:
      s.annual_net_rental_income != null ? Number(s.annual_net_rental_income) : null,
    monthly_cash_flow: s.monthly_cash_flow != null ? Number(s.monthly_cash_flow) : null,
    ltv: s.ltv != null ? Number(s.ltv) : null,
    dscr: s.dscr != null ? Number(s.dscr) : null,
    npv: s.npv != null ? Number(s.npv) : null,
    irr: s.irr != null ? Number(s.irr) : null,
    sensitivity_signal: s.sensitivity_signal as "green" | "amber" | "red",
    assumptions_used: (s.assumptions_used as Record<string, unknown>) ?? {},
  };
}

export async function runAnalysis(
  payload: AnalysisRequestPayload
): Promise<AnalysisResult> {
  const res = await fetch(`${ANALYTICS_URL}/v1/analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analytics API error: ${text}`);
  }
  const data = await res.json();
  return {
    base_case: mapScenario(data.base_case),
    prudent_case: mapScenario(data.prudent_case),
    stress_case: mapScenario(data.stress_case),
    sensitivity_summary: data.sensitivity_summary,
  };
}

export async function generateOfferLetter(payload: Record<string, unknown>) {
  const res = await fetch(`${ANALYTICS_URL}/v1/offer-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateWorkList(payload: Record<string, unknown>) {
  const res = await fetch(`${ANALYTICS_URL}/v1/work-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
