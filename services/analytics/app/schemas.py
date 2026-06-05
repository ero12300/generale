from decimal import Decimal
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class SellerType(str, Enum):
    PRIVATE = "private"
    COMPANY = "company"


class TaxRegime(str, Enum):
    REGISTRY = "registry"
    VAT = "vat"


class DealStrategy(str, Enum):
    FIX_FLIP = "fix_flip"
    BUY_RENOVATE_RENT = "buy_renovate_rent"
    BUY_HOLD_SELL = "buy_hold_sell"


class SensitivitySignal(str, Enum):
    GREEN = "green"
    AMBER = "amber"
    RED = "red"


class TaxProfileInput(BaseModel):
    ires_rate: Decimal = Field(default=Decimal("0.24"), ge=0, le=1)
    irap_rate: Decimal = Field(default=Decimal("0.039"), ge=0, le=1)
    registration_tax_rate: Decimal = Field(default=Decimal("0.09"), ge=0, le=1)
    vat_rate: Decimal = Field(default=Decimal("0.22"), ge=0, le=1)
    seller_type: SellerType = SellerType.PRIVATE
    tax_regime: TaxRegime = TaxRegime.REGISTRY
    rental_registration_rate: Decimal = Field(default=Decimal("0.02"), ge=0, le=1)


class AcquisitionAssumptions(BaseModel):
    asking_price: Decimal = Field(gt=0)
    target_discount_pct: Decimal = Field(default=Decimal("0.05"), ge=0, le=1)
    notary_and_fees_pct: Decimal = Field(default=Decimal("0.03"), ge=0, le=1)


class RenovationBudget(BaseModel):
    total_capex: Decimal = Field(ge=0)
    contingency_pct: Decimal = Field(default=Decimal("0.10"), ge=0, le=1)
    duration_months: int = Field(default=6, ge=1)


class FinancingAssumptions(BaseModel):
    loan_amount: Decimal = Field(default=Decimal("0"), ge=0)
    interest_rate_annual: Decimal = Field(default=Decimal("0.04"), ge=0)
    loan_term_years: int = Field(default=20, ge=1)
    property_value_for_ltv: Decimal | None = None


class RentalAssumptions(BaseModel):
    monthly_rent: Decimal = Field(default=Decimal("0"), ge=0)
    vacancy_rate: Decimal = Field(default=Decimal("0.08"), ge=0, le=1)
    annual_maintenance_pct: Decimal = Field(default=Decimal("0.05"), ge=0, le=1)
    property_management_pct: Decimal = Field(default=Decimal("0.08"), ge=0, le=1)


class SaleAssumptions(BaseModel):
    expected_sale_price: Decimal = Field(default=Decimal("0"), ge=0)
    sale_costs_pct: Decimal = Field(default=Decimal("0.04"), ge=0, le=1)
    holding_months: int = Field(default=12, ge=1)


class TimelineAssumptions(BaseModel):
    acquisition_month: int = 0
    renovation_start_month: int = 1
    exit_month: int = 12
    discount_rate_annual: Decimal = Field(default=Decimal("0.08"), ge=0)


class AnalysisRequest(BaseModel):
    strategy: DealStrategy = DealStrategy.FIX_FLIP
    acquisition: AcquisitionAssumptions
    renovation: RenovationBudget
    financing: FinancingAssumptions = FinancingAssumptions()
    rental: RentalAssumptions = RentalAssumptions()
    sale: SaleAssumptions = SaleAssumptions()
    tax_profile: TaxProfileInput = TaxProfileInput()
    timeline: TimelineAssumptions = TimelineAssumptions()
    scenario_multiplier: Decimal = Field(
        default=Decimal("1"),
        description="1=base, 0.85=prudent, 1.2=stress",
    )


class ScenarioResult(BaseModel):
    initial_capital_required: Decimal
    total_project_cost: Decimal
    gross_sale_margin: Decimal | None
    net_sale_margin: Decimal | None
    annual_net_rental_income: Decimal | None
    monthly_cash_flow: Decimal | None
    ltv: Decimal | None
    dscr: Decimal | None
    npv: Decimal | None
    irr: Decimal | None
    sensitivity_signal: SensitivitySignal
    assumptions_used: dict[str, Any]


class AnalysisResponse(BaseModel):
    base_case: ScenarioResult
    prudent_case: ScenarioResult
    stress_case: ScenarioResult
    sensitivity_summary: str


class OfferLetterRequest(BaseModel):
    property_address: str
    offered_price: Decimal
    asking_price: Decimal
    strategy: DealStrategy
    key_points: list[str] = []
    requested_documents: list[str] = Field(
        default_factory=lambda: [
            "Visura catastale",
            "Planimetria catastale",
            "Atto di provenienza",
            "APE",
            "Conformità urbanistica",
        ]
    )
    closing_days: int = 60
    deposit_pct: Decimal = Field(default=Decimal("0.05"), ge=0, le=1)


class OfferLetterResponse(BaseModel):
    commercial_text: str
    legal_placeholders: list[dict[str, str]]
    disclaimer: str


class WorkItemTemplate(BaseModel):
    room: str
    category: str
    description: str
    unit: str
    quantity: Decimal
    unit_price: Decimal
    requires_permit: bool = False


class WorkListRequest(BaseModel):
    surface_sqm: Decimal = Field(gt=0)
    rooms: int = Field(default=3, ge=1)
    condition: str = "da_ristrutturare"
    include_kitchen: bool = True
    include_bathrooms: int = Field(default=1, ge=0)


class WorkListResponse(BaseModel):
    items: list[WorkItemTemplate]
    total_estimated: Decimal
    notes: list[str]
