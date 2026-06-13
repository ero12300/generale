import { describe, expect, it } from "vitest";
import { warrantyStatus } from "./warranty";

const NOW = new Date("2026-06-12T12:00:00Z");

describe("warrantyStatus", () => {
  it("attiva se mancano più di 90 giorni", () => {
    expect(warrantyStatus("2027-01-01", NOW)).toBe("attiva");
  });

  it("in scadenza se mancano meno di 90 giorni", () => {
    expect(warrantyStatus("2026-07-01", NOW)).toBe("in_scadenza");
  });

  it("scaduta se la data è passata", () => {
    expect(warrantyStatus("2026-06-01", NOW)).toBe("scaduta");
  });
});
