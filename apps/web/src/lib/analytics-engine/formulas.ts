import type {
  AnalysisRequestInput,
  AnalysisResponse,
  DealStrategy,
  ScenarioResult,
  SensitivitySignal,
  TaxRegime,
} from "./types";

interface ScenarioFactors {
  discount_factor: number;
  capex_factor: number;
  sale_price_factor: number;
}

interface NormalizedRequest {
  strategy: DealStrategy;
  acquisition: {
    asking_price: number;
    target_discount_pct: number;
    notary_and_fees_pct: number;
  };
  renovation: {
    total_capex: number;
    contingency_pct: number;
    duration_months: number;
  };
  financing: {
    loan_amount: number;
    interest_rate_annual: number;
    loan_term_years: number;
    property_value_for_ltv: number | null;
  };
  rental: {
    monthly_rent: number;
    vacancy_rate: number;
    annual_maintenance_pct: number;
    property_management_pct: number;
  };
  sale: {
    expected_sale_price: number;
    sale_costs_pct: number;
    holding_months: number;
  };
  tax_profile: {
    ires_rate: number;
    irap_rate: number;
    registration_tax_rate: number;
    vat_rate: number;
    tax_regime: TaxRegime;
  };
  timeline: {
    acquisition_month: number;
    renovation_start_month: number;
    exit_month: number;
    discount_rate_annual: number;
  };
  scenario_multiplier: number;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundRate(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function normalizeStrategy(strategy: string): DealStrategy {
  if (strategy === "buy_renovate_rent" || strategy === "buy_hold_sell") {
    return strategy;
  }
  return "fix_flip";
}

function normalizeRequest(input: AnalysisRequestInput, multiplier?: number): NormalizedRequest {
  return {
    strategy: normalizeStrategy(input.strategy),
    acquisition: {
      asking_price: input.acquisition.asking_price,
      target_discount_pct: input.acquisition.target_discount_pct ?? 0.05,
      notary_and_fees_pct: input.acquisition.notary_and_fees_pct ?? 0.03,
    },
    renovation: {
      total_capex: input.renovation.total_capex,
      contingency_pct: input.renovation.contingency_pct ?? 0.1,
      duration_months: input.renovation.duration_months ?? 6,
    },
    financing: {
      loan_amount: input.financing?.loan_amount ?? 0,
      interest_rate_annual: input.financing?.interest_rate_annual ?? 0.04,
      loan_term_years: input.financing?.loan_term_years ?? 20,
      property_value_for_ltv: input.financing?.property_value_for_ltv ?? null,
    },
    rental: {
      monthly_rent: input.rental?.monthly_rent ?? 0,
      vacancy_rate: input.rental?.vacancy_rate ?? 0.08,
      annual_maintenance_pct: input.rental?.annual_maintenance_pct ?? 0.05,
      property_management_pct: input.rental?.property_management_pct ?? 0.08,
    },
    sale: {
      expected_sale_price: input.sale?.expected_sale_price ?? 0,
      sale_costs_pct: input.sale?.sale_costs_pct ?? 0.04,
      holding_months: input.sale?.holding_months ?? 12,
    },
    tax_profile: {
      ires_rate: input.tax_profile?.ires_rate ?? 0.24,
      irap_rate: input.tax_profile?.irap_rate ?? 0.039,
      registration_tax_rate: input.tax_profile?.registration_tax_rate ?? 0.09,
      vat_rate: input.tax_profile?.vat_rate ?? 0.22,
      tax_regime: input.tax_profile?.tax_regime ?? "registry",
    },
    timeline: {
      acquisition_month: input.timeline?.acquisition_month ?? 0,
      renovation_start_month: input.timeline?.renovation_start_month ?? 1,
      exit_month: input.timeline?.exit_month ?? 12,
      discount_rate_annual: input.timeline?.discount_rate_annual ?? 0.08,
    },
    scenario_multiplier: multiplier ?? input.scenario_multiplier ?? 1,
  };
}

function scenarioFactors(multiplier: number): ScenarioFactors {
  if (multiplier > 1) {
    const stress = 2 - multiplier;
    return {
      discount_factor: stress,
      capex_factor: multiplier,
      sale_price_factor: stress,
    };
  }
  if (multiplier < 1) {
    const prudent = 2 - multiplier;
    return {
      discount_factor: multiplier,
      capex_factor: prudent,
      sale_price_factor: multiplier,
    };
  }
  return { discount_factor: 1, capex_factor: 1, sale_price_factor: 1 };
}

function adjustedSalePrice(expectedSalePrice: number, multiplier: number): number {
  const factors = scenarioFactors(multiplier);
  return roundMoney(expectedSalePrice * factors.sale_price_factor);
}

function acquisitionPrice(request: NormalizedRequest): number {
  const factors = scenarioFactors(request.scenario_multiplier);
  const discount = request.acquisition.target_discount_pct * factors.discount_factor;
  const price = request.acquisition.asking_price * (1 - discount);
  return roundMoney(Math.max(price, 0));
}

function notaryAndAcquisitionCosts(purchasePrice: number, request: NormalizedRequest): number {
  const pct = request.acquisition.notary_and_fees_pct;
  if (request.tax_profile.tax_regime === "registry") {
    const regTax = purchasePrice * request.tax_profile.registration_tax_rate;
    return roundMoney(purchasePrice * pct + regTax);
  }
  const vat = purchasePrice * request.tax_profile.vat_rate;
  return roundMoney(purchasePrice * pct + vat);
}

function renovationTotal(request: NormalizedRequest): number {
  const factors = scenarioFactors(request.scenario_multiplier);
  const base = request.renovation.total_capex * factors.capex_factor;
  const contingency = base * request.renovation.contingency_pct;
  return roundMoney(base + contingency);
}

function totalProjectCost(purchase: number, acquisitionCosts: number, capex: number): number {
  return roundMoney(purchase + acquisitionCosts + capex);
}

function initialCapital(totalCost: number, loanAmount: number): number {
  return roundMoney(Math.max(totalCost - loanAmount, 0));
}

function computeLtv(loanAmount: number, propertyValue: number): number | null {
  if (propertyValue <= 0) return null;
  return roundRate(loanAmount / propertyValue);
}

function annualDebtService(loanAmount: number, rateAnnual: number, termYears: number): number {
  if (loanAmount <= 0) return 0;
  const monthlyRate = rateAnnual / 12;
  const n = termYears * 12;
  if (monthlyRate === 0) {
    return roundMoney((loanAmount / n) * 12);
  }
  const factor = (1 + monthlyRate) ** n;
  const monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
  return roundMoney(monthlyPayment * 12);
}

function computeDscr(netOperatingIncome: number, debtService: number): number | null {
  if (debtService <= 0) return null;
  return roundRate(netOperatingIncome / debtService);
}

function corporateTax(amount: number, request: NormalizedRequest): number {
  if (amount <= 0) return 0;
  const ires = amount * request.tax_profile.ires_rate;
  const irap = amount * request.tax_profile.irap_rate;
  return roundMoney(ires + irap);
}

function annualNetRentalIncome(request: NormalizedRequest): number {
  const gross = request.rental.monthly_rent * 12;
  const vacancy = gross * request.rental.vacancy_rate;
  const maintenance = gross * request.rental.annual_maintenance_pct;
  const management = gross * request.rental.property_management_pct;
  const net = gross - vacancy - maintenance - management;
  return roundMoney(Math.max(net, 0));
}

function saleMargins(
  salePrice: number,
  totalCost: number,
  request: NormalizedRequest
): [number, number] {
  const saleCosts = salePrice * request.sale.sale_costs_pct;
  const gross = roundMoney(salePrice - totalCost - saleCosts);
  const tax = gross > 0 ? corporateTax(gross, request) : 0;
  const net = roundMoney(gross - tax);
  return [gross, net];
}

function computeNpv(cashFlows: number[], discountRateAnnual: number): number {
  const monthlyRate = discountRateAnnual / 12;
  let npv = 0;
  for (let month = 0; month < cashFlows.length; month += 1) {
    const discount = (1 + monthlyRate) ** month;
    npv += cashFlows[month] / discount;
  }
  return roundMoney(npv);
}

function computeIrr(cashFlows: number[], maxIterations = 100): number | null {
  if (!cashFlows.length || cashFlows[0] >= 0) return null;

  let low = -0.99;
  let high = 5;
  let mid = 0;
  for (let i = 0; i < maxIterations; i += 1) {
    mid = (low + high) / 2;
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t += 1) {
      npv += cashFlows[t] / (1 + mid) ** t;
    }
    if (Math.abs(npv) < 0.01) {
      return roundRate(mid * 12);
    }
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return roundRate(mid * 12);
}

function buildCashFlows(
  request: NormalizedRequest,
  purchase: number,
  acquisitionCosts: number,
  capex: number,
  strategy: DealStrategy
): number[] {
  const months = Math.max(request.timeline.exit_month, request.sale.holding_months, 12);
  const flows = new Array<number>(months + 1).fill(0);

  const equityOut = initialCapital(
    totalProjectCost(purchase, acquisitionCosts, capex),
    request.financing.loan_amount
  );
  flows[0] = -equityOut;
  flows[request.timeline.acquisition_month] -= purchase + acquisitionCosts;

  const renoStart = request.timeline.renovation_start_month;
  const renoMonths = Math.max(request.renovation.duration_months, 1);
  const capexMonthly = capex / renoMonths;
  for (let m = renoStart; m < Math.min(renoStart + renoMonths, months + 1); m += 1) {
    flows[m] -= capexMonthly;
  }

  const debtMonthly = annualDebtService(
    request.financing.loan_amount,
    request.financing.interest_rate_annual,
    request.financing.loan_term_years
  ) / 12;

  if (strategy === "buy_renovate_rent" || strategy === "buy_hold_sell") {
    const netRent = annualNetRentalIncome(request) / 12;
    for (let m = renoStart + renoMonths; m < months + 1; m += 1) {
      flows[m] += netRent - debtMonthly;
    }
  } else {
    for (let m = 1; m < months + 1; m += 1) {
      flows[m] -= debtMonthly;
    }
  }

  if (strategy === "fix_flip" || strategy === "buy_hold_sell") {
    const exitM = Math.min(request.timeline.exit_month, months);
    const salePrice = adjustedSalePrice(
      request.sale.expected_sale_price,
      request.scenario_multiplier
    );
    const saleCosts = salePrice * request.sale.sale_costs_pct;
    const loanPayoff = request.financing.loan_amount;
    flows[exitM] += salePrice - saleCosts - loanPayoff;
  }

  return flows.map(roundMoney);
}

function sensitivitySignal(
  netMargin: number | null,
  dscr: number | null,
  irr: number | null,
  scenarioMultiplier: number
): SensitivitySignal {
  let score = 0;
  if (netMargin !== null) {
    if (netMargin > 50000) score += 2;
    else if (netMargin > 15000) score += 1;
    else if (netMargin < 0) score -= 2;
  }
  if (dscr !== null) {
    if (dscr >= 1.25) score += 1;
    else if (dscr < 1) score -= 2;
  }
  if (irr !== null) {
    if (irr >= 0.15) score += 1;
    else if (irr < 0.05) score -= 1;
  }
  if (scenarioMultiplier > 1) score -= 1;
  if (score >= 2) return "green";
  if (score >= 0) return "amber";
  return "red";
}

function runScenario(input: AnalysisRequestInput, multiplier?: number): ScenarioResult {
  const request = normalizeRequest(input, multiplier);
  const purchase = acquisitionPrice(request);
  const acqCosts = notaryAndAcquisitionCosts(purchase, request);
  const capex = renovationTotal(request);
  const totalCost = totalProjectCost(purchase, acqCosts, capex);
  const equity = initialCapital(totalCost, request.financing.loan_amount);

  const propValue =
    request.financing.property_value_for_ltv ??
    (request.sale.expected_sale_price || purchase);
  const ltv = computeLtv(request.financing.loan_amount, propValue);

  let grossMargin: number | null = null;
  let netMargin: number | null = null;
  if (request.strategy === "fix_flip" || request.strategy === "buy_hold_sell") {
    const salePrice = adjustedSalePrice(
      request.sale.expected_sale_price,
      request.scenario_multiplier
    );
    [grossMargin, netMargin] = saleMargins(salePrice, totalCost, request);
  }

  let netRent: number | null = null;
  let monthlyCf: number | null = null;
  if (request.strategy === "buy_renovate_rent" || request.strategy === "buy_hold_sell") {
    netRent = annualNetRentalIncome(request);
    const debt = annualDebtService(
      request.financing.loan_amount,
      request.financing.interest_rate_annual,
      request.financing.loan_term_years
    );
    monthlyCf = roundMoney((netRent - debt) / 12);
  }

  const debtService = annualDebtService(
    request.financing.loan_amount,
    request.financing.interest_rate_annual,
    request.financing.loan_term_years
  );
  const dscr = netRent !== null ? computeDscr(netRent, debtService) : null;

  const flows = buildCashFlows(request, purchase, acqCosts, capex, request.strategy);
  const npv = computeNpv(flows, request.timeline.discount_rate_annual);
  const irr = computeIrr(flows);
  const signal = sensitivitySignal(netMargin, dscr, irr, request.scenario_multiplier);

  return {
    initial_capital_required: equity,
    total_project_cost: totalCost,
    gross_sale_margin: grossMargin,
    net_sale_margin: netMargin,
    annual_net_rental_income: netRent,
    monthly_cash_flow: monthlyCf,
    ltv,
    dscr,
    npv,
    irr,
    sensitivity_signal: signal,
    assumptions_used: {
      purchase_price: String(purchase),
      acquisition_costs: String(acqCosts),
      capex: String(capex),
      total_cost: String(totalCost),
      scenario_multiplier: String(request.scenario_multiplier),
    },
  };
}

export function runFullAnalysis(input: AnalysisRequestInput): AnalysisResponse {
  const base = runScenario(input, 1);
  const prudent = runScenario(input, 0.85);
  const stress = runScenario(input, 1.25);

  const signals = [base.sensitivity_signal, prudent.sensitivity_signal, stress.sensitivity_signal];
  let summary: string;
  if (signals.every((s) => s === "green")) {
    summary =
      "Operazione solida su tutti gli scenari. Margine regge anche in caso prudente.";
  } else if (stress.sensitivity_signal === "red") {
    summary =
      "Attenzione: lo scenario stress è in rosso. Servono maggiore sconto, capex contenuto o tempi più rapidi.";
  } else {
    summary =
      "Operazione fattibile nel caso base ma sensibile a capex e tempi. Valutare negoziazione aggiuntiva.";
  }

  return {
    base_case: base,
    prudent_case: prudent,
    stress_case: stress,
    sensitivity_summary: summary,
  };
}
