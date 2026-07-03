import { describe, expect, it } from "vitest";
import {
  createBarberBookingSchema,
  createBarberCampaignSchema,
  createBarberClientSchema,
} from "@/lib/validations/barber";

describe("createBarberClientSchema", () => {
  it("accetta cliente valido", () => {
    const parsed = createBarberClientSchema.safeParse({
      full_name: "Mario Verdi",
      phone: "+39 333 1234567",
    });
    expect(parsed.success).toBe(true);
  });

  it("rifiuta nome troppo corto", () => {
    const parsed = createBarberClientSchema.safeParse({
      full_name: "A",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("createBarberBookingSchema", () => {
  it("accetta prenotazione valida", () => {
    const parsed = createBarberBookingSchema.safeParse({
      client_id: "client-1",
      service_id: "service-1",
      starts_at: "2026-07-03T10:00:00.000Z",
      ends_at: "2026-07-03T10:45:00.000Z",
      price_amount: 30,
      deposit_amount: 10,
    });
    expect(parsed.success).toBe(true);
  });

  it("rifiuta fine precedente all'inizio", () => {
    const parsed = createBarberBookingSchema.safeParse({
      client_id: "client-1",
      service_id: "service-1",
      starts_at: "2026-07-03T11:00:00.000Z",
      ends_at: "2026-07-03T10:45:00.000Z",
      price_amount: 30,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("createBarberCampaignSchema", () => {
  it("accetta campagna valida", () => {
    const parsed = createBarberCampaignSchema.safeParse({
      name: "Porta un amico estate",
      channel: "whatsapp",
      discount_type: "percent",
      discount_value: 20,
      starts_at: "2026-07-03",
      ends_at: "2026-07-20",
      audience: "clienti_attivi_30gg",
    });
    expect(parsed.success).toBe(true);
  });
});
