import { describe, it, expect } from "vitest";
import {
  revenueToday,
  revenueInLastDays,
  dailyRevenueSeries,
  revenueByMethod,
  averageTicket,
  bookingsToday,
  upcomingBookings,
  topClients,
} from "./analytics";
import type { Booking, Client, Payment } from "./types";

function payment(amountCents: number, daysAgo: number, method: Payment["method"] = "card"): Payment {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `p-${Math.random()}`,
    organizationId: "org",
    bookingId: null,
    clientId: null,
    amountCents,
    method,
    description: "test",
    date: d.toISOString(),
  };
}

describe("analytics", () => {
  const payments: Payment[] = [
    payment(2000, 0, "cash"),
    payment(3000, 0, "card"),
    payment(1500, 2, "card"),
    payment(4500, 20, "card"),
  ];

  it("calcola incasso di oggi", () => {
    expect(revenueToday(payments)).toBe(5000);
  });

  it("calcola incasso ultimi N giorni", () => {
    expect(revenueInLastDays(payments, 7)).toBe(6500);
    expect(revenueInLastDays(payments, 30)).toBe(11000);
  });

  it("genera una serie giornaliera della lunghezza richiesta", () => {
    const series = dailyRevenueSeries(payments, 7);
    expect(series).toHaveLength(7);
    // l'ultimo punto è oggi con 5000
    expect(series[series.length - 1].cents).toBe(5000);
  });

  it("ripartisce per metodo di pagamento", () => {
    const byMethod = revenueByMethod(payments);
    expect(byMethod.cash).toBe(2000);
    expect(byMethod.card).toBe(9000);
  });

  it("calcola lo scontrino medio", () => {
    expect(averageTicket(payments)).toBe(Math.round(11000 / 4));
    expect(averageTicket([])).toBe(0);
  });

  it("filtra prenotazioni di oggi ordinate e prossime", () => {
    const now = new Date();
    const bookingBase = (hoursFromNow: number, status: Booking["status"] = "confirmed"): Booking => {
      const d = new Date(now.getTime() + hoursFromNow * 3600_000);
      return {
        id: `b-${Math.random()}`,
        organizationId: "org",
        clientId: null,
        clientName: "Test",
        clientPhone: "",
        serviceId: "s",
        serviceName: "Taglio",
        staffId: "st",
        staffName: "Marco",
        startAt: d.toISOString(),
        durationMin: 30,
        priceCents: 2000,
        status,
        source: "internal",
        notes: null,
        createdAt: now.toISOString(),
      };
    };
    const bookings = [bookingBase(1), bookingBase(-1), bookingBase(2, "cancelled")];
    // Oggi: esclude annullate
    const today = bookingsToday(bookings);
    expect(today.every((b) => b.status !== "cancelled")).toBe(true);
    // Prossime: solo future e non annullate
    const upcoming = upcomingBookings(bookings);
    expect(upcoming.every((b) => new Date(b.startAt).getTime() >= now.getTime() - 1000)).toBe(true);
    expect(upcoming.some((b) => b.status === "cancelled")).toBe(false);
  });

  it("ordina i clienti top per spesa", () => {
    const clients: Client[] = [
      { id: "1", organizationId: "org", name: "A", phone: "", email: null, notes: null, tags: [], visits: 1, totalSpentCents: 1000, loyaltyPoints: 0, referralCode: "A", referredByCode: null, lastVisitAt: null, createdAt: "" },
      { id: "2", organizationId: "org", name: "B", phone: "", email: null, notes: null, tags: [], visits: 5, totalSpentCents: 9000, loyaltyPoints: 0, referralCode: "B", referredByCode: null, lastVisitAt: null, createdAt: "" },
    ];
    const tops = topClients(clients, 5);
    expect(tops[0].name).toBe("B");
  });
});
