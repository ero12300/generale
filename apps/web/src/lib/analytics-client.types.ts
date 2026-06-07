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
