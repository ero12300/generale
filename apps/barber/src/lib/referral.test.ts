import { describe, expect, it } from "vitest";
import { generateReferralCode, isValidReferralCode } from "./referral";

describe("codici Porta un Amico", () => {
  it("genera un codice nel formato XXXX-YYYY", () => {
    const code = generateReferralCode("Mario Rossi", 42);
    expect(code).toMatch(/^[A-Z]{4}-[A-HJ-NP-Z2-9]{4}$/);
    expect(code.startsWith("MARI-")).toBe(true);
  });

  it("gestisce nomi corti e accentati", () => {
    expect(generateReferralCode("Lu", 1)).toMatch(/^LUXX-/);
    expect(generateReferralCode("Nicolò È", 1)).toMatch(/^NICO-/);
  });

  it("è deterministico con lo stesso seed", () => {
    expect(generateReferralCode("Mario Rossi", 7)).toBe(
      generateReferralCode("Mario Rossi", 7)
    );
  });

  it("valida i codici", () => {
    expect(isValidReferralCode(generateReferralCode("Mario Rossi"))).toBe(true);
    expect(isValidReferralCode("banana")).toBe(false);
    expect(isValidReferralCode("MARI-0OI1")).toBe(false); // caratteri ambigui vietati
  });
});
