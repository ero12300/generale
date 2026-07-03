import type {
  AnalysisResult,
  Deal,
  FreedomSnapshot,
  NormalizedProperty,
  WorkItem,
} from "@deal-desk/types";

const DEMO_ORG_ID = "demo-org-001";

let deals: Deal[] = [
  {
    id: "deal-001",
    organization_id: DEMO_ORG_ID,
    title: "Trilocale Porta Romana — Milano",
    stage: "analysis",
    strategy: "fix_flip",
    source_url: "https://example.com/annuncio/1",
    assigned_to: null,
    notes: "Opportunità da valutare con sopralluogo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "deal-002",
    organization_id: DEMO_ORG_ID,
    title: "Bilocale Navigli — Milano",
    stage: "lead",
    strategy: "buy_renovate_rent",
    source_url: null,
    assigned_to: null,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const properties: Record<string, NormalizedProperty> = {
  "deal-001": {
    id: "prop-001",
    deal_id: "deal-001",
    organization_id: DEMO_ORG_ID,
    status: "draft",
    price_asked: 285000,
    surface_sqm: 78,
    address: "Via Friuli 12",
    zone: "Porta Romana",
    city: "Milano",
    province: "MI",
    property_type: "appartamento",
    condition: "da_ristrutturare",
    rooms: 3,
    floor: "3",
    energy_class: "G",
    condo_fees_monthly: 180,
    has_elevator: true,
    has_terrace: false,
    has_parking: false,
    description: "Trilocale da ristrutturare in zona servita.",
    media_urls: [],
    raw_fields: {},
    confirmed_at: null,
    confirmed_by: null,
  },
};

const workItems: Record<string, WorkItem[]> = {};
const analyses: Record<string, AnalysisResult> = {};

export const demoStore = {
  orgId: DEMO_ORG_ID,
  orgName: "Royal Fade Club",

  listDeals(): Deal[] {
    return [...deals].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },

  getDeal(id: string): Deal | undefined {
    return deals.find((d) => d.id === id);
  },

  createDeal(input: Partial<Deal> & { title: string }): Deal {
    const deal: Deal = {
      id: `deal-${Date.now()}`,
      organization_id: DEMO_ORG_ID,
      title: input.title,
      stage: input.stage ?? "lead",
      strategy: input.strategy ?? "fix_flip",
      source_url: input.source_url ?? null,
      assigned_to: null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    deals = [deal, ...deals];
    return deal;
  },

  updateDeal(id: string, patch: Partial<Deal>): Deal | undefined {
    const idx = deals.findIndex((d) => d.id === id);
    if (idx === -1) return undefined;
    deals[idx] = { ...deals[idx], ...patch, updated_at: new Date().toISOString() };
    return deals[idx];
  },

  getProperty(dealId: string): NormalizedProperty | undefined {
    return properties[dealId];
  },

  upsertProperty(dealId: string, data: Partial<NormalizedProperty>): NormalizedProperty {
    const existing = properties[dealId];
    const prop: NormalizedProperty = {
      id: existing?.id ?? `prop-${Date.now()}`,
      deal_id: dealId,
      organization_id: DEMO_ORG_ID,
      status: data.status ?? existing?.status ?? "draft",
      price_asked: data.price_asked ?? existing?.price_asked ?? null,
      surface_sqm: data.surface_sqm ?? existing?.surface_sqm ?? null,
      address: data.address ?? existing?.address ?? null,
      zone: data.zone ?? existing?.zone ?? null,
      city: data.city ?? existing?.city ?? null,
      province: data.province ?? existing?.province ?? null,
      property_type: data.property_type ?? existing?.property_type ?? null,
      condition: data.condition ?? existing?.condition ?? null,
      rooms: data.rooms ?? existing?.rooms ?? null,
      floor: data.floor ?? existing?.floor ?? null,
      energy_class: data.energy_class ?? existing?.energy_class ?? null,
      condo_fees_monthly: data.condo_fees_monthly ?? existing?.condo_fees_monthly ?? null,
      has_elevator: data.has_elevator ?? existing?.has_elevator ?? null,
      has_terrace: data.has_terrace ?? existing?.has_terrace ?? null,
      has_parking: data.has_parking ?? existing?.has_parking ?? null,
      description: data.description ?? existing?.description ?? null,
      media_urls: data.media_urls ?? existing?.media_urls ?? [],
      raw_fields: data.raw_fields ?? existing?.raw_fields ?? {},
      confirmed_at: data.confirmed_at ?? existing?.confirmed_at ?? null,
      confirmed_by: data.confirmed_by ?? existing?.confirmed_by ?? null,
    };
    properties[dealId] = prop;
    return prop;
  },

  saveAnalysis(dealId: string, result: AnalysisResult) {
    analyses[dealId] = result;
  },

  getAnalysis(dealId: string): AnalysisResult | undefined {
    return analyses[dealId];
  },

  listWorkItems(dealId: string): WorkItem[] {
    return workItems[dealId] ?? [];
  },

  setWorkItems(dealId: string, items: WorkItem[]) {
    workItems[dealId] = items;
  },

  getFreedomSnapshot(): FreedomSnapshot {
    const passive = deals
      .filter((d) => d.stage === "rental")
      .length * 1200 * 12;
    const fixed = 48000;
    return {
      id: "freedom-001",
      organization_id: DEMO_ORG_ID,
      snapshot_date: new Date().toISOString().split("T")[0],
      active_income: 0,
      passive_income: passive,
      fixed_expenses: fixed,
      liquidity: 85000,
      reserves: 25000,
      coverage_ratio: fixed > 0 ? passive / fixed : 0,
    };
  },
};
