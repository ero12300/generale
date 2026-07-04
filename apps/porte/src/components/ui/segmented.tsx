"use client";

import * as React from "react";
import { cn } from "./cn";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly SegmentedOption<T>[];
  size?: "default" | "large";
  columns?: 2 | 3 | 4;
  className?: string;
  ariaLabel?: string;
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "default",
  columns,
  className,
  ariaLabel,
}: SegmentedProps<T>) {
  const gridCols =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-3"
        : columns === 4
          ? "grid-cols-4"
          : `grid-cols-${Math.min(options.length, 4)}`;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("grid gap-2", gridCols, className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center transition-all touch-manipulation",
              size === "large" ? "min-h-[76px]" : "min-h-[56px]",
              active
                ? "border-wood bg-wood/10 text-ink shadow-sm"
                : "border-line bg-white text-ink-soft hover:border-ink/30 hover:bg-canvas-soft"
            )}
          >
            {o.icon ? <div className="text-wood">{o.icon}</div> : null}
            <div className={cn("text-sm font-medium leading-tight", active && "text-ink")}>
              {o.label}
            </div>
            {o.description ? (
              <div className="text-[11px] leading-tight text-ink-muted">{o.description}</div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
