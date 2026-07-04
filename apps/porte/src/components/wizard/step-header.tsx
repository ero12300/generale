"use client";

import { cn } from "@/components/ui/cn";

interface StepHeaderProps {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
}

export function StepHeader({ step, total, title, subtitle }: StepHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i + 1 <= step ? "bg-wood" : "bg-line"
            )}
          />
        ))}
      </div>
      <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        Passo {step} di {total}
      </div>
      <h1 className="mt-1 text-2xl font-semibold leading-tight text-ink">{title}</h1>
      {subtitle ? <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p> : null}
    </div>
  );
}
