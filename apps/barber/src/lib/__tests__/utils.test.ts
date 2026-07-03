import { describe, it, expect } from "vitest";
import { formatCurrency, formatShortCurrency, initials, slugify, generateId } from "@/lib/utils";

describe("utils", () => {
  it("formatCurrency formats EUR", () => {
    expect(formatCurrency(25).replace(/\s/g, " ")).toMatch(/25,00\s?€/);
  });

  it("formatShortCurrency abbreviates thousands", () => {
    expect(formatShortCurrency(1500)).toBe("€1.5k");
    expect(formatShortCurrency(150)).toBe("€150");
  });

  it("initials picks first letters", () => {
    expect(initials("Marco Rossi")).toBe("MR");
    expect(initials("Antonio Di Maria")).toBe("AD");
    expect(initials("Luca")).toBe("L");
  });

  it("slugify normalizes strings", () => {
    expect(slugify("Filò Barber Studio")).toBe("filo-barber-studio");
    expect(slugify("Rasura & Co.")).toBe("rasura-co");
  });

  it("generateId returns unique-ish ids with prefix", () => {
    const a = generateId("bkg");
    const b = generateId("bkg");
    expect(a).not.toBe(b);
    expect(a.startsWith("bkg_")).toBe(true);
  });
});
