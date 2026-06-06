from decimal import Decimal

from app.formulas import (
    acquisition_price,
    annual_debt_service,
    build_cash_flows,
    compute_dscr,
    compute_irr,
    compute_ltv,
    compute_npv,
    corporate_tax,
    initial_capital,
    notary_and_acquisition_costs,
    renovation_total,
    run_full_analysis,
    run_scenario,
    total_project_cost,
)
from app.schemas import (
    AcquisitionAssumptions,
    AnalysisRequest,
    DealStrategy,
    FinancingAssumptions,
    RenovationBudget,
    RentalAssumptions,
    SaleAssumptions,
    TaxProfileInput,
    TimelineAssumptions,
)


def make_request(**overrides) -> AnalysisRequest:
    base = AnalysisRequest(
        strategy=DealStrategy.FIX_FLIP,
        acquisition=AcquisitionAssumptions(
            asking_price=Decimal("200000"),
            target_discount_pct=Decimal("0.05"),
        ),
        renovation=RenovationBudget(
            total_capex=Decimal("40000"),
            contingency_pct=Decimal("0.10"),
            duration_months=6,
        ),
        financing=FinancingAssumptions(
            loan_amount=Decimal("120000"),
            interest_rate_annual=Decimal("0.04"),
            property_value_for_ltv=Decimal("200000"),
        ),
        sale=SaleAssumptions(
            expected_sale_price=Decimal("280000"),
            holding_months=12,
        ),
        timeline=TimelineAssumptions(exit_month=12),
    )
    return base.model_copy(update=overrides)


def test_acquisition_price_with_discount():
    req = make_request()
    price = acquisition_price(req)
    assert price == Decimal("190000.00")


def test_total_project_cost():
    purchase = Decimal("190000")
    acq = Decimal("20000")
    capex = Decimal("44000")
    assert total_project_cost(purchase, acq, capex) == Decimal("254000.00")


def test_ltv():
    ltv = compute_ltv(Decimal("120000"), Decimal("200000"))
    assert ltv == Decimal("0.6000")


def test_dscr():
    dscr = compute_dscr(Decimal("24000"), Decimal("12000"))
    assert dscr == Decimal("2.0000")


def test_corporate_tax_srl():
    req = make_request()
    tax = corporate_tax(Decimal("100000"), req)
    expected = Decimal("100000") * (Decimal("0.24") + Decimal("0.039"))
    assert tax == expected.quantize(Decimal("0.01"))


def test_annual_debt_service_positive():
    ads = annual_debt_service(Decimal("120000"), Decimal("0.04"), 20)
    assert ads > Decimal("0")


def test_npv_negative_initial_investment():
    flows = [Decimal("-100000")] + [Decimal("10000")] * 12
    npv = compute_npv(flows, Decimal("0.08"))
    assert npv < Decimal("50000")


def test_run_scenario_fix_flip():
    result = run_scenario(make_request())
    assert result.initial_capital_required > Decimal("0")
    assert result.total_project_cost > Decimal("0")
    assert result.net_sale_margin is not None


def test_run_full_analysis_three_scenarios():
    response = run_full_analysis(make_request())
    assert response.base_case.sensitivity_signal in ("green", "amber", "red")
    assert response.prudent_case.initial_capital_required > Decimal("0")
    assert response.stress_case.initial_capital_required > Decimal("0")
    assert response.sensitivity_summary


def test_rental_scenario():
    req = make_request(
        strategy=DealStrategy.BUY_RENOVATE_RENT,
        rental=RentalAssumptions(monthly_rent=Decimal("1200")),
    )
    result = run_scenario(req)
    assert result.annual_net_rental_income is not None
    assert result.annual_net_rental_income > Decimal("0")
    assert result.monthly_cash_flow is not None


# --- Regression tests on prudent/stress symmetry ------------------------------


def test_scenario_multiplier_symmetric_for_acquisition_price():
    """Sia prudent (<1) sia stress (>1) devono ridurre lo sconto realizzabile,
    quindi alzare il prezzo di acquisto rispetto al base case."""
    req_base = make_request(scenario_multiplier=Decimal("1"))
    req_prudent = make_request(scenario_multiplier=Decimal("0.85"))
    req_stress = make_request(scenario_multiplier=Decimal("1.25"))
    assert acquisition_price(req_prudent) > acquisition_price(req_base)
    assert acquisition_price(req_stress) > acquisition_price(req_base)


