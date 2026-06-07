import type { AnalysisResult } from "@deal-desk/types";
import {
  generateOfferLetter as generateOfferLetterEmbedded,
  generateWorkList as generateWorkListEmbedded,
  runFullAnalysis,
} from "@/lib/analytics-engine";
import type { AnalysisRequestInput } from "@/lib/analytics-engine/types";

export type { AnalysisRequestPayload } from "./analytics-client.types";

const configuredUrl =
  process.env.ANALYTICS_API_URL ?? process.env.NEXT_PUBLIC_ANALYTICS_API_URL ?? "";

function isEmbeddedAnalyticsEnabled(): boolean {
  if (!configuredUrl || configuredUrl === "embedded") return true;
  return false;
}

const ANALYTICS_URL = configuredUrl || "http://localhost:8000";

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

function mapAnalysisResult(data: ReturnType<typeof runFullAnalysis>): AnalysisResult {
  return {
    base_case: mapScenario(data.base_case as unknown as Record<string, unknown>),
    prudent_case: mapScenario(data.prudent_case as unknown as Record<string, unknown>),
    stress_case: mapScenario(data.stress_case as unknown as Record<string, unknown>),
    sensitivity_summary: data.sensitivity_summary,
  };
}

export async function runAnalysis(payload: AnalysisRequestInput): Promise<AnalysisResult> {
  if (isEmbeddedAnalyticsEnabled()) {
    return mapAnalysisResult(runFullAnalysis(payload));
  }

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
  if (isEmbeddedAnalyticsEnabled()) {
    return generateOfferLetterEmbedded(
      payload as unknown as Parameters<typeof generateOfferLetterEmbedded>[0]
    );
  }

  const res = await fetch(`${ANALYTICS_URL}/v1/offer-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateWorkList(payload: Record<string, unknown>) {
  if (isEmbeddedAnalyticsEnabled()) {
    return generateWorkListEmbedded(
      payload as unknown as Parameters<typeof generateWorkListEmbedded>[0]
    );
  }

  const res = await fetch(`${ANALYTICS_URL}/v1/work-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
