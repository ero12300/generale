"use client";

import * as React from "react";
import { cn } from "./cn";

interface Option<T extends string> {
  value: T;
  label: React.ReactNode;
  hint?: string;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  ariaLabel: string;
  className?: string;
}

/**
 * Toggle-group mobile-friendly, comportamento come i radio.
 * Ottimizzato per touch: pulsanti larghi, tap target 44px+.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "grid gap-2",
        options.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3",
        className
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-all",
              "min-h-[3rem] touch-manipulation",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
              selected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-slate-900 dark:text-white ring-2 ring-blue-500/30"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600"
            )}
          >
            <span className="text-sm font-semibold">{opt.label}</span>
            {opt.hint && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {opt.hint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
