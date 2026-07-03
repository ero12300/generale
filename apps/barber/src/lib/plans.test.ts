import { describe, expect, it } from "vitest";
import { canAddBooking, canAddClient, planAllows, PLANS } from "./plans";

describe("piani", () => {
  it("il piano Base costa meno del Pro", () => {
    expect(PLANS.base.priceMonthlyCents).toBeLessThan(
      PLANS.pro.priceMonthlyCents
    );
  });

  it("Base non include campagne né prenotazione online", () => {
    expect(planAllows("base", "campaigns")).toBe(false);
    expect(planAllows("base", "onlineBooking")).toBe(false);
  });

  it("Pro include tutto", () => {
    expect(planAllows("pro", "campaigns")).toBe(true);
    expect(planAllows("pro", "onlineBooking")).toBe(true);
    expect(planAllows("pro", "exportCsv")).toBe(true);
  });

  it("Base limita i clienti a 100", () => {
    expect(canAddClient("base", 99)).toBe(true);
    expect(canAddClient("base", 100)).toBe(false);
    expect(canAddClient("pro", 100000)).toBe(true);
  });

  it("Base limita le prenotazioni mensili a 150", () => {
    expect(canAddBooking("base", 149)).toBe(true);
    expect(canAddBooking("base", 150)).toBe(false);
    expect(canAddBooking("pro", 100000)).toBe(true);
  });
});
