import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.formulas import run_full_analysis
from app.offer_generator import generate_offer_letter
from app.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    OfferLetterRequest,
    OfferLetterResponse,
    WorkListRequest,
    WorkListResponse,
)
from app.work_list_generator import generate_work_list

app = FastAPI(
    title="Deal Desk Analytics",
    description="Motore analitico per investimenti immobiliari in SRL",
    version="0.1.0",
)

def _cors_origins() -> list[str]:
    raw = os.getenv(
        "ANALYTICS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    )
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "deal-desk-analytics"}


@app.post("/v1/analysis", response_model=AnalysisResponse)
def analyze(request: AnalysisRequest) -> AnalysisResponse:
    return run_full_analysis(request)


@app.post("/v1/offer-letter", response_model=OfferLetterResponse)
def offer_letter(request: OfferLetterRequest) -> OfferLetterResponse:
    return generate_offer_letter(request)


@app.post("/v1/work-list", response_model=WorkListResponse)
def work_list(request: WorkListRequest) -> WorkListResponse:
    return generate_work_list(request)
