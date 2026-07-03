"use client";

import { formatCents } from "@/lib/money";
import type { DailyRevenuePoint } from "@/lib/analytics";

export function RevenueBarChart({ data }: { data: DailyRevenuePoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.cents));
  return (
    <div className="flex h-48 items-end gap-1.5" role="img" aria-label="Grafico incassi giornalieri">
      {data.map((d) => {
        const heightPct = Math.round((d.cents / max) * 100);
        return (
          <div key={d.date} className="group flex flex-1 flex-col items-center gap-1">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 transition-all group-hover:from-amber-500 group-hover:to-amber-300"
                style={{ height: `${Math.max(heightPct, 2)}%` }}
                title={`${d.label}: ${formatCents(d.cents)}`}
              />
              <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-100 shadow group-hover:block">
                {formatCents(d.cents)}
              </div>
            </div>
            <span className="text-[10px] text-zinc-500">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
