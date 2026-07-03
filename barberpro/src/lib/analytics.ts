import type { Booking, Payment } from "./types";

export interface RevenuePoint {
  label: string;
  dateKey: string;
  net: number;
}

function netCents(p: Payment): number {
  return Math.max(0, p.amountCents - p.discountCents);
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Totale netto incassato in un intervallo [from, to). */
export function totalNet(payments: Payment[], from: Date, to: Date): number {
  return payments
    .filter((p) => {
      const d = new Date(p.date);
      return d >= from && d < to;
    })
    .reduce((sum, p) => sum + netCents(p), 0);
}

export function revenueToday(payments: Payment[]): number {
  const from = startOfDay(new Date());
  const to = new Date(from);
  to.setDate(to.getDate() + 1);
  return totalNet(payments, from, to);
}

export function revenueThisMonth(payments: Payment[]): number {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return totalNet(payments, from, to);
}

export function revenueLastMonth(payments: Payment[]): number {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const to = new Date(now.getFullYear(), now.getMonth(), 1);
  return totalNet(payments, from, to);
}

/** Serie giornaliera degli ultimi N giorni. */
export function dailyRevenue(payments: Payment[], days = 30): RevenuePoint[] {
  const points: RevenuePoint[] = [];
  const today = startOfDay(new Date());
  const fmt = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit" });
  for (let i = days - 1; i >= 0; i--) {
    const from = new Date(today);
    from.setDate(from.getDate() - i);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    points.push({
      label: fmt.format(from),
      dateKey: from.toISOString().slice(0, 10),
      net: totalNet(payments, from, to),
    });
  }
  return points;
}

export interface ServiceBreakdown {
  name: string;
  count: number;
  net: number;
}

export function revenueByService(payments: Payment[]): ServiceBreakdown[] {
  const map = new Map<string, ServiceBreakdown>();
  for (const p of payments) {
    const key = p.description || "Altro";
    const entry = map.get(key) ?? { name: key, count: 0, net: 0 };
    entry.count += 1;
    entry.net += netCents(p);
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => b.net - a.net);
}

export function averageTicket(payments: Payment[]): number {
  if (payments.length === 0) return 0;
  const total = payments.reduce((s, p) => s + netCents(p), 0);
  return Math.round(total / payments.length);
}

export function upcomingBookings(bookings: Booking[], limit = 6): Booking[] {
  const now = Date.now();
  return bookings
    .filter((b) => new Date(b.start).getTime() >= now && b.status !== "cancelled")
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, limit);
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}
