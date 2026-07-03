import { describe, it, expect } from "vitest";
import { computeKpis, isRevenue, netCents, revenueForDay } from "./analytics";
import type { Booking, Client } from "./types";

function booking(partial: Partial<Booking>): Booking {
  return {
    id: partial.id ?? "b1",
    clientName: "Test",
    clientPhone: "123",
    serviceId: "svc",
    serviceName: "Taglio",
    barberId: "brb",
    barberName: "Marco",
    start: partial.start ?? new Date().toISOString(),
    durationMin: 30,
    priceCents: partial.priceCents ?? 2000,
    status: partial.status ?? "completata",
    paymentMethod: partial.paymentMethod ?? "contanti",
    discountCents: partial.discountCents ?? 0,
    createdAt: new Date().toISOString(),
    source: "interno",
    ...partial,
  };
}

describe("analytics", () => {
  it("considera incasso solo prenotazioni completate e pagate", () => {
    expect(isRevenue(booking({ status: "completata", paymentMethod: "carta" }))).toBe(true);
    expect(isRevenue(booking({ status: "completata", paymentMethod: "non_pagato" }))).toBe(false);
    expect(isRevenue(booking({ status: "confermata", paymentMethod: "carta" }))).toBe(false);
    expect(isRevenue(booking({ status: "no_show" }))).toBe(false);
  });

  it("calcola il netto sottraendo lo sconto", () => {
    expect(netCents(booking({ priceCents: 3000, discountCents: 500 }))).toBe(2500);
  });

  it("somma gli incassi del giorno", () => {
    const today = new Date();
    const bookings = [
      booking({ id: "1", priceCents: 2000, start: today.toISOString() }),
      booking({ id: "2", priceCents: 3000, discountCents: 500, start: today.toISOString() }),
      booking({ id: "3", priceCents: 5000, status: "confermata", paymentMethod: "non_pagato", start: today.toISOString() }),
    ];
    expect(revenueForDay(bookings, today)).toBe(2000 + 2500);
  });

  it("calcola i KPI di base", () => {
    const today = new Date();
    const bookings = [
      booking({ id: "1", priceCents: 2000, start: today.toISOString() }),
      booking({ id: "2", priceCents: 4000, start: today.toISOString() }),
      booking({ id: "3", status: "richiesta", paymentMethod: "non_pagato", start: today.toISOString() }),
    ];
    const clients: Client[] = [];
    const kpis = computeKpis(bookings, clients, today);
    expect(kpis.todayRevenueCents).toBe(6000);
    expect(kpis.pendingRequests).toBe(1);
    expect(kpis.avgTicketCents).toBe(3000);
  });
});
