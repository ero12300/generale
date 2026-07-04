"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "./cn";

/**
 * Campo numerico che lavora in centimetri (comodo per il rilievo in cantiere)
 * ma restituisce sempre millimetri interi, coerenti col motore di calcolo.
 */
export function NumberFieldCm({
  id,
  label,
  valueMm,
  onChangeMm,
  step = 10,
  min = 0,
  hint,
  error,
}: {
  id: string;
  label: string;
  valueMm: number | null;
  onChangeMm: (mm: number | null) => void;
  /** step in millimetri */
  step?: number;
  min?: number;
  hint?: string;
  error?: string;
}) {
  const cm = valueMm == null ? "" : String(valueMm / 10);

  function setFromCm(text: string) {
    if (text.trim() === "") {
      onChangeMm(null);
      return;
    }
    const normalized = text.replace(",", ".");
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) return;
    onChangeMm(Math.round(parsed * 10));
  }

  function bump(deltaMm: number) {
    const next = Math.max(min, (valueMm ?? 0) + deltaMm);
    onChangeMm(next);
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-xl border bg-[var(--color-surface)]",
          error ? "border-red-400" : "border-[var(--color-line)]"
        )}
      >
        <button
          type="button"
          aria-label={`Diminuisci ${label}`}
          onClick={() => bump(-step)}
          className="flex w-11 items-center justify-center text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] active:scale-95"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative flex flex-1 items-center border-x border-[var(--color-line)]">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={cm}
            onChange={(e) => setFromCm(e.target.value)}
            placeholder="0"
            className="num-field w-full bg-transparent px-3 py-3 text-center text-lg font-semibold outline-none"
          />
          <span className="pointer-events-none absolute right-3 text-sm text-[var(--color-muted)]">
            cm
          </span>
        </div>
        <button
          type="button"
          aria-label={`Aumenta ${label}`}
          onClick={() => bump(step)}
          className="flex w-11 items-center justify-center text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] active:scale-95"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-[var(--color-muted)]">{hint}</span>
        {valueMm != null ? (
          <span className="num-field text-[var(--color-muted)]">{valueMm} mm</span>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
