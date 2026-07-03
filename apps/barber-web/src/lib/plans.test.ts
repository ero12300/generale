import { describe, expect, it } from "vitest";
import { canUseFeature, getClientLimit } from "./plans";

describe("plan gates", () => {
  it("limits Basic clients and blocks Pro-only features", () => {
    expect(getClientLimit("basic")).toBe(150);
    expect(canUseFeature("basic", "referral")).toBe(false);
    expect(canUseFeature("basic", "advancedReports")).toBe(false);
  });

  it("unlocks Pro features", () => {
    expect(getClientLimit("pro")).toBe(Number.POSITIVE_INFINITY);
    expect(canUseFeature("pro", "referral")).toBe(true);
    expect(canUseFeature("pro", "automations")).toBe(true);
  });
});
