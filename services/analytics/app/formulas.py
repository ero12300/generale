"""Formula engine per analisi investimenti immobiliari SRL.

Tutti gli importi usano Decimal. Nessuna consulenza fiscale: parametri configurabili.
"""

from decimal import Decimal, ROUND_HALF_UP
from typing import Any

from app.schemas import (
    AnalysisRequest,
    DealStrategy,
    ScenarioResult,
    SensitivitySignal,
    TaxRegime,
)


TWOPLACES = Decimal("0.01")
FOURPLACES = Decimal("0.0001")


def _round_money(value: Decimal) -> Decimal:
    return value.quantize(TWOPLACES, rounding=ROUND_HALF_UP)


def _round_rate(value: Decimal) -> Decimal:
    return value.quantize(FOURPLACES, rounding=ROUND_HALF_UP)


def acquisition_price(request: AnalysisRequest) -> Decimal:
    discount = request.acquisition.target_discount_pct * request.scenario_multiplier
    if request.scenario_multiplier > Decimal("1"):
        discount = request.acquisition.target_discount_pct * (
            Decimal("2") - request.scenario_multiplier
        )
    price = request.acquisition.asking_price * (Decimal("1") - discount)
    return _round_money(max(price, Decimal("0")))


def notary_and_acquisition_costs(purchase_price: Decimal, request: AnalysisRequest) -> Decimal:
    pct = request.acquisition.notary_and_fees_pct
    if request.tax_profile.tax_regime == TaxRegime.REGISTRY:
        reg_tax = purchase_price * request.tax_profile.registration_tax_rate
        return _round_money(purchase_price * pct + reg_tax)
    vat = purchase_price * request.tax_profile.vat_rate
    return _round_money(purchase_price * pct + vat)


def renovation_total(request: AnalysisRequest) -> Decimal:
  base = request.renovation.total_capex
  if request.scenario_multiplier > Decimal("1"):
      base = base * request.scenario_multiplier
  elif request.scenario_multiplier < Decimal("1"):
      base = base * (Decimal("2") - request.scenario_multiplier)
  contingency = base * request.renovation.contingency_pct * request.scenario_multiplier
  return _round_money(base + contingency)


def total_project_cost(purchase: Decimal, acquisition_costs: Decimal, capex: Decimal) -> Decimal:
    return _round_money(purchase + acquisition_costs + capex)


def initial_capital(
    total_cost: Decimal,
    loan_amount: Decimal,
) -> Decimal:
    return _round_money(max(total_cost - loan_amount, Decimal("0")))


def compute_ltv(loan_amount: Decimal, property_value: Decimal) -> Decimal | None:
    if property_value <= 0:
        return None
    return _round_rate(loan_amount / property_value)


def annual_debt_service(
    loan_amount: Decimal,
    rate_annual: Decimal,
    term_years: int,
) -> Decimal:
    if loan_amount <= 0:
        return Decimal("0")
    monthly_rate = rate_annual / Decimal("12")
    n = term_years * 12
    if monthly_rate == 0:
        return _round_money(loan_amount / Decimal(n) * Decimal("12"))
    factor = (Decimal("1") + monthly_rate) ** n
    monthly_payment = loan_amount * monthly_rate * factor / (factor - Decimal("1"))
    return _round_money(monthly_payment * Decimal("12"))


def compute_dscr(
    net_operating_income: Decimal,
    debt_service: Decimal,
) -> Decimal | None:
    if debt_service <= 0:
        return None
    return _round_rate(net_operating_income / debt_service)


def corporate_tax(amount: Decimal, request: AnalysisRequest) -> Decimal:
    if amount <= 0:
        return Decimal("0")
    ires = amount * request.tax_profile.ires_rate
    irap = amount * request.tax_profile.irap_rate
    return _round_money(ires + irap)


def annual_net_rental_income(request: AnalysisRequest) -> Decimal:
    gross = request.rental.monthly_rent * Decimal("12")
    vacancy = gross * request.rental.vacancy_rate
    maintenance = gross * request.rental.annual_maintenance_pct
    management = gross * request.rental.property_management_pct
    net = gross - vacancy - maintenance - management
    return _round_money(max(net, Decimal("0")))


