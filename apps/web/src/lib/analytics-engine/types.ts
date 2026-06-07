export type DealStrategy = "fix_flip" | "buy_renovate_rent" | "buy_hold_sell";
export type SensitivitySignal = "green" | "amber" | "red";
export type TaxRegime = "registry" | "vat";

export interface TaxProfileInput {
  ires_rate?: number;
  irap_rate?: number;
  registration_tax_rate?: number;
  vat_rate?: number;
  tax_regime?: TaxRegime;
}

export interface AnalysisRequestInput {
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
    annual_maintenance_pct?: number;
    property_management_pct?: number;
  };
  sale?: {
    expected_sale_price?: number;
    sale_costs_pct?: number;
    holding_months?: number;
  };
  tax_profile?: TaxProfileInput;
  timeline?: {
    acquisition_month?: number;
    renovation_start_month?: number;
    exit_month?: number;
    discount_rate_annual?: number;
  };
  scenario_multiplier?: number;
}

export interface ScenarioResult {
  initial_capital_required: number;
  total_project_cost: number;
  gross_sale_margin: number | null;
  net_sale_margin: number | null;
  annual_net_rental_income: number | null;
  monthly_cash_flow: number | null;
  ltv: number | null;
  dscr: number | null;
  npv: number | null;
  irr: number | null;
  sensitivity_signal: SensitivitySignal;
  assumptions_used: Record<string, unknown>;
}

export interface AnalysisResponse {
  base_case: ScenarioResult;
  prudent_case: ScenarioResult;
  stress_case: ScenarioResult;
  sensitivity_summary: string;
}
