import type {
  Appointment,
  Client,
  DashboardStats,
  Payment,
  PaymentMethod,
} from "./types";
import { addDays, todayISO, weekdayLabel } from "./dates";

/** Aggrega incassi, appuntamenti e clienti nelle statistiche della dashboard. */
export function computeStats(
  payments: Payment[],
  appointments: Appointment[],
  clients: Client[],
  today: string = todayISO(),
): DashboardStats {
  const weekStart = addDays(today, -6);
  const monthStart = `${today.slice(0, 7)}-01`;

  let todayCents = 0;
  let weekCents = 0;
  let monthCents = 0;
  let monthCount = 0;

  const byDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    byDay.set(addDays(today, -i), 0);
  }

  const byService = new Map<string, { count: number; amountCents: number }>();
  const byMethod = new Map<PaymentMethod, number>();

  for (const p of payments) {
    if (p.date === today) todayCents += p.amountCents;
    if (p.date >= weekStart && p.date <= today) weekCents += p.amountCents;
    if (p.date >= monthStart && p.date <= today) {
      monthCents += p.amountCents;
      monthCount += 1;
      const svc = byService.get(p.serviceName) ?? { count: 0, amountCents: 0 };
      svc.count += 1;
      svc.amountCents += p.amountCents;
      byService.set(p.serviceName, svc);
      byMethod.set(p.method, (byMethod.get(p.method) ?? 0) + p.amountCents);
    }
    if (byDay.has(p.date)) {
      byDay.set(p.date, (byDay.get(p.date) ?? 0) + p.amountCents);
    }
  }

  const monthCreatedAtStart = `${monthStart}T00:00:00`;
  const newClientsMonth = clients.filter(
    (c) => c.createdAt >= monthCreatedAtStart,
  ).length;

  return {
    todayCents,
    weekCents,
    monthCents,
    monthCount,
    avgTicketCents: monthCount > 0 ? Math.floor(monthCents / monthCount) : 0,
    todayAppointments: appointments.filter(
      (a) => a.date === today && a.status !== "annullato",
    ).length,
    pendingAppointments: appointments.filter((a) => a.status === "in_attesa")
      .length,
    totalClients: clients.length,
    newClientsMonth,
    revenueByDay: [...byDay.entries()].map(([date, amountCents]) => ({
      date,
      label: weekdayLabel(date),
      amountCents,
    })),
    topServices: [...byService.entries()]
      .map(([serviceName, v]) => ({ serviceName, ...v }))
      .sort((a, b) => b.amountCents - a.amountCents)
      .slice(0, 5),
    methodBreakdown: [...byMethod.entries()]
      .map(([method, amountCents]) => ({ method, amountCents }))
      .sort((a, b) => b.amountCents - a.amountCents),
  };
}
