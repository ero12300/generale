import { describe, expect, it } from "vitest";
import { PLANS, planHasCapability } from "./plans";

describe("piani abbonamento", () => {
  it("il piano Base copre le funzioni essenziali", () => {
    expect(planHasCapability("base", "prenotazioni")).toBe(true);
    expect(planHasCapability("base", "incassi")).toBe(true);
    expect(planHasCapability("base", "clienti")).toBe(true);
  });

  it("campagne e referral richiedono il piano Pro", () => {
    expect(planHasCapability("base", "campagne")).toBe(false);
    expect(planHasCapability("base", "referral")).toBe(false);
    expect(planHasCapability("base", "report_avanzati")).toBe(false);
    expect(planHasCapability("pro", "campagne")).toBe(true);
    expect(planHasCapability("pro", "referral")).toBe(true);
    expect(planHasCapability("pro", "report_avanzati")).toBe(true);
  });

  it("il piano Pro costa più del Base", () => {
    expect(PLANS.pro.priceMonthlyCents).toBeGreaterThan(
      PLANS.base.priceMonthlyCents,
    );
  });
});
