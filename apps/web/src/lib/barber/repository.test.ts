import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { saveBookingLead } from "@/lib/barber/repository";

const demoStorageKey = "barber_os_booking_leads";

function createLocalStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

describe("saveBookingLead", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: createLocalStorage() },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("usa localStorage demo quando Firebase non e configurato", async () => {
    const result = await saveBookingLead({
      customerName: "Eros Barber Demo",
      phone: "+39 333 123 4567",
      email: "eros@example.com",
      service: "combo-signature",
      preferredDate: "2026-07-04",
      preferredTime: "10:30",
      referralCode: "FRIEND20",
    });

    expect(result.mode).toBe("demo");

    const saved = JSON.parse(window.localStorage.getItem(demoStorageKey) ?? "[]");
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      customerName: "Eros Barber Demo",
      service: "combo-signature",
      status: "requested",
    });
  });

  it("ripristina il fallback demo se il localStorage contiene dati non JSON", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { localStorage: createLocalStorage({ [demoStorageKey]: "not-json" }) },
    });

    const result = await saveBookingLead({
      customerName: "Eros Barber Demo",
      phone: "+39 333 123 4567",
      email: "eros@example.com",
      service: "combo-signature",
      preferredDate: "2026-07-04",
      preferredTime: "10:30",
      referralCode: "FRIEND20",
    });

    expect(result.mode).toBe("demo");
    expect(JSON.parse(window.localStorage.getItem(demoStorageKey) ?? "[]")).toHaveLength(1);
  });
});
