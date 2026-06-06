from decimal import Decimal

from app.formulas import (
    acquisition_price,
    annual_debt_service,
    compute_dscr,
    compute_ltv,
    compute_npv,
    corporate_tax,
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


def test_stress_scenario_degrades_sale_margin():
    response = run_full_analysis(make_request())

    assert response.base_case.net_sale_margin is not None
    assert response.stress_case.net_sale_margin == Decimal("-70250.00")
    assert response.stress_case.net_sale_margin < response.base_case.net_sale_margin


def test_rental_scenario():
    req = make_request(
        strategy=DealStrategy.BUY_RENOVATE_RENT,
        rental=RentalAssumptions(monthly_rent=Decimal("1200")),
    )
    result = run_scenario(req)
    assert result.annual_net_rental_income is not None
    assert result.annual_net_rental_income > Decimal("0")
    assert result.monthly_cash_flow is not None
