import type { Booking, Client } from "./types";
import { isSameDay } from "./utils";

export interface RevenuePoint {
  label: string;
  date: string;
  cents: number;
}

// Un incasso è "realizzato" quando la prenotazione è completata e pagata.
export function isRevenue(b: Booking): boolean {
  return b.status === "completata" && b.paymentMethod !== "non_pagato";
}

export function netCents(b: Booking): number {
  return b.priceCents - b.discountCents;
}

export function revenueForDay(bookings: Booking[], day: Date): number {
  return bookings
    .filter((b) => isRevenue(b) && isSameDay(b.start, day))
    .reduce((sum, b) => sum + netCents(b), 0);
}

export function revenueBetween(bookings: Booking[], from: Date, to: Date): number {
  return bookings
    .filter((b) => {
      if (!isRevenue(b)) return false;
      const d = new Date(b.start);
      return d >= from && d <= to;
    })
    .reduce((sum, b) => sum + netCents(b), 0);
}

export function last7DaysRevenue(bookings: Booking[], today = new Date()): RevenuePoint[] {
  const points: RevenuePoint[] = [];
  const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    points.push({
      label: days[d.getDay()],
      date: d.toISOString(),
      cents: revenueForDay(bookings, d),
    });
  }
  return points;
}

export interface DashboardKpis {
  todayRevenueCents: number;
  monthRevenueCents: number;
  todayBookings: number;
  pendingRequests: number;
  activeClients: number;
  avgTicketCents: number;
  completedThisMonth: number;
  noShowRate: number;
}

export function computeKpis(bookings: Booking[], clients: Client[], today = new Date()): DashboardKpis {
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

  const monthBookings = bookings.filter((b) => {
    const d = new Date(b.start);
    return d >= startMonth && d <= endMonth;
  });
  const completed = monthBookings.filter(isRevenue);
  const monthRevenueCents = completed.reduce((s, b) => s + netCents(b), 0);
  const noShows = monthBookings.filter((b) => b.status === "no_show").length;
  const totalDecided = completed.length + noShows;

  return {
    todayRevenueCents: revenueForDay(bookings, today),
    monthRevenueCents,
    todayBookings: bookings.filter((b) => isSameDay(b.start, today) && b.status !== "annullata").length,
    pendingRequests: bookings.filter((b) => b.status === "richiesta").length,
    activeClients: clients.length,
    avgTicketCents: completed.length ? Math.round(monthRevenueCents / completed.length) : 0,
    completedThisMonth: completed.length,
    noShowRate: totalDecided ? noShows / totalDecided : 0,
  };
}

export interface BarberPerformance {
  barberId: string;
  barberName: string;
  revenueCents: number;
  count: number;
}

export function revenueByBarber(bookings: Booking[], from: Date, to: Date): BarberPerformance[] {
  const map = new Map<string, BarberPerformance>();
  for (const b of bookings) {
    if (!isRevenue(b)) continue;
    const d = new Date(b.start);
    if (d < from || d > to) continue;
    const cur = map.get(b.barberId) ?? { barberId: b.barberId, barberName: b.barberName, revenueCents: 0, count: 0 };
    cur.revenueCents += netCents(b);
    cur.count += 1;
    map.set(b.barberId, cur);
  }
  return [...map.values()].sort((a, b) => b.revenueCents - a.revenueCents);
}

export interface TopService {
  serviceId: string;
  serviceName: string;
  count: number;
  revenueCents: number;
}

export function topServices(bookings: Booking[], limit = 5): TopService[] {
  const map = new Map<string, TopService>();
  for (const b of bookings) {
    if (!isRevenue(b)) continue;
    const cur = map.get(b.serviceId) ?? { serviceId: b.serviceId, serviceName: b.serviceName, count: 0, revenueCents: 0 };
    cur.count += 1;
    cur.revenueCents += netCents(b);
    map.set(b.serviceId, cur);
  }
  return [...map.values()].sort((a, b) => b.revenueCents - a.revenueCents).slice(0, limit);
}
