"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { formatEuro, formatPct } from "@/lib/money";

/** Converte un input "12,50" in centesimi interi; null se non valido. */
function parseEuroToCents(value: string): number | null {
  const normalized = value.replace(",", ".").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const [int, dec = ""] = normalized.split(".");
  return parseInt(int, 10) * 100 + parseInt((dec + "00").slice(0, 2) || "0", 10);
}

export function FoodCostSimulator() {
  const [price, setPrice] = useState("13,00");
  const [cost, setCost] = useState("4,20");
  const [vat, setVat] = useState("10");

  const priceCents = parseEuroToCents(price);
  const costCents = parseEuroToCents(cost);
  const vatPct = /^\d{1,2}$/.test(vat.trim()) ? parseInt(vat, 10) : null;

  let result: {
    foodCostPct: number;
    marginCents: number;
    minPriceCents: number;
    status: string;
  } | null = null;
  let error: string | null = null;

  if (priceCents === null || costCents === null || vatPct === null) {
    error = "Inserisca importi validi (es. 13,00) e IVA in percentuale.";
  } else if (priceCents <= 0) {
    error = "Il prezzo di vendita deve essere maggiore di zero.";
  } else {
    const netCents = Math.round(priceCents / (1 + vatPct / 100));
    const foodCostPct = (costCents / netCents) * 100;
    result = {
      foodCostPct,
      marginCents: netCents - costCents,
      minPriceCents: Math.round((costCents / 0.35) * (1 + vatPct / 100)),
      status:
        foodCostPct <= 25
          ? "ottimo"
          : foodCostPct <= 33
            ? "buono"
            : foodCostPct <= 40
              ? "attenzione"
              : "critico",
    };
  }

  const inputClass =
    "w-full rounded-lg border border-stone-300 px-3 py-2 text-sm tabular-nums focus:border-profit focus:outline-none focus:ring-2 focus:ring-profit-soft";

  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="sim-price" className="mb-1 block text-sm font-medium text-ink">
            Prezzo di vendita (€, IVA incl.)
          </label>
          <input id="sim-price" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="sim-cost" className="mb-1 block text-sm font-medium text-ink">
            Costo ingredienti porzione (€)
          </label>
          <input id="sim-cost" value={cost} onChange={(e) => setCost(e.target.value)} className={inputClass} inputMode="decimal" />
        </div>
        <div>
          <label htmlFor="sim-vat" className="mb-1 block text-sm font-medium text-ink">
            IVA (%)
          </label>
          <input id="sim-vat" value={vat} onChange={(e) => setVat(e.target.value)} className={inputClass} inputMode="numeric" />
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : result ? (
        <div role="status" className="mt-4 grid gap-3 rounded-lg bg-stone-50 p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-warmgray">Food cost</p>
            <p className="text-lg font-semibold tabular-nums text-ink">{formatPct(result.foodCostPct)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-warmgray">Margine lordo</p>
            <p className="text-lg font-semibold tabular-nums text-profit">{formatEuro(result.marginCents)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-warmgray">Prezzo minimo</p>
            <p className="text-lg font-semibold tabular-nums text-ink">{formatEuro(result.minPriceCents)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-warmgray">Stato</p>
            <p className="text-lg font-semibold capitalize text-ink">{result.status}</p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
