import { describe, expect, it } from "vitest";
import {
  createBarberBookingSchema,
  createBarberCampaignSchema,
  createBarberCustomerSchema,
} from "@/lib/validations/barber";

describe("barber validations", () => {
  it("valida creazione cliente", () => {
    const result = createBarberCustomerSchema.safeParse({
      full_name: "Mario Verdi",
      phone: "+39 333 000 1111",
      source: "instagram",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta prenotazione senza data valida", () => {
    const result = createBarberBookingSchema.safeParse({
      customer_id: "abc",
      service_name: "Taglio",
      start_at: "domani",
      duration_minutes: 45,
      price_cents: 3000,
    });
    expect(result.success).toBe(false);
  });

  it("valida campagna referral", () => {
    const result = createBarberCampaignSchema.safeParse({
      name: "Porta un amico estate",
      type: "bring_a_friend",
      code: "AMICO25",
      discount_percent: 25,
      reward_cents: 700,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 86400000).toISOString(),
      enabled: true,
    });
    expect(result.success).toBe(true);
  });
});
