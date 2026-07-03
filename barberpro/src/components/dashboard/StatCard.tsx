import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/format";

export function StatCard({
  label,
  value,
  icon: Icon,
  change,
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  change?: number | null;
  hint?: string;
}) {
  const showChange = typeof change === "number";
  const positive = (change ?? 0) >= 0;
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-cream/45">{label}</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-gold/20 bg-gold/5 text-gold-soft">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-cream">{value}</p>
      {showChange ? (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 text-xs",
            positive ? "text-emerald-400" : "text-red-400",
          )}
        >
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}
          {change}% vs mese scorso
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-cream/40">{hint}</p>
      ) : null}
    </div>
  );
}
