import { describe, it, expect } from "vitest";
import { ClientSchema, BookingSchema, CampaignSchema, TIER_LIMITS } from "@/types";

describe("schemas", () => {
  it("ClientSchema validates minimal fields", () => {
    const parsed = ClientSchema.parse({
      id: "c1",
      organizationId: "o1",
      fullName: "Mario Rossi",
      createdAt: new Date().toISOString(),
    });
    expect(parsed.tags).toEqual([]);
    expect(parsed.totalVisits).toBe(0);
    expect(parsed.totalSpent).toBe(0);
  });

  it("BookingSchema requires ISO datetimes and status default", () => {
    const parsed = BookingSchema.parse({
      id: "b1",
      organizationId: "o1",
      clientName: "Mario",
      serviceId: "s1",
      serviceName: "Taglio",
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      price: 25,
      createdAt: new Date().toISOString(),
    });
    expect(parsed.status).toBe("confirmed");
    expect(parsed.source).toBe("internal");
  });

  it("CampaignSchema validates code + kind", () => {
    const parsed = CampaignSchema.parse({
      id: "cmp1",
      organizationId: "o1",
      name: "Test",
      kind: "referral",
      code: "AMICO5",
      createdAt: new Date().toISOString(),
    });
    expect(parsed.discountPercent).toBe(0);
    expect(parsed.active).toBe(true);
  });

  it("TIER_LIMITS ordered pricing", () => {
    expect(TIER_LIMITS.free.priceMonthly).toBe(0);
    expect(TIER_LIMITS.pro.priceMonthly).toBeGreaterThan(0);
    expect(TIER_LIMITS.elite.priceMonthly).toBeGreaterThan(TIER_LIMITS.pro.priceMonthly);
    expect(TIER_LIMITS.pro.highlight).toBe(true);
  });
});
