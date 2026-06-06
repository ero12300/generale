"""Test di integrazione degli endpoint FastAPI del motore analytics."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _analysis_payload() -> dict:
    return {
        "strategy": "fix_flip",
        "acquisition": {"asking_price": "200000", "target_discount_pct": "0.05"},
        "renovation": {"total_capex": "40000"},
        "financing": {"loan_amount": "120000", "property_value_for_ltv": "200000"},
        "sale": {"expected_sale_price": "280000"},
    }


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_analysis_returns_three_scenarios():
    res = client.post("/v1/analysis", json=_analysis_payload())
    assert res.status_code == 200
    data = res.json()
    for case in ("base_case", "prudent_case", "stress_case"):
        assert case in data
        assert data[case]["sensitivity_signal"] in ("green", "amber", "red")
        assert "transfer_tax" in data[case]["assumptions_used"]
    assert data["sensitivity_summary"]


def test_analysis_rejects_invalid_payload():
    # asking_price mancante -> errore di validazione Pydantic
    res = client.post("/v1/analysis", json={"renovation": {"total_capex": "10000"}})
    assert res.status_code == 422


def test_offer_letter_endpoint():
    res = client.post(
        "/v1/offer-letter",
        json={
            "property_address": "Via Friuli 12, Milano",
            "offered_price": "190000",
            "asking_price": "200000",
            "strategy": "fix_flip",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["commercial_text"]
    assert isinstance(data["legal_placeholders"], list)
    assert data["disclaimer"]


def test_work_list_endpoint():
    res = client.post(
        "/v1/work-list",
        json={"surface_sqm": "78", "rooms": 3, "condition": "da_ristrutturare"},
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) > 0
    assert float(data["total_estimated"]) > 0
