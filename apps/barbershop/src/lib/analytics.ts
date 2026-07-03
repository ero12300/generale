import type { Booking, Client, Payment } from "./types";
import { sumCents, type Cents } from "./money";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Incasso totale in un intervallo di giorni a partire da oggi (incluso). */
export function revenueInLastDays(payments: Payment[], days: number): Cents {
  const from = startOfDay(new Date());
  from.setDate(from.getDate() - (days - 1));
  return sumCents(
    payments
      .filter((p) => new Date(p.date) >= from)
      .map((p) => p.amountCents)
  );
}

/** Incasso di oggi. */
export function revenueToday(payments: Payment[]): Cents {
  const today = startOfDay(new Date()).getTime();
  return sumCents(
    payments
      .filter((p) => startOfDay(new Date(p.date)).getTime() === today)
      .map((p) => p.amountCents)
  );
}

export interface DailyRevenuePoint {
  date: string; // ISO date (yyyy-mm-dd)
  label: string; // etichetta breve
  cents: Cents;
}

/** Serie giornaliera degli incassi per gli ultimi N giorni. */
export function dailyRevenueSeries(payments: Payment[], days: number): DailyRevenuePoint[] {
  const points: DailyRevenuePoint[] = [];
  const base = startOfDay(new Date());
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(base);
    day.setDate(base.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    const cents = sumCents(
      payments
        .filter((p) => new Date(p.date).toISOString().slice(0, 10) === key)
        .map((p) => p.amountCents)
    );
    points.push({
      date: key,
      label: day.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" }),
      cents,
    });
  }
  return points;
}

/** Ripartizione incassi per metodo di pagamento. */
export function revenueByMethod(payments: Payment[]): Record<string, Cents> {
  const result: Record<string, Cents> = {};
  for (const p of payments) {
    result[p.method] = (result[p.method] ?? 0) + p.amountCents;
  }
  return result;
}

/** Scontrino medio in centesimi. */
export function averageTicket(payments: Payment[]): Cents {
  if (payments.length === 0) return 0;
  return Math.round(sumCents(payments.map((p) => p.amountCents)) / payments.length);
}

/** Prenotazioni di oggi ordinate per orario. */
export function bookingsToday(bookings: Booking[]): Booking[] {
  const today = startOfDay(new Date()).getTime();
  return bookings
    .filter(
      (b) =>
        startOfDay(new Date(b.startAt)).getTime() === today &&
        b.status !== "cancelled"
    )
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

/** Prossime prenotazioni (da adesso in poi). */
export function upcomingBookings(bookings: Booking[], limit = 8): Booking[] {
  const now = Date.now();
  return bookings
    .filter((b) => new Date(b.startAt).getTime() >= now && b.status !== "cancelled")
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, limit);
}

/** Top clienti per spesa totale. */
export function topClients(clients: Client[], limit = 5): Client[] {
  return [...clients]
    .sort((a, b) => b.totalSpentCents - a.totalSpentCents)
    .slice(0, limit);
}
