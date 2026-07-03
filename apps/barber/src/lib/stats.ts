import type { Sale } from "./types";

export interface RevenueSummary {
  todayCents: number;
  weekCents: number;
  monthCents: number;
  totalDiscountMonthCents: number;
  salesCountMonth: number;
  averageTicketCents: number;
  byMethod: Record<string, number>;
  /** Ultimi 7 giorni, dal più vecchio al più recente. */
  last7Days: { date: string; totalCents: number }[];
}

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function summarizeRevenue(sales: Sale[], now: Date = new Date()): RevenueSummary {
  const today = toDateOnly(now);
  const monthPrefix = today.slice(0, 7);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const weekStartStr = toDateOnly(weekStart);

  let todayCents = 0;
  let weekCents = 0;
  let monthCents = 0;
  let totalDiscountMonthCents = 0;
  let salesCountMonth = 0;
  const byMethod: Record<string, number> = {};

  const dayTotals = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    dayTotals.set(toDateOnly(d), 0);
  }

  for (const sale of sales) {
    if (sale.date === today) todayCents += sale.amountCents;
    if (sale.date >= weekStartStr && sale.date <= today) {
      weekCents += sale.amountCents;
      if (dayTotals.has(sale.date)) {
        dayTotals.set(sale.date, (dayTotals.get(sale.date) ?? 0) + sale.amountCents);
      }
    }
    if (sale.date.startsWith(monthPrefix)) {
      monthCents += sale.amountCents;
      totalDiscountMonthCents += sale.discountCents;
      salesCountMonth += 1;
      byMethod[sale.method] = (byMethod[sale.method] ?? 0) + sale.amountCents;
    }
  }

  return {
    todayCents,
    weekCents,
    monthCents,
    totalDiscountMonthCents,
    salesCountMonth,
    averageTicketCents: salesCountMonth > 0 ? Math.round(monthCents / salesCountMonth) : 0,
    byMethod,
    last7Days: Array.from(dayTotals.entries()).map(([date, totalCents]) => ({
      date,
      totalCents,
    })),
  };
}
