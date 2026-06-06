"""Test per il motore fiscale: seller_type e imposta di registro locazione.

Verifica che i parametri fiscali configurabili (ADR-002) influenzino
realmente i calcoli, senza logica fiscale hardcoded nel frontend.
"""

from decimal import Decimal

from app.formulas import (
    acquisition_transfer_tax,
    annual_net_rental_income,
    applies_vat_on_purchase,
    notary_and_acquisition_costs,
)
from app.schemas import (
    AcquisitionAssumptions,
    AnalysisRequest,
    DealStrategy,
    RentalAssumptions,
    RenovationBudget,
    SellerType,
    TaxProfileInput,
    TaxRegime,
)


def make_request(tax_profile: TaxProfileInput, **overrides) -> AnalysisRequest:
    base = AnalysisRequest(
        strategy=DealStrategy.BUY_RENOVATE_RENT,
        acquisition=AcquisitionAssumptions(
            asking_price=Decimal("200000"),
            target_discount_pct=Decimal("0"),
            notary_and_fees_pct=Decimal("0.03"),
        ),
        renovation=RenovationBudget(total_capex=Decimal("0"), contingency_pct=Decimal("0")),
        rental=RentalAssumptions(
            monthly_rent=Decimal("1000"),
            vacancy_rate=Decimal("0"),
            annual_maintenance_pct=Decimal("0"),
            property_management_pct=Decimal("0"),
        ),
        tax_profile=tax_profile,
    )
    return base.model_copy(update=overrides)


def test_private_seller_never_applies_vat():
    # Anche chiedendo il regime IVA, l'acquisto da privato resta in imposta di registro.
    profile = TaxProfileInput(seller_type=SellerType.PRIVATE, tax_regime=TaxRegime.VAT)
    req = make_request(profile)
    assert applies_vat_on_purchase(req) is False
    # 200.000 * 9% imposta di registro (non 22% IVA)
    assert acquisition_transfer_tax(Decimal("200000"), req) == Decimal("18000.00")


def test_company_seller_with_vat_regime_applies_vat():
    profile = TaxProfileInput(seller_type=SellerType.COMPANY, tax_regime=TaxRegime.VAT)
    req = make_request(profile)
    assert applies_vat_on_purchase(req) is True
    # 200.000 * 22% IVA
    assert acquisition_transfer_tax(Decimal("200000"), req) == Decimal("44000.00")


def test_company_seller_registry_regime_uses_registration_tax():
    profile = TaxProfileInput(seller_type=SellerType.COMPANY, tax_regime=TaxRegime.REGISTRY)
    req = make_request(profile)
    assert applies_vat_on_purchase(req) is False
    assert acquisition_transfer_tax(Decimal("200000"), req) == Decimal("18000.00")


def test_acquisition_costs_include_notary_plus_transfer_tax():
    profile = TaxProfileInput(seller_type=SellerType.PRIVATE, tax_regime=TaxRegime.REGISTRY)
    req = make_request(profile)
    # notaio 3% (6.000) + registro 9% (18.000) = 24.000
    assert notary_and_acquisition_costs(Decimal("200000"), req) == Decimal("24000.00")


def test_rental_registration_tax_reduces_net_income():
    gross = Decimal("12000")  # 1000/mese * 12
    with_tax = TaxProfileInput(rental_registration_rate=Decimal("0.02"))
    no_tax = TaxProfileInput(rental_registration_rate=Decimal("0"))

    net_with = annual_net_rental_income(make_request(with_tax))
    net_without = annual_net_rental_income(make_request(no_tax))

    # La differenza è esattamente l'imposta di registro 2% sul canone lordo.
    assert net_without - net_with == (gross * Decimal("0.02")).quantize(Decimal("0.01"))
    assert net_with == Decimal("11760.00")
