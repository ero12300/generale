import { describe, expect, it } from "vitest";
import { referralCreateSchema, ticketCreateSchema } from "./validation";

describe("ticketCreateSchema", () => {
  const valid = {
    equipmentId: "eq-1",
    title: "Vetrina non raffredda",
    description: "La vetrina segna -8 invece di -14 da stamattina.",
    urgency: "alta",
    machineDown: false,
    openedBy: "Marco",
  };

  it("accetta input valido", () => {
    expect(ticketCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rifiuta descrizione troppo corta", () => {
    const result = ticketCreateSchema.safeParse({ ...valid, description: "corta" });
    expect(result.success).toBe(false);
  });

  it("rifiuta urgenza sconosciuta", () => {
    const result = ticketCreateSchema.safeParse({ ...valid, urgency: "subito" });
    expect(result.success).toBe(false);
  });

  it("machineDown default false", () => {
    const rest: Partial<typeof valid> = { ...valid };
    delete rest.machineDown;
    const result = ticketCreateSchema.parse(rest);
    expect(result.machineDown).toBe(false);
  });
});

describe("referralCreateSchema", () => {
  const valid = {
    partnerName: "Studio Rossi",
    partnerType: "Commercialista",
    referredCompany: "Bar Centrale",
    referredContact: "Sig. Bianchi",
    city: "Messina",
    consent: true,
  };

  it("accetta input valido", () => {
    expect(referralCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("rifiuta senza consenso", () => {
    expect(referralCreateSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});
