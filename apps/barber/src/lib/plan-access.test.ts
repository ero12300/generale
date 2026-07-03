import { describe, it, expect } from "vitest";
import { hasFeature, isLimitReached } from "./plan-access";

describe("plan-access", () => {
  it("il piano free non ha il programma referral", () => {
    expect(hasFeature("free", "referralProgram")).toBe(false);
    expect(hasFeature("pro", "referralProgram")).toBe(true);
  });

  it("il piano free ha le analytics avanzate disabilitate", () => {
    expect(hasFeature("free", "advancedAnalytics")).toBe(false);
    expect(hasFeature("pro", "advancedAnalytics")).toBe(true);
  });

  it("rileva il limite clienti del piano free", () => {
    expect(isLimitReached("free", "maxClients", 60)).toBe(true);
    expect(isLimitReached("free", "maxClients", 10)).toBe(false);
  });

  it("il piano pro non raggiunge mai i limiti quantitativi", () => {
    expect(isLimitReached("pro", "maxClients", 100000)).toBe(false);
    expect(isLimitReached("pro", "maxCampaigns", 999)).toBe(false);
  });
});
