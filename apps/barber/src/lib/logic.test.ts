import { describe, expect, it } from "vitest";
import {
  availableSlots,
  computeDiscount,
  computeRevenueKpi,
  dailyRevenueSeries,
  findCampaignByCode,
  findCustomerByReferralCode,
  generateReferralCode,
  toIsoDate,
} from "./logic";
import type { Booking, Campaign, Customer, Sale } from "./types";

function campaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: "c1",
    name: "Test",
    kind: "percentuale",
    code: "TEST10",
    value: 10,
    active: true,
    usageCount: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computeDiscount", () => {
  it("applica sconto percentuale", () => {
    expect(computeDiscount(2500, campaign({ kind: "percentuale", value: 10 }))).toBe(
      250,
    );
  });
  it("applica sconto fisso in centesimi", () => {
    expect(computeDiscount(2500, campaign({ kind: "fisso", value: 500 }))).toBe(500);
  });
  it("non supera mai il prezzo", () => {
    expect(computeDiscount(400, campaign({ kind: "fisso", value: 500 }))).toBe(400);
  });
  it("campagna disattivata = zero sconto", () => {
    expect(computeDiscount(2500, campaign({ active: false }))).toBe(0);
  });
});

describe("findCampaignByCode", () => {
  const campaigns = [
    campaign({ code: "BENVENUTO10" }),
    campaign({ id: "c2", code: "SPENTO", active: false }),
  ];
  it("trova il codice ignorando maiuscole/minuscole", () => {
    expect(findCampaignByCode(campaigns, "benvenuto10")?.id).toBe("c1");
  });
  it("ignora campagne disattivate", () => {
    expect(findCampaignByCode(campaigns, "SPENTO")).toBeUndefined();
  });
  it("ritorna undefined per codice vuoto", () => {
    expect(findCampaignByCode(campaigns, "  ")).toBeUndefined();
  });
});

describe("referral", () => {
  const customers: Customer[] = [
    {
      id: "x1",
      name: "Giulio Rossi",
      phone: "+39 333 1234567",
      referralCode: "GIULI421",
      createdAt: "2026-01-01T00:00:00.000Z",
      marketingConsent: false,
    },
  ];
  it("trova il cliente dal codice amico", () => {
    expect(findCustomerByReferralCode(customers, "giuli421")?.id).toBe("x1");
  });
  it("genera codici univoci basati sul nome", () => {
    const existing = new Set<string>(["MARIO123"]);
    const code = generateReferralCode("Mario Bianchi", existing);
    expect(code).toMatch(/^MARIO\d{3}$/);
    expect(existing.has(code)).toBe(false);
  });
  it("gestisce nomi con accenti e caratteri speciali", () => {
    const code = generateReferralCode("Niccolò D'Angelo", new Set());
    expect(code).toMatch(/^[A-Z]+\d{3}$/);
  });
});

describe("computeRevenueKpi", () => {
  const sales: Sale[] = [
    {
      id: "s1",
      date: "2026-07-01",
      serviceName: "Taglio",
      barberId: "b1",
      barberName: "Luca",
      amountCents: 2500,
      method: "carta",
      createdAt: "",
    },
    {
      id: "s2",
      date: "2026-07-01",
      serviceName: "Barba",
      barberId: "b2",
      barberName: "Marco",
      amountCents: 2000,
      method: "contanti",
      createdAt: "",
    },
  ];
  it("somma totale, conteggio e ticket medio in centesimi", () => {
    const kpi = computeRevenueKpi(sales);
    expect(kpi.totalCents).toBe(4500);
    expect(kpi.count).toBe(2);
    expect(kpi.averageTicketCents).toBe(2250);
  });
  it("raggruppa per metodo e barbiere", () => {
    const kpi = computeRevenueKpi(sales);
    expect(kpi.byMethod.carta).toBe(2500);
    expect(kpi.byBarber.Marco).toBe(2000);
  });
  it("gestisce lista vuota senza divisioni per zero", () => {
    const kpi = computeRevenueKpi([]);
    expect(kpi.totalCents).toBe(0);
    expect(kpi.averageTicketCents).toBe(0);
  });
});

describe("dailyRevenueSeries", () => {
  it("produce una serie di N giorni con totali", () => {
    const today = new Date("2026-07-03T12:00:00");
    const sales: Sale[] = [
      {
        id: "s1",
        date: "2026-07-03",
        serviceName: "Taglio",
        barberId: "b1",
        barberName: "Luca",
        amountCents: 2500,
        method: "carta",
        createdAt: "",
      },
    ];
    const series = dailyRevenueSeries(sales, 3, today);
    expect(series).toHaveLength(3);
    expect(series[2]).toEqual({ date: "2026-07-03", totalCents: 2500 });
    expect(series[0]).toEqual({ date: "2026-07-01", totalCents: 0 });
  });
});

describe("availableSlots", () => {
  const baseParams = {
    // 2026-07-08 è un mercoledì
    date: "2026-07-08",
    openingHour: 9,
    closingHour: 11,
    slotMinutes: 30,
    closedWeekdays: [0, 1],
    service: { durationMinutes: 30 },
    barberId: "b1",
    bookings: [] as Booking[],
    now: new Date("2026-07-03T12:00:00"),
  };

  it("genera gli slot nell'orario di apertura", () => {
    expect(availableSlots(baseParams)).toEqual([
      "09:00",
      "09:30",
      "10:00",
      "10:30",
    ]);
  });

  it("esclude gli slot occupati dallo stesso barbiere", () => {
    const booking: Booking = {
      id: "b",
      customerId: "c",
      customerName: "X",
      customerPhone: "123",
      serviceId: "s",
      serviceName: "Taglio",
      barberId: "b1",
      barberName: "Luca",
      date: "2026-07-08",
      time: "09:30",
      priceCents: 2500,
      discountCents: 0,
      status: "confermata",
      createdAt: "",
    };
    expect(
      availableSlots({ ...baseParams, bookings: [booking] }),
    ).toEqual(["09:00", "10:00", "10:30"]);
  });

  it("le prenotazioni annullate liberano lo slot", () => {
    const booking: Booking = {
      id: "b",
      customerId: "c",
      customerName: "X",
      customerPhone: "123",
      serviceId: "s",
      serviceName: "Taglio",
      barberId: "b1",
      barberName: "Luca",
      date: "2026-07-08",
      time: "09:30",
      priceCents: 2500,
      discountCents: 0,
      status: "annullata",
      createdAt: "",
    };
    expect(availableSlots({ ...baseParams, bookings: [booking] })).toHaveLength(4);
  });

  it("servizi lunghi occupano due slot", () => {
    expect(
      availableSlots({ ...baseParams, service: { durationMinutes: 60 } }),
    ).toEqual(["09:00", "09:30", "10:00"]);
  });

  it("nei giorni di chiusura non ci sono slot", () => {
    // 2026-07-06 è un lunedì (giorno di chiusura 1)
    expect(availableSlots({ ...baseParams, date: "2026-07-06" })).toEqual([]);
  });

  it("oggi esclude gli orari già passati", () => {
    const now = new Date("2026-07-08T09:45:00");
    expect(availableSlots({ ...baseParams, now })).toEqual(["10:00", "10:30"]);
  });
});

describe("toIsoDate", () => {
  it("formatta la data locale come YYYY-MM-DD", () => {
    expect(toIsoDate(new Date(2026, 6, 3))).toBe("2026-07-03");
  });
});
