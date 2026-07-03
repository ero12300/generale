import { describe, it, expect } from "vitest";
import { generateSlots } from "./slots";
import type { Booking, ShopSettings } from "./types";

const settings: ShopSettings = {
  shopName: "Test",
  ownerName: "Eros",
  address: "",
  phone: "",
  openHour: 9,
  closeHour: 12,
  slotMinutes: 30,
  workingDays: [1, 2, 3, 4, 5, 6],
};

function nextMonday(): Date {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

describe("slots", () => {
  it("genera slot dentro l'orario di apertura", () => {
    const day = nextMonday().toISOString();
    const slots = generateSlots(settings, [], "brb", day, 30);
    // 9:00, 9:30, 10:00, 10:30, 11:00, 11:30 = 6 slot (11:30+30=12:00 chiusura ok)
    expect(slots.length).toBe(6);
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("marca come occupato uno slot con prenotazione sovrapposta", () => {
    const monday = nextMonday();
    monday.setHours(10, 0, 0, 0);
    const busy: Booking = {
      id: "b", clientName: "x", clientPhone: "", serviceId: "s", serviceName: "s",
      barberId: "brb", barberName: "m", start: monday.toISOString(), durationMin: 30,
      priceCents: 2000, status: "confermata", paymentMethod: "non_pagato",
      discountCents: 0, createdAt: "", source: "interno",
    };
    const slots = generateSlots(settings, [busy], "brb", monday.toISOString(), 30);
    const ten = slots.find((s) => s.label === "10:00");
    expect(ten?.available).toBe(false);
  });

  it("ritorna vuoto nei giorni di chiusura", () => {
    const closed: ShopSettings = { ...settings, workingDays: [1] };
    const sunday = new Date();
    sunday.setDate(sunday.getDate() + ((7 - sunday.getDay()) % 7));
    sunday.setHours(0, 0, 0, 0);
    // find a day not in workingDays
    const notWorking = new Date();
    notWorking.setDate(notWorking.getDate() + ((2 - notWorking.getDay() + 7) % 7)); // a Tuesday
    const slots = generateSlots(closed, [], "brb", notWorking.toISOString(), 30);
    expect(slots.length).toBe(0);
  });
});
