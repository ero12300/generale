from decimal import Decimal

from app.schemas import DealStrategy, OfferLetterRequest, OfferLetterResponse

DISCLAIMER = (
    "BOZZA GENERATA AUTOMATICAMENTE — Non costituisce consulenza legale o fiscale. "
    "Revisione obbligatoria da parte di avvocato/notaio prima dell'invio."
)


def generate_offer_letter(req: OfferLetterRequest) -> OfferLetterResponse:
    discount = (
        ((req.asking_price - req.offered_price) / req.asking_price * Decimal("100"))
        if req.asking_price > 0
        else Decimal("0")
    )
    deposit = req.offered_price * req.deposit_pct

    strategy_labels = {
        DealStrategy.FIX_FLIP: "acquisto con finalità di riqualificazione e successiva vendita",
        DealStrategy.BUY_RENOVATE_RENT: "acquisto con ristrutturazione e locazione",
        DealStrategy.BUY_HOLD_SELL: "acquisto con gestione patrimoniale e exit programmata",
    }

    points_text = "\n".join(f"  • {p}" for p in req.key_points) if req.key_points else (
        "  • Prezzo coerente con analisi di mercato e stato dell'immobile\n"
        "  • Tempistiche definite per perizia e accesso tecnico"
    )

    docs_text = "\n".join(f"  • {d}" for d in req.requested_documents)

    commercial = f"""PROPOSTA DI ACQUISTO — BOZZA COMMERCIALE

Oggetto: Immobile sito in {req.property_address}

Gentile Venditore,

con la presente formuliamo proposta irrevocabile per {req.closing_days} giorni
per l'acquisto dell'immobile in oggetto, alle seguenti condizioni economiche:

  Prezzo richiesto:     € {req.asking_price:,.2f}
  Prezzo offerto:       € {req.offered_price:,.2f} (sconto circa {discount:.1f}%)
  Caparra confirmatoria: € {deposit:,.2f} ({req.deposit_pct * 100:.0f}% del prezzo offerto)

Finalità dell'acquisto: {strategy_labels.get(req.strategy, 'investimento immobiliare')}.

Motivazione sintetica:
{points_text}

Documentazione richiesta prima del rogito:
{docs_text}

Tempistiche proposte:
  • Accettazione proposta: entro {req.closing_days // 3} giorni
  • Perizia tecnica e verifiche documentali: entro {req.closing_days // 2} giorni
  • Rogito: entro {req.closing_days} giorni dall'accettazione

Restiamo a disposizione per un sopralluogo tecnico e per approfondire
ogni aspetto dell'operazione.

Cordiali saluti,
[SOCIETÀ ACQUIRENTE — da compilare]
"""

    placeholders = [
        {
            "key": "CLAUSOLA_SOSPENSIVA",
            "text": "[INSERIRE clausole sospensive: mutuo, conformità urbanistica, assenza vincoli]",
        },
        {
            "key": "CLAUSOLA_PENALE",
            "text": "[INSERIRE penale per inadempimento — revisione legale obbligatoria]",
        },
        {
            "key": "CLAUSOLA_PROPRIETÀ",
            "text": "[INSERIRE dichiarazioni sullo stato di fatto e di diritto dell'immobile]",
        },
        {
            "key": "CLAUSOLA_PRIVACY",
            "text": "[INSERIRE informativa trattamento dati personali]",
        },
        {
            "key": "FIRMA",
            "text": "[FIRMA LEGALE RAPPRESENTANTE + TIMBRO SOCIETÀ]",
        },
    ]

    return OfferLetterResponse(
        commercial_text=commercial,
        legal_placeholders=placeholders,
        disclaimer=DISCLAIMER,
    )
