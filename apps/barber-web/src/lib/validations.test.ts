import { describe, expect, it } from "vitest";
import { bookingRequestSchema, checkoutRequestSchema } from "./validations";

describe("bookingRequestSchema", () => {
  it("accepts a complete booking request", () => {
    const parsed = bookingRequestSchema.safeParse({
      fullName: "Marco Rossi",
      phone: "+39 333 000 0000",
      serviceId: "cut-classic",
      preferredDate: "2026-07-04",
      preferredTime: "10:30",
      referralCode: "MARCO20",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects a booking request without phone number", () => {
    const parsed = bookingRequestSchema.safeParse({
      fullName: "Marco Rossi",
      phone: "",
      serviceId: "cut-classic",
      preferredDate: "2026-07-04",
      preferredTime: "10:30",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("checkoutRequestSchema", () => {
  it("accepts supported subscription plans", () => {
    expect(checkoutRequestSchema.safeParse({ plan: "basic" }).success).toBe(true);
    expect(checkoutRequestSchema.safeParse({ plan: "pro" }).success).toBe(true);
  });

  it("rejects unknown subscription plans", () => {
    expect(checkoutRequestSchema.safeParse({ plan: "enterprise" }).success).toBe(false);
  });
});
