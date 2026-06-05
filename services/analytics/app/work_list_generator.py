from decimal import Decimal

from app.schemas import WorkItemTemplate, WorkListRequest, WorkListResponse

# Prezzi indicativi €/mq o €/cad — da calibrare per zona e fornitori
BASE_RATES: dict[str, Decimal] = {
    "demolition": Decimal("25"),
    "masonry": Decimal("80"),
    "electrical": Decimal("45"),
    "plumbing": Decimal("50"),
    "hvac": Decimal("35"),
    "windows": Decimal("350"),
    "drywall": Decimal("30"),
    "flooring": Decimal("40"),
    "tiling": Decimal("45"),
    "painting": Decimal("12"),
    "bathroom": Decimal("4500"),
    "kitchen": Decimal("6000"),
    "doors": Decimal("250"),
    "lighting": Decimal("800"),
    "furnishing": Decimal("0"),
    "disposal": Decimal("500"),
    "inspection": Decimal("300"),
}


def generate_work_list(req: WorkListRequest) -> WorkListResponse:
    sqm = req.surface_sqm
    items: list[WorkItemTemplate] = []
    notes: list[str] = []

    if req.condition in ("da_ristrutturare", "pessimo", "ruin"):
        items.append(WorkItemTemplate(
            room="Generale",
            category="demolition",
            description="Demolizioni selettive e rimozione finiture esistenti",
            unit="mq",
            quantity=sqm * Decimal("0.3"),
            unit_price=BASE_RATES["demolition"],
            requires_permit=False,
        ))

    items.extend([
        WorkItemTemplate(
            room="Generale",
            category="masonry",
            description="Opere murarie e rasature",
            unit="mq",
            quantity=sqm,
            unit_price=BASE_RATES["masonry"],
        ),
        WorkItemTemplate(
            room="Generale",
            category="electrical",
            description="Rifacimento impianto eletrico a norma",
            unit="mq",
            quantity=sqm,
            unit_price=BASE_RATES["electrical"],
            requires_permit=True,
        ),
        WorkItemTemplate(
            room="Generale",
            category="plumbing",
            description="Rifacimento impianto idrico-sanitario",
            unit="mq",
            quantity=sqm,
            unit_price=BASE_RATES["plumbing"],
            requires_permit=True,
        ),
        WorkItemTemplate(
            room="Generale",
            category="hvac",
            description="Climatizzazione (split o centralizzato)",
            unit="mq",
            quantity=sqm,
            unit_price=BASE_RATES["hvac"],
        ),
        WorkItemTemplate(
            room="Generale",
            category="windows",
            description="Sostituzione infissi",
            unit="cad",
            quantity=Decimal(max(req.rooms + 1, 4)),
            unit_price=BASE_RATES["windows"],
        ),
        WorkItemTemplate(
            room="Generale",
            category="flooring",
            description="Pavimentazione",
            unit="mq",
            quantity=sqm,
            unit_price=BASE_RATES["flooring"],
        ),
        WorkItemTemplate(
            room="Generale",
            category="painting",
            description="Tinteggiatura pareti e soffitti",
            unit="mq",
            quantity=sqm * Decimal("3.5"),
            unit_price=BASE_RATES["painting"],
        ),
        WorkItemTemplate(
            room="Generale",
            category="disposal",
            description="Smaltimento macerie e trasporto",
            unit="cad",
            quantity=Decimal("1"),
            unit_price=BASE_RATES["disposal"],
        ),
        WorkItemTemplate(
            room="Generale",
            category="inspection",
            description="Collaudo impianti e certificazioni",
            unit="cad",
            quantity=Decimal("1"),
            unit_price=BASE_RATES["inspection"],
            requires_permit=True,
        ),
    ])

    for i in range(req.include_bathrooms):
        items.append(WorkItemTemplate(
            room=f"Bagno {i + 1}",
            category="bathroom",
            description="Rifacimento completo bagno",
            unit="cad",
            quantity=Decimal("1"),
            unit_price=BASE_RATES["bathroom"],
            requires_permit=True,
        ))

    if req.include_kitchen:
        items.append(WorkItemTemplate(
            room="Cucina",
            category="kitchen",
            description="Rifacimento cucina (impianti + mobili base)",
            unit="cad",
            quantity=Decimal("1"),
            unit_price=BASE_RATES["kitchen"],
        ))

    total = sum(
        (item.quantity * item.unit_price for item in items),
        Decimal("0"),
    )

    permit_items = [i for i in items if i.requires_permit]
    if permit_items:
        notes.append(
            f"{len(permit_items)} voci richiedono verifica titoli edilizi/permessi."
        )
    notes.append(
        "Importi indicativi. Validare con preventivi d'impresa prima dell'impegno."
    )
    notes.append(
        "Verificare agevolazioni fiscali applicabili con il commercialista."
    )

    return WorkListResponse(
        items=items,
        total_estimated=total.quantize(Decimal("0.01")),
        notes=notes,
    )
