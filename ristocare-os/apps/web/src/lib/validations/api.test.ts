import { describe, expect, it } from "vitest";
import { createTicketSchema } from "./api";

describe("createTicketSchema", () => {
  it("accetta ticket valido", () => {
    const result = createTicketSchema.safeParse({
      title: "Frigo non raffredda",
      description: "La temperatura interna è salita sopra i 10 gradi da ieri sera.",
      urgency: "high",
      equipment_id: "eq-001",
    });
    expect(result.success).toBe(true);
  });

  it("rifiuta descrizione troppo corta", () => {
    const result = createTicketSchema.safeParse({
      title: "Guasto",
      description: "rotto",
      urgency: "low",
    });
    expect(result.success).toBe(false);
  });
});
