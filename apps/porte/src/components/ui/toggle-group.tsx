"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  sublabel?: string;
}

interface Props<T extends string> {
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
  columns?: 2 | 3 | 4;
}

export function ToggleGroup<T extends string>({
  value,
  options,
  onChange,
  className,
  ariaLabel,
  columns = 2,
}: Props<T>) {
  const gridClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4";
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("grid gap-2", gridClass, className)}>
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
              "flex flex-col items-center justify-center gap-1 rounded-xl border py-3 px-2 transition-all touch-manipulation",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
              active
                ? "border-brand-400 bg-brand-500/15 text-brand-100 shadow-inner shadow-brand-500/20"
                : "border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800/70",
            )}
          >
            {opt.icon && <span className="text-brand-200">{opt.icon}</span>}
            <span className="text-sm font-medium">{opt.label}</span>
            {opt.sublabel && (
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                {opt.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
