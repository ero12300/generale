import { describe, expect, it } from "vitest";
import { bookingRequestSchema, checkoutRequestSchema } from "@/lib/barber/validations";

describe("bookingRequestSchema", () => {
  it("accetta una prenotazione valida", () => {
    const result = bookingRequestSchema.safeParse({
      clientName: "Luca Rinaldi",
      barberName: "Michele",
      serviceId: "svc-signature-fade",
      bookingDate: "2026-07-03",
      bookingTime: "18:30",
      referralCode: "GOLD10",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta orario non valido", () => {
    const result = bookingRequestSchema.safeParse({
      clientName: "Luca Rinaldi",
      barberName: "Michele",
      serviceId: "svc-signature-fade",
      bookingDate: "2026-07-03",
      bookingTime: "1830",
    });

    expect(result.success).toBe(false);
  });
});

describe("checkoutRequestSchema", () => {
  it("accetta piano pro", () => {
    const result = checkoutRequestSchema.safeParse({
      plan: "pro",
      billingCycle: "monthly",
      originPath: "/growth",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta piano sconosciuto", () => {
    const result = checkoutRequestSchema.safeParse({
      plan: "elite",
      billingCycle: "monthly",
    });

    expect(result.success).toBe(false);
  });
});
