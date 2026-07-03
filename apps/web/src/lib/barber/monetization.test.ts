import { describe, expect, it } from "vitest";
import { canCreateCampaign, getPlanById } from "@/lib/barber/monetization";

describe("barber monetization", () => {
  it("recupera piano pro", () => {
    expect(getPlanById("pro").monthly_price_cents).toBeGreaterThan(0);
  });

  it("limita campagne nel piano base", () => {
    expect(canCreateCampaign("base", 0)).toBe(true);
    expect(canCreateCampaign("base", 1)).toBe(false);
    expect(canCreateCampaign("pro", 10)).toBe(true);
  });
});
