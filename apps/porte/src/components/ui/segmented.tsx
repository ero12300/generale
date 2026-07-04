"use client";

import { cn } from "./cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  columns,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  columns?: number;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center rounded-xl border px-2 py-2 text-sm font-medium transition-all active:scale-[.98]",
              active
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
            )}
          >
            <span>{opt.label}</span>
            {opt.hint ? (
              <span className="mt-0.5 text-[11px] font-normal text-[var(--color-muted)]">
                {opt.hint}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
