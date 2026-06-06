import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from app.parser import ParsedProperty, parse_listing_url

app = FastAPI(title="Deal Desk Intake", version="0.1.0")


def _cors_origins() -> list[str]:
    raw = os.getenv(
        "INTAKE_ALLOWED_ORIGINS",
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


class IntakeRequest(BaseModel):
    url: HttpUrl


@app.get("/health")
def health():
    return {"status": "ok", "service": "deal-desk-intake"}


@app.post("/v1/parse", response_model=ParsedProperty)
async def parse_url(request: IntakeRequest):
    try:
        return await parse_listing_url(str(request.url))
    except Exception as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
