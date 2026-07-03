import { describe, expect, it } from "vitest";
import { bookingLeadSchema, checkoutRequestSchema } from "@/lib/barber/schemas";

describe("bookingLeadSchema", () => {
  it("accetta una prenotazione valida", () => {
    const result = bookingLeadSchema.safeParse({
      customerName: "Mario Rossi",
      phone: "+39 333 000 0000",
      email: "mario@example.com",
      service: "combo-signature",
      preferredDate: "2026-07-04",
      preferredTime: "10:30",
      referralCode: "FRIEND20",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta telefono e servizio non validi", () => {
    const result = bookingLeadSchema.safeParse({
      customerName: "M",
      phone: "telefono",
      service: "massaggio",
      preferredDate: "",
      preferredTime: "",
    });

    expect(result.success).toBe(false);
  });
});

describe("checkoutRequestSchema", () => {
  it("accetta solo i piani monetizzabili", () => {
    expect(checkoutRequestSchema.safeParse({ planId: "basic" }).success).toBe(true);
    expect(checkoutRequestSchema.safeParse({ planId: "enterprise" }).success).toBe(false);
  });
});