def sale_margins(
    sale_price: Decimal,
    total_cost: Decimal,
    request: AnalysisRequest,
) -> tuple[Decimal, Decimal]:
    sale_costs = sale_price * request.sale.sale_costs_pct
    gross = _round_money(sale_price - total_cost - sale_costs)
    tax = corporate_tax(gross, request) if gross > 0 else Decimal("0")
    net = _round_money(gross - tax)
    return gross, net


def compute_npv(
    cash_flows: list[Decimal],
    discount_rate_annual: Decimal,
) -> Decimal:
    monthly_rate = discount_rate_annual / Decimal("12")
    npv = Decimal("0")
    for month, cf in enumerate(cash_flows):
        discount = (Decimal("1") + monthly_rate) ** month
        npv += cf / discount
    return _round_money(npv)


def compute_irr(cash_flows: list[Decimal], max_iterations: int = 100) -> Decimal | None:
    if not cash_flows or cash_flows[0] >= 0:
        return None

    low = Decimal("-0.99")
    high = Decimal("5")
    for _ in range(max_iterations):
        mid = (low + high) / Decimal("2")
        npv = Decimal("0")
        for t, cf in enumerate(cash_flows):
            npv += cf / (Decimal("1") + mid) ** t
        if abs(npv) < Decimal("0.01"):
            return _round_rate(mid * Decimal("12"))
        if npv > 0:
            low = mid
        else:
            high = mid
    return _round_rate(mid * Decimal("12"))


def build_cash_flows(
    request: AnalysisRequest,
    purchase: Decimal,
    acquisition_costs: Decimal,
    capex: Decimal,
    strategy: DealStrategy,
) -> list[Decimal]:
    months = max(request.timeline.exit_month, request.sale.holding_months, 12)
    flows: list[Decimal] = [Decimal("0")] * (months + 1)

    equity_out = initial_capital(
        total_project_cost(purchase, acquisition_costs, capex),
        request.financing.loan_amount,
    )
    flows[0] = -equity_out
    flows[request.timeline.acquisition_month] -= purchase + acquisition_costs

    reno_start = request.timeline.renovation_start_month
    reno_months = max(request.renovation.duration_months, 1)
    capex_monthly = capex / Decimal(reno_months)
    for m in range(reno_start, min(reno_start + reno_months, months + 1)):
        flows[m] -= capex_monthly

    debt_monthly = annual_debt_service(
        request.financing.loan_amount,
        request.financing.interest_rate_annual,
        request.financing.loan_term_years,
    ) / Decimal("12")

    if strategy in (DealStrategy.BUY_RENOVATE_RENT, DealStrategy.BUY_HOLD_SELL):
        net_rent = annual_net_rental_income(request) / Decimal("12")
        for m in range(reno_start + reno_months, months + 1):
            flows[m] += net_rent - debt_monthly
    else:
        for m in range(1, months + 1):
            flows[m] -= debt_monthly

    if strategy in (DealStrategy.FIX_FLIP, DealStrategy.BUY_HOLD_SELL):
        exit_m = min(request.timeline.exit_month, months)
        sale_price = request.sale.expected_sale_price
        if request.scenario_multiplier < Decimal("1"):
            sale_price = sale_price * request.scenario_multiplier
        elif request.scenario_multiplier > Decimal("1"):
            sale_price = sale_price * (Decimal("2") - request.scenario_multiplier)
        sale_costs = sale_price * request.sale.sale_costs_pct
        loan_payoff = request.financing.loan_amount
        flows[exit_m] += sale_price - sale_costs - loan_payoff

    return [_round_money(f) for f in flows]


def sensitivity_signal(
    net_margin: Decimal | None,
    dscr: Decimal | None,
    irr: Decimal | None,
    scenario_multiplier: Decimal,
) -> SensitivitySignal:
    score = 0
    if net_margin is not None:
        if net_margin > Decimal("50000"):
            score += 2
        elif net_margin > Decimal("15000"):
            score += 1
        elif net_margin < 0:
            score -= 2
    if dscr is not None:
        if dscr >= Decimal("1.25"):
            score += 1
        elif dscr < Decimal("1"):
            score -= 2
    if irr is not None:
        if irr >= Decimal("0.15"):
            score += 1
        elif irr < Decimal("0.05"):
            score -= 1
    if scenario_multiplier > Decimal("1"):
        score -= 1
    if score >= 2:
        return SensitivitySignal.GREEN
    if score >= 0:
        return SensitivitySignal.AMBER
    return SensitivitySignal.RED


