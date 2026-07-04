"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/30 card-print",
        className
      )}
    >
      {title && (
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">{title}</h2>
      )}
      {children}
    </section>
  );
}

export function NumberField({
  label,
  suffix = "mm",
  value,
  onChange,
  min,
  max,
  step = 5,
  id,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-border bg-card-2 px-3 focus-within:border-primary">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          className="w-full bg-transparent py-3 text-lg font-semibold outline-none"
          value={Number.isFinite(value) ? value : ""}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
        />
        <span className="shrink-0 text-sm text-muted">{suffix}</span>
      </span>
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm text-muted">{label}</legend>
      <div className="grid gap-1 rounded-xl border border-border bg-card-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              "rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
              value === opt.value ? "bg-primary text-black" : "text-muted hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors",
        checked ? "border-primary bg-primary/10" : "border-border bg-card-2",
        disabled && "opacity-40"
      )}
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={clsx(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </span>
    </button>
  );
}

export function KV({ k, v, strong }: { k: string; v: ReactNode; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/50 py-1.5 last:border-b-0">
      <dt className="text-sm text-muted">{k}</dt>
      <dd className={clsx("text-right font-mono text-sm", strong && "text-base font-bold text-primary")}>{v}</dd>
    </div>
  );
}
