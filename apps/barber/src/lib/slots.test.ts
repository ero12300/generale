import { describe, expect, it } from "vitest";
import { availableSlots, minutesToTime, timeToMinutes } from "./slots";
import type { Appointment, ShopSettings } from "./types";

const settings: ShopSettings = {
  shopName: "Test",
  plan: "base",
  openingHour: 9,
  closingHour: 12,
  slotMinutes: 30,
  closedWeekdays: [0],
};

function apt(overrides: Partial<Appointment>): Appointment {
  return {
    id: "a1",
    clientName: "Test",
    clientPhone: "123456",
    serviceId: "s1",
    serviceName: "Taglio",
    barberId: "b1",
    barberName: "Marco",
    date: "2026-07-06", // lunedì
    time: "09:00",
    durationMin: 30,
    priceCents: 2500,
    discountCents: 0,
    status: "confermato",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("conversioni orario", () => {
  it("converte andata e ritorno", () => {
    expect(timeToMinutes("09:30")).toBe(570);
    expect(minutesToTime(570)).toBe("09:30");
  });
});

describe("availableSlots", () => {
  it("genera tutti gli slot in un giorno libero", () => {
    const slots = availableSlots("2026-07-06", 30, "b1", [], settings);
    expect(slots).toEqual(["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]);
  });

  it("esclude gli slot occupati considerando la durata", () => {
    const busy = [apt({ time: "09:30", durationMin: 60 })];
    const slots = availableSlots("2026-07-06", 30, "b1", busy, settings);
    expect(slots).toEqual(["09:00", "10:30", "11:00", "11:30"]);
  });

  it("un servizio lungo non entra negli spazi stretti", () => {
    const busy = [apt({ time: "10:00", durationMin: 30 })];
    const slots = availableSlots("2026-07-06", 90, "b1", busy, settings);
    expect(slots).toEqual(["10:30"]);
  });

  it("ignora gli appuntamenti annullati e di altri barbieri", () => {
    const busy = [
      apt({ time: "09:00", status: "annullato" }),
      apt({ time: "09:30", barberId: "b2" }),
    ];
    const slots = availableSlots("2026-07-06", 30, "b1", busy, settings);
    expect(slots).toContain("09:00");
    expect(slots).toContain("09:30");
  });

  it("restituisce vuoto nei giorni di chiusura", () => {
    // 2026-07-05 è domenica
    expect(availableSlots("2026-07-05", 30, "b1", [], settings)).toEqual([]);
  });
});