def run_scenario(request: AnalysisRequest) -> ScenarioResult:
    purchase = acquisition_price(request)
    acq_costs = notary_and_acquisition_costs(purchase, request)
    capex = renovation_total(request)
    total_cost = total_project_cost(purchase, acq_costs, capex)
    equity = initial_capital(total_cost, request.financing.loan_amount)

    prop_value = request.financing.property_value_for_ltv or (
        request.sale.expected_sale_price or purchase
    )
    ltv = compute_ltv(request.financing.loan_amount, prop_value)

    gross_margin: Decimal | None = None
    net_margin: Decimal | None = None
    if request.strategy in (DealStrategy.FIX_FLIP, DealStrategy.BUY_HOLD_SELL):
        sale_price = request.sale.expected_sale_price
        if request.scenario_multiplier < Decimal("1"):
            sale_price = sale_price * request.scenario_multiplier
        gross_margin, net_margin = sale_margins(sale_price, total_cost, request)

    net_rent = None
    monthly_cf = None
    if request.strategy in (DealStrategy.BUY_RENOVATE_RENT, DealStrategy.BUY_HOLD_SELL):
        net_rent = annual_net_rental_income(request)
        debt = annual_debt_service(
            request.financing.loan_amount,
            request.financing.interest_rate_annual,
            request.financing.loan_term_years,
        )
        monthly_cf = _round_money((net_rent - debt) / Decimal("12"))

    debt_service = annual_debt_service(
        request.financing.loan_amount,
        request.financing.interest_rate_annual,
        request.financing.loan_term_years,
    )
    dscr = compute_dscr(net_rent or Decimal("0"), debt_service)

    flows = build_cash_flows(request, purchase, acq_costs, capex, request.strategy)
    npv = compute_npv(flows, request.timeline.discount_rate_annual)
    irr = compute_irr(flows)

    signal = sensitivity_signal(net_margin, dscr, irr, request.scenario_multiplier)

    assumptions: dict[str, Any] = {
        "purchase_price": str(purchase),
        "acquisition_costs": str(acq_costs),
        "capex": str(capex),
        "total_cost": str(total_cost),
        "scenario_multiplier": str(request.scenario_multiplier),
    }

    return ScenarioResult(
        initial_capital_required=equity,
        total_project_cost=total_cost,
        gross_sale_margin=gross_margin,
        net_sale_margin=net_margin,
        annual_net_rental_income=net_rent,
        monthly_cash_flow=monthly_cf,
        ltv=ltv,
        dscr=dscr,
        npv=npv,
        irr=irr,
        sensitivity_signal=signal,
        assumptions_used=assumptions,
    )


def run_full_analysis(base_request: AnalysisRequest):
    from app.schemas import AnalysisResponse

    base = run_scenario(base_request.model_copy(update={"scenario_multiplier": Decimal("1")}))
    prudent = run_scenario(
        base_request.model_copy(update={"scenario_multiplier": Decimal("0.85")})
    )
    stress = run_scenario(
        base_request.model_copy(update={"scenario_multiplier": Decimal("1.25")})
    )

    signals = [base.sensitivity_signal, prudent.sensitivity_signal, stress.sensitivity_signal]
    if all(s == SensitivitySignal.GREEN for s in signals):
        summary = "Operazione solida su tutti gli scenari. Margine regge anche in caso prudente."
    elif stress.sensitivity_signal == SensitivitySignal.RED:
        summary = (
            "Attenzione: lo scenario stress è in rosso. "
            "Servono maggiore sconto, capex contenuto o tempi più rapidi."
        )
    else:
        summary = (
            "Operazione fattibile nel caso base ma sensibile a capex e tempi. "
            "Valutare negoziazione aggiuntiva."
        )

    return AnalysisResponse(
        base_case=base,
        prudent_case=prudent,
        stress_case=stress,
        sensitivity_summary=summary,
    )
