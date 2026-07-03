import { describe, expect, it } from "vitest";
import { createBarberAppointmentSchema } from "@/lib/validations/barber";

describe("createBarberAppointmentSchema", () => {
  it("accetta una prenotazione valida", () => {
    const result = createBarberAppointmentSchema.safeParse({
      client_name: "Mario Rossi",
      phone: "+39 333 123 4567",
      email: "mario@example.com",
      service_ids: ["svc_signature_cut"],
      barber_name: "Marco",
      starts_at: new Date().toISOString(),
      channel: "app",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta una prenotazione senza servizi", () => {
    const result = createBarberAppointmentSchema.safeParse({
      client_name: "Mario Rossi",
      phone: "+39 333 123 4567",
      service_ids: [],
      barber_name: "Marco",
      starts_at: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });
});
