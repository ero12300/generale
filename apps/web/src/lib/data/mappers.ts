import type {
  AnalysisResult,
  Deal,
  DealStage,
  DealStrategy,
  FreedomSnapshot,
  NormalizedProperty,
  OfferLetter,
  PropertyStatus,
  WorkCategory,
  WorkItem,
  WorkStatus,
} from "@deal-desk/types";

type DealRow = {
  id: string;
  organization_id: string;
  title: string;
  stage: DealStage;
  strategy: DealStrategy;
  source_url: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type PropertyRow = {
  id: string;
  deal_id: string;
  organization_id: string;
  status: PropertyStatus;
  price_asked: number | string | null;
  surface_sqm: number | string | null;
  address: string | null;
  zone: string | null;
  city: string | null;
  province: string | null;
  property_type: string | null;
  condition: string | null;
  rooms: number | null;
  floor: string | null;
  energy_class: string | null;
  condo_fees_monthly: number | string | null;
  has_elevator: boolean | null;
  has_terrace: boolean | null;
  has_parking: boolean | null;
  description: string | null;
  media_urls: string[] | null;
  raw_fields: Record<string, unknown> | null;
  confirmed_at: string | null;
  confirmed_by: string | null;
};

type WorkItemRow = {
  id: string;
  deal_id: string;
  organization_id: string;
  room: string | null;
  category: WorkCategory;
  description: string;
  unit: string;
  quantity: number | string;
  unit_price: number | string;
  supplier: string | null;
  priority: number;
  status: WorkStatus;
  requires_permit: boolean;
};

type OfferRow = {
  id: string;
  deal_id: string;
  organization_id: string;
  version: number;
  offered_price: number | string;
  commercial_text: string;
  legal_placeholders: Record<string, unknown>[] | null;
  status: OfferLetter["status"];
  created_at: string;
};

type FreedomRow = {
  id: string;
  organization_id: string;
  snapshot_date: string;
  active_income: number | string;
  passive_income: number | string;
  fixed_expenses: number | string;
  liquidity: number | string;
  reserves: number | string;
  coverage_ratio: number | string;
};

function num(value: number | string | null | undefined): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : Number(value);
}

export function mapDeal(row: DealRow): Deal {
  return {
    id: row.id,
    organization_id: row.organization_id,
    title: row.title,
    stage: row.stage,
    strategy: row.strategy,
    source_url: row.source_url,
    assigned_to: row.assigned_to,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mapProperty(row: PropertyRow): NormalizedProperty {
  return {
    id: row.id,
    deal_id: row.deal_id,
    organization_id: row.organization_id,
    status: row.status,
    price_asked: row.price_asked != null ? num(row.price_asked) : null,
    surface_sqm: row.surface_sqm != null ? num(row.surface_sqm) : null,
    address: row.address,
    zone: row.zone,
    city: row.city,
    province: row.province,
    property_type: row.property_type,
    condition: row.condition,
    rooms: row.rooms,
    floor: row.floor,
    energy_class: row.energy_class,
    condo_fees_monthly: row.condo_fees_monthly != null ? num(row.condo_fees_monthly) : null,
    has_elevator: row.has_elevator,
    has_terrace: row.has_terrace,
    has_parking: row.has_parking,
    description: row.description,
    media_urls: row.media_urls ?? [],
    raw_fields: row.raw_fields ?? {},
    confirmed_at: row.confirmed_at,
    confirmed_by: row.confirmed_by,
  };
}

export function mapWorkItem(row: WorkItemRow): WorkItem {
  return {
    id: row.id,
    deal_id: row.deal_id,
    organization_id: row.organization_id,
    room: row.room,
    category: row.category,
    description: row.description,
    unit: row.unit,
    quantity: num(row.quantity),
    unit_price: num(row.unit_price),
    supplier: row.supplier,
    priority: row.priority,
    status: row.status,
    requires_permit: row.requires_permit,
  };
}

export function mapOfferLetter(row: OfferRow): OfferLetter {
  return {
    id: row.id,
    deal_id: row.deal_id,
    organization_id: row.organization_id,
    version: row.version,
    offered_price: num(row.offered_price),
    commercial_text: row.commercial_text,
    legal_placeholders: row.legal_placeholders ?? [],
    status: row.status,
    created_at: row.created_at,
  };
}

export function mapFreedomSnapshot(row: FreedomRow): FreedomSnapshot {
  return {
    id: row.id,
    organization_id: row.organization_id,
    snapshot_date: row.snapshot_date,
    active_income: num(row.active_income),
    passive_income: num(row.passive_income),
    fixed_expenses: num(row.fixed_expenses),
    liquidity: num(row.liquidity),
    reserves: num(row.reserves),
    coverage_ratio: num(row.coverage_ratio),
  };
}

export function parseAnalysisResult(value: unknown): AnalysisResult | null {
  if (!value || typeof value !== "object") return null;
  const obj = value as AnalysisResult;
  if (!obj.base_case || !obj.prudent_case || !obj.stress_case) return null;
  return obj;
}
