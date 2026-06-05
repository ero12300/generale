"""Parser listing URL — estrazione campi minimi con Playwright.

Solo URL forniti dall'utente. Nessuno scraping massivo.
"""

import json
import re
from decimal import Decimal
from typing import Any

from pydantic import BaseModel, Field


class ParsedProperty(BaseModel):
    source_url: str
    price_asked: float | None = None
    surface_sqm: float | None = None
    address: str | None = None
    zone: str | None = None
    city: str | None = None
    province: str | None = None
    property_type: str | None = None
    condition: str | None = None
    rooms: int | None = None
    floor: str | None = None
    energy_class: str | None = None
    condo_fees_monthly: float | None = None
    has_elevator: bool | None = None
    has_terrace: bool | None = None
    has_parking: bool | None = None
    description: str | None = None
    media_urls: list[str] = Field(default_factory=list)
    raw_fields: dict[str, Any] = Field(default_factory=dict)
    page_title: str | None = None
    extraction_method: str = "playwright"


def _parse_price(text: str) -> float | None:
    cleaned = re.sub(r"[^\d]", "", text)
    if not cleaned:
        return None
    value = int(cleaned)
    return float(value) if value > 1000 else None


def _parse_surface(text: str) -> float | None:
    match = re.search(r"(\d+(?:[.,]\d+)?)\s*m", text, re.I)
    if match:
        return float(match.group(1).replace(",", "."))
    return None


def _parse_rooms(text: str) -> int | None:
    match = re.search(r"(\d+)\s*(?:locali|stanze|camere)", text, re.I)
    if match:
        return int(match.group(1))
    return None


async def parse_listing_url(url: str) -> ParsedProperty:
    """Estrae campi da URL annuncio usando Playwright."""
    from playwright.async_api import async_playwright

    result = ParsedProperty(source_url=url)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            title = await page.title()
            result.page_title = title

            body_text = await page.inner_text("body")
            result.raw_fields["body_excerpt"] = body_text[:3000]

            # Prezzo — pattern comuni portali IT
            for selector in [
                "[data-testid='price']",
                ".price",
                ".info-data-price",
                "span[class*='price']",
            ]:
                el = await page.query_selector(selector)
                if el:
                    price_text = await el.inner_text()
                    result.price_asked = _parse_price(price_text)
                    if result.price_asked:
                        break

            if not result.price_asked:
                price_match = re.search(
                    r"€\s*([\d.,]+)", body_text[:5000]
                )
                if price_match:
                    result.price_asked = _parse_price(price_match.group(1))

            # Superficie
            sqm_match = re.search(r"(\d+)\s*m²", body_text)
            if sqm_match:
                result.surface_sqm = float(sqm_match.group(1))
            else:
                result.surface_sqm = _parse_surface(body_text[:5000])

            # Locali
            result.rooms = _parse_rooms(body_text[:5000])

            # Immagini
            imgs = await page.query_selector_all("img[src*='http']")
            for img in imgs[:10]:
                src = await img.get_attribute("src")
                if src and "logo" not in src.lower():
                    result.media_urls.append(src)

            # Meta description
            meta = await page.query_selector('meta[name="description"]')
            if meta:
                content = await meta.get_attribute("content")
                if content:
                    result.description = content[:2000]

            # H1 come indirizzo/zona fallback
            h1 = await page.query_selector("h1")
            if h1:
                h1_text = await h1.inner_text()
                result.address = h1_text[:200]
                result.raw_fields["h1"] = h1_text

        except Exception as exc:
            result.raw_fields["error"] = str(exc)
            result.extraction_method = "playwright_partial"
        finally:
            await browser.close()

    return result


def parse_listing_url_sync(url: str) -> ParsedProperty:
    import asyncio
    return asyncio.run(parse_listing_url(url))
