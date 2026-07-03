import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: { value: string; positive: boolean };
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={cn("glass rounded-xl p-5", accent && "border-[color:var(--color-gold-500)]/30")}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest text-ink-500">
          {label}
        </span>
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-md",
            accent
              ? "bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)]"
              : "bg-white/5 text-ink-300"
          )}
        >
          {icon}
        </span>
      </div>
      <div className="font-display text-3xl text-ink-50 mb-1">{value}</div>
      <div className="flex items-center justify-between text-xs">
        {hint && <span className="text-ink-400">{hint}</span>}
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1",
              delta.positive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {delta.positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}
