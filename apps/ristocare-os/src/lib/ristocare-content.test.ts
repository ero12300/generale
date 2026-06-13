import { describe, expect, it } from "vitest";
import {
  commercialPlans,
  productHighlights,
  ticketStatuses,
  userRoles,
} from "./ristocare-content";

describe("RistoCare OS content model", () => {
  it("keeps the four commercial plans from the strategy document", () => {
    expect(commercialPlans.map((plan) => plan.name)).toEqual([
      "RistoCare Start",
      "RistoCare Pro",
      "RistoCare Premium",
      "RistoCare Enterprise",
    ]);
  });

  it("tracks the operational ticket lifecycle end to end", () => {
    expect(ticketStatuses.at(0)).toBe("Nuovo");
    expect(ticketStatuses).toContain("Preventivo inviato al cliente");
    expect(ticketStatuses).toContain("In attesa ricambio");
    expect(ticketStatuses.at(-1)).toBe("Annullato");
  });

  it("includes every MVP portal audience described in the document", () => {
    expect(userRoles).toEqual([
      "Super Admin RistoCare",
      "Operatore RistoCare",
      "Admin Cliente",
      "Dipendente Cliente",
      "Tecnico Partner",
      "Referral Partner",
    ]);
  });

  it("positions the product around QR, tickets, documents, and preventive maintenance", () => {
    expect(productHighlights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "QR code per ogni attrezzatura" }),
        expect.objectContaining({ title: "Ticket tecnico centralizzato" }),
        expect.objectContaining({ title: "Archivio documenti e garanzie" }),
        expect.objectContaining({ title: "Manutenzione preventiva" }),
      ]),
    );
  });
});