def test_scenario_multiplier_increases_renovation_in_both_directions():
    """Bug storico: nello scenario prudente la contingenza veniva ridotta.
    Sia prudent sia stress devono produrre un capex >= base."""
    req_base = make_request(scenario_multiplier=Decimal("1"))
    req_prudent = make_request(scenario_multiplier=Decimal("0.85"))
    req_stress = make_request(scenario_multiplier=Decimal("1.25"))
    capex_base = renovation_total(req_base)
    capex_prudent = renovation_total(req_prudent)
    capex_stress = renovation_total(req_stress)
    assert capex_prudent > capex_base
    assert capex_stress > capex_base
    # Stress più severo del prudente.
    assert capex_stress > capex_prudent


def test_full_analysis_margin_monotonic():
    """Il margine netto deve degradare passando da base→prudent→stress."""
    response = run_full_analysis(make_request())
    base_m = response.base_case.net_sale_margin
    prudent_m = response.prudent_case.net_sale_margin
    stress_m = response.stress_case.net_sale_margin
    assert base_m is not None and prudent_m is not None and stress_m is not None
    assert base_m > prudent_m > stress_m


# --- Regression tests on cash flow shape --------------------------------------


def test_cash_flow_month_zero_equals_closing_equity():
    """Bug storico: a mese 0 venivano sottratti sia equity *totale* sia
    (prezzo+costi) senza accreditare il mutuo. Ora il flusso al mese di
    acquisizione deve essere esattamente -(equity al closing), ovvero
    il prezzo + costi notarili meno i proceeds del mutuo. Il capex esce
    ratealmente nei mesi successivi."""
    req = make_request()
    purchase = acquisition_price(req)
    acq_costs = notary_and_acquisition_costs(purchase, req)
    capex = renovation_total(req)
    closing_equity = max(purchase + acq_costs - req.financing.loan_amount, Decimal("0"))
    flows = build_cash_flows(req, purchase, acq_costs, capex, req.strategy)
    assert flows[0] == -closing_equity


def test_cash_flow_total_capex_distributed_over_renovation_months():
    """La somma delle uscite per capex sui mesi di cantiere deve coincidere
    con il capex totale (entro round)."""
    req = make_request()
    purchase = acquisition_price(req)
    acq_costs = notary_and_acquisition_costs(purchase, req)
    capex = renovation_total(req)
    flows_with_capex = build_cash_flows(req, purchase, acq_costs, capex, req.strategy)
    flows_without_capex = build_cash_flows(req, purchase, acq_costs, Decimal("0"), req.strategy)
    delta = sum(
        (a - b for a, b in zip(flows_with_capex, flows_without_capex)),
        Decimal("0"),
    )
    # Tolleranza di pochi cent per arrotondamenti sulla quota mensile.
    assert abs(delta + capex) < Decimal("1")


def test_cash_flow_negative_at_start_and_positive_at_exit_fix_flip():
    req = make_request(
        sale=SaleAssumptions(expected_sale_price=Decimal("300000"), holding_months=12),
        timeline=TimelineAssumptions(exit_month=12),
    )
    purchase = acquisition_price(req)
    acq_costs = notary_and_acquisition_costs(purchase, req)
    capex = renovation_total(req)
    flows = build_cash_flows(req, purchase, acq_costs, capex, req.strategy)
    assert flows[0] < 0
    assert flows[12] > 0


def test_irr_returns_none_when_no_positive_cash_flow():
    flows = [Decimal("-100000")] + [Decimal("-100")] * 12
    assert compute_irr(flows) is None


def test_irr_returns_none_when_no_negative_cash_flow():
    flows = [Decimal("100")] * 12
    assert compute_irr(flows) is None


def test_irr_converges_for_simple_project():
    # -10000 ora, +1100 ogni mese per 12 mesi → IRR positivo > 0
    flows = [Decimal("-10000")] + [Decimal("1100")] * 12
    irr = compute_irr(flows)
    assert irr is not None
    assert irr > Decimal("0")
