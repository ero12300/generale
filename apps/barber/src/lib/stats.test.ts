import { describe, expect, it } from "vitest";
import { summarizeRevenue } from "./stats";
import type { Sale } from "./types";

function sale(date: string, amountCents: number, overrides?: Partial<Sale>): Sale {
  return {
    id: `s_${date}_${amountCents}`,
    shopId: "shop",
    description: "Taglio",
    amountCents,
    discountCents: 0,
    method: "carta",
    date,
    createdAt: `${date}T10:00:00.000Z`,
    ...overrides,
  };
}

describe("summarizeRevenue", () => {
  const now = new Date("2026-07-15T12:00:00Z");

  it("calcola oggi, settimana e mese", () => {
    const sales = [
      sale("2026-07-15", 2500), // oggi
      sale("2026-07-12", 3500), // in settimana
      sale("2026-07-01", 1800), // nel mese ma fuori settimana
      sale("2026-06-30", 9900), // mese scorso
    ];
    const s = summarizeRevenue(sales, now);
    expect(s.todayCents).toBe(2500);
    expect(s.weekCents).toBe(6000);
    expect(s.monthCents).toBe(7800);
    expect(s.salesCountMonth).toBe(3);
    expect(s.averageTicketCents).toBe(2600);
  });

  it("somma sconti e divide per metodo di pagamento", () => {
    const sales = [
      sale("2026-07-15", 2000, { discountCents: 500, method: "contanti" }),
      sale("2026-07-14", 3000, { method: "carta" }),
    ];
    const s = summarizeRevenue(sales, now);
    expect(s.totalDiscountMonthCents).toBe(500);
    expect(s.byMethod["contanti"]).toBe(2000);
    expect(s.byMethod["carta"]).toBe(3000);
  });

  it("produce 7 giorni ordinati", () => {
    const s = summarizeRevenue([], now);
    expect(s.last7Days).toHaveLength(7);
    expect(s.last7Days[6].date).toBe("2026-07-15");
    expect(s.last7Days[0].date).toBe("2026-07-09");
  });

  it("gestisce zero vendite senza dividere per zero", () => {
    const s = summarizeRevenue([], now);
    expect(s.averageTicketCents).toBe(0);
    expect(s.monthCents).toBe(0);
  });
});
