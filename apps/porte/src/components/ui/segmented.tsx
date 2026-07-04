"use client";

import * as React from "react";
import { cn } from "./cn";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedOption<T>[];
  className?: string;
  "aria-label"?: string;
}

export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  className,
  ...rest
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={rest["aria-label"]}
      className={cn(
        "grid gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              "flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-all touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
              active
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
