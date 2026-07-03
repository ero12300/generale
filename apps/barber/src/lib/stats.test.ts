import { describe, expect, it } from "vitest";
import { computeStats } from "./stats";
import type { Appointment, Client, Payment } from "./types";

const TODAY = "2026-07-03";

function pay(overrides: Partial<Payment>): Payment {
  return {
    id: Math.random().toString(36),
    clientName: "Cliente",
    serviceName: "Taglio Classico",
    amountCents: 2500,
    method: "contanti",
    date: TODAY,
    createdAt: `${TODAY}T10:00:00.000Z`,
    ...overrides,
  };
}

const clients: Client[] = [
  {
    id: "c1",
    name: "Mario",
    phone: "123",
    createdAt: `${TODAY}T08:00:00.000Z`,
    referralCode: "MARIO-ABC",
  },
  {
    id: "c2",
    name: "Luigi",
    phone: "456",
    createdAt: "2026-01-10T08:00:00.000Z",
    referralCode: "LUIGI-DEF",
  },
];

const appointments: Appointment[] = [];

describe("computeStats", () => {
  it("aggrega incassi di oggi, settimana e mese", () => {
    const payments = [
      pay({ amountCents: 2500, date: TODAY }),
      pay({ amountCents: 3800, date: TODAY }),
      pay({ amountCents: 1800, date: "2026-06-30" }), // settimana ma non mese
      pay({ amountCents: 5500, date: "2026-06-01" }), // fuori da tutto
    ];
    const stats = computeStats(payments, appointments, clients, TODAY);
    expect(stats.todayCents).toBe(6300);
    expect(stats.weekCents).toBe(8100);
    expect(stats.monthCents).toBe(6300);
    expect(stats.monthCount).toBe(2);
    expect(stats.avgTicketCents).toBe(3150);
  });

  it("conta i nuovi clienti del mese", () => {
    const stats = computeStats([], appointments, clients, TODAY);
    expect(stats.totalClients).toBe(2);
    expect(stats.newClientsMonth).toBe(1);
  });

  it("classifica i top servizi del mese per incasso", () => {
    const payments = [
      pay({ serviceName: "Taglio + Barba", amountCents: 3800 }),
      pay({ serviceName: "Taglio + Barba", amountCents: 3800 }),
      pay({ serviceName: "Barba Design", amountCents: 1800 }),
    ];
    const stats = computeStats(payments, appointments, clients, TODAY);
    expect(stats.topServices[0]).toEqual({
      serviceName: "Taglio + Barba",
      count: 2,
      amountCents: 7600,
    });
  });

  it("copre 14 giorni nel grafico incassi", () => {
    const stats = computeStats([], appointments, clients, TODAY);
    expect(stats.revenueByDay).toHaveLength(14);
    expect(stats.revenueByDay.at(-1)?.date).toBe(TODAY);
  });
});
