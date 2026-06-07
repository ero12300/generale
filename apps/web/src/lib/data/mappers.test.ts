import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { mapDeal, mapProperty, parseAnalysisResult } from "@/lib/data/mappers";

describe("data mappers", () => {
  it("mapDeal converte i campi base", () => {
    const deal = mapDeal({
      id: "1",
      organization_id: "org",
      title: "Test",
      stage: "lead",
      strategy: "fix_flip",
      source_url: null,
      assigned_to: null,
      notes: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    });
    expect(deal.title).toBe("Test");
  });

  it("mapProperty converte numerici stringa", () => {
    const property = mapProperty({
      id: "p1",
      deal_id: "d1",
      organization_id: "org",
      status: "draft",
      price_asked: "285000.00",
      surface_sqm: "78",
      address: null,
      zone: null,
      city: "Milano",
      province: null,
      property_type: null,
      condition: null,
      rooms: 3,
      floor: null,
      energy_class: null,
      condo_fees_monthly: null,
      has_elevator: null,
      has_terrace: null,
      has_parking: null,
      description: null,
      media_urls: [],
      raw_fields: {},
      confirmed_at: null,
      confirmed_by: null,
    });
    expect(property.price_asked).toBe(285000);
    expect(property.surface_sqm).toBe(78);
  });

  it("parseAnalysisResult valida la struttura", () => {
    const valid = parseAnalysisResult({
      base_case: { sensitivity_signal: "green" },
      prudent_case: { sensitivity_signal: "amber" },
      stress_case: { sensitivity_signal: "red" },
      sensitivity_summary: "ok",
    });
    expect(valid?.sensitivity_summary).toBe("ok");
    expect(parseAnalysisResult({ foo: "bar" })).toBeNull();
  });
});

describe("RLS migration", () => {
  it("abilita RLS sulle tabelle business", () => {
    const sql = readFileSync(
      resolve(__dirname, "../../../../../supabase/migrations/20250605000000_initial_schema.sql"),
      "utf8"
    );
    expect(sql).toContain("ENABLE ROW LEVEL SECURITY");
    expect(sql).toContain("CREATE POLICY deals_all ON deals");
    expect(sql).toContain("user_organization_ids()");
  });
});
