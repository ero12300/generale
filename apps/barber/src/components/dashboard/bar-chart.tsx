"use client";

import { eurCompact } from "@/lib/money";
import type { RevenuePoint } from "@/lib/analytics";

export function RevenueBars({ data }: { data: RevenuePoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.cents));
  return (
    <div className="flex h-44 items-end justify-between gap-2">
      {data.map((d, i) => {
        const heightPct = Math.max(4, (d.cents / max) * 100);
        const isToday = i === data.length - 1;
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className={`w-full rounded-t-lg transition-all ${
                  isToday ? "gold-gradient" : "bg-[var(--gold)]/25"
                }`}
                style={{ height: `${heightPct}%` }}
                title={eurCompact(d.cents)}
              />
            </div>
            <span className="text-[10px] text-muted">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
