import { describe, expect, it } from "vitest";
import { doorConfigSchema } from "./door";

describe("doorConfigSchema", () => {
  it("accepts a production-ready door configuration in millimeters", () => {
    const parsed = doorConfigSchema.parse({
      roughOpening: { widthMm: 900, heightMm: 2100, wallThicknessMm: 120 },
      model: "hinged",
      hingeSide: "right",
      swing: "in",
      options: {
        hasDisplay: true,
        hasOvalWindow: false,
        fixedPanel: "auto",
      },
    });

    expect(parsed.roughOpening.widthMm).toBe(900);
  });

  it("rejects unsafe openings and incompatible fixed-panel choices", () => {
    const parsed = doorConfigSchema.safeParse({
      roughOpening: { widthMm: 420, heightMm: 1600, wallThicknessMm: 45 },
      model: "fixed",
      hingeSide: "left",
      swing: "out",
      options: {
        hasDisplay: true,
        hasOvalWindow: true,
        fixedPanel: "none",
      },
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path.join("."))).toContain(
        "roughOpening.widthMm"
      );
      expect(parsed.error.issues.map((issue) => issue.path.join("."))).toContain(
        "options.fixedPanel"
      );
    }
  });
});
