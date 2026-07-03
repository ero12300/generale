import { describe, expect, it } from "vitest";
import {
  createBarberBookingSchema,
  createDealSchema,
  stripeCheckoutSchema,
  updateDealSchema,
} from "@/lib/validations/api";

describe("createDealSchema", () => {
  it("accetta un deal valido", () => {
    const result = createDealSchema.safeParse({
      title: "Trilocale Milano",
      strategy: "fix_flip",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta titolo vuoto", () => {
    const result = createDealSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
  });
});

describe("updateDealSchema", () => {
  it("accetta cambio stage", () => {
    const result = updateDealSchema.safeParse({ stage: "offer" });
    expect(result.success).toBe(true);
  });

  it("rifiuta body vuoto", () => {
    const result = updateDealSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("createBarberBookingSchema", () => {
  it("accetta una prenotazione valida", () => {
    const result = createBarberBookingSchema.safeParse({
      customer_name: "Mario Rossi",
      customer_phone: "+39 333 1234567",
      service_id: "svc-signature",
      starts_at: "2026-07-04T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta una data non ISO", () => {
    const result = createBarberBookingSchema.safeParse({
      customer_name: "Mario Rossi",
      customer_phone: "+39 333 1234567",
      service_id: "svc-signature",
      starts_at: "domani alle 10",
    });
    expect(result.success).toBe(false);
  });
});

describe("stripeCheckoutSchema", () => {
  it("accetta solo piani vendibili", () => {
    expect(stripeCheckoutSchema.safeParse({ planId: "pro" }).success).toBe(true);
    expect(stripeCheckoutSchema.safeParse({ planId: "enterprise-custom" }).success).toBe(false);
  });
});
