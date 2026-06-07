import type {
  AnalysisResult,
  AuthContext,
  CreateDealInput,
  Deal,
  DealDetail,
  FreedomSnapshot,
  NormalizedProperty,
  OfferLetter,
  UpdateDealPatch,
  WorkItem,
} from "@deal-desk/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mapDeal,
  mapFreedomSnapshot,
  mapOfferLetter,
  mapProperty,
  mapWorkItem,
  parseAnalysisResult,
} from "@/lib/data/mappers";
import type { DataRepository } from "@/lib/data/repository";

export class SupabaseRepository implements DataRepository {
  constructor(
    private readonly supabase: SupabaseClient,
    readonly context: AuthContext
  ) {}

  private orgId() {
    return this.context.organizationId;
  }

  private userId() {
    return this.context.userId;
  }

  async listDeals(): Promise<Deal[]> {
    const { data, error } = await this.supabase
      .from("deals")
      .select("*")
      .eq("organization_id", this.orgId())
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapDeal);
  }

  async getDeal(id: string): Promise<Deal | null> {
    const { data, error } = await this.supabase
      .from("deals")
      .select("*")
      .eq("id", id)
      .eq("organization_id", this.orgId())
      .maybeSingle();
    if (error) throw error;
    return data ? mapDeal(data) : null;
  }

  async createDeal(input: CreateDealInput): Promise<Deal> {
    const { data, error } = await this.supabase
      .from("deals")
      .insert({
        organization_id: this.orgId(),
        title: input.title,
        strategy: input.strategy ?? "fix_flip",
        stage: input.stage ?? "lead",
        source_url: input.source_url ?? null,
        notes: input.notes ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapDeal(data);
  }

  async updateDeal(id: string, patch: UpdateDealPatch): Promise<Deal | null> {
    const existing = await this.getDeal(id);
    if (!existing) return null;

    const { data, error } = await this.supabase
      .from("deals")
      .update(patch)
      .eq("id", id)
      .eq("organization_id", this.orgId())
      .select("*")
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;

    if (patch.stage && patch.stage !== existing.stage) {
      await this.supabase.from("deal_stage_history").insert({
        deal_id: id,
        from_stage: existing.stage,
        to_stage: patch.stage,
        changed_by: this.userId(),
      });
    }

    return mapDeal(data);
  }

  async getDealDetail(id: string): Promise<DealDetail | null> {
    const deal = await this.getDeal(id);
    if (!deal) return null;

    const [property, analysis, workItems, offerLetter] = await Promise.all([
      this.getProperty(id),
      this.getAnalysis(id),
      this.listWorkItems(id),
      this.getLatestOfferLetter(id),
    ]);

    return { deal, property, analysis, workItems, offerLetter };
  }

  async getProperty(dealId: string): Promise<NormalizedProperty | null> {
    const { data, error } = await this.supabase
      .from("normalized_properties")
      .select("*")
      .eq("deal_id", dealId)
      .eq("organization_id", this.orgId())
      .maybeSingle();
    if (error) throw error;
    return data ? mapProperty(data) : null;
  }

  async upsertProperty(dealId: string, data: Partial<NormalizedProperty>): Promise<NormalizedProperty> {
    const existing = await this.getProperty(dealId);
    const payload = {
      deal_id: dealId,
      organization_id: this.orgId(),
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

    const { data: row, error } = await this.supabase
      .from("normalized_properties")
      .upsert(payload, { onConflict: "deal_id" })
      .select("*")
      .single();
    if (error) throw error;
    return mapProperty(row);
  }

  async confirmProperty(dealId: string): Promise<NormalizedProperty> {
    return this.upsertProperty(dealId, {
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      confirmed_by: this.userId(),
    });
  }

  async saveAnalysis(
    dealId: string,
    assumptions: Record<string, unknown>,
    result: AnalysisResult
  ): Promise<void> {
    const { data: latest, error: versionError } = await this.supabase
      .from("analysis_runs")
      .select("version")
      .eq("deal_id", dealId)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (versionError) throw versionError;

    const nextVersion = (latest?.version ?? 0) + 1;
    const { error } = await this.supabase.from("analysis_runs").insert({
      deal_id: dealId,
      organization_id: this.orgId(),
      assumptions,
      results: result,
      version: nextVersion,
      created_by: this.userId(),
    });
    if (error) throw error;
  }

  async getAnalysis(dealId: string): Promise<AnalysisResult | null> {
    const { data, error } = await this.supabase
      .from("analysis_runs")
      .select("results")
      .eq("deal_id", dealId)
      .eq("organization_id", this.orgId())
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return parseAnalysisResult(data?.results);
  }

  async listWorkItems(dealId: string): Promise<WorkItem[]> {
    const { data, error } = await this.supabase
      .from("work_items")
      .select("*")
      .eq("deal_id", dealId)
      .eq("organization_id", this.orgId())
      .order("priority", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapWorkItem);
  }

  async setWorkItems(dealId: string, items: WorkItem[]): Promise<void> {
    const { error: deleteError } = await this.supabase
      .from("work_items")
      .delete()
      .eq("deal_id", dealId)
      .eq("organization_id", this.orgId());
    if (deleteError) throw deleteError;

    if (items.length === 0) return;

    const rows = items.map((item) => ({
      deal_id: dealId,
      organization_id: this.orgId(),
      room: item.room,
      category: item.category,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unit_price: item.unit_price,
      supplier: item.supplier,
      priority: item.priority,
      status: item.status,
      requires_permit: item.requires_permit,
    }));

    const { error } = await this.supabase.from("work_items").insert(rows);
    if (error) throw error;
  }

  private async getLatestOfferLetter(dealId: string): Promise<OfferLetter | null> {
    const { data, error } = await this.supabase
      .from("offer_letters")
      .select("*")
      .eq("deal_id", dealId)
      .eq("organization_id", this.orgId())
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapOfferLetter(data) : null;
  }

  async saveOfferLetter(
    dealId: string,
    offeredPrice: number,
    commercialText: string,
    legalPlaceholders: Record<string, unknown>[]
  ): Promise<OfferLetter> {
    const latest = await this.getLatestOfferLetter(dealId);
    const nextVersion = (latest?.version ?? 0) + 1;

    const { data, error } = await this.supabase
      .from("offer_letters")
      .insert({
        deal_id: dealId,
        organization_id: this.orgId(),
        version: nextVersion,
        offered_price: offeredPrice,
        commercial_text: commercialText,
        legal_placeholders: legalPlaceholders,
        status: "draft",
        created_by: this.userId(),
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapOfferLetter(data);
  }

  async savePropertySnapshot(
    dealId: string,
    sourceUrl: string,
    content: Record<string, unknown>
  ): Promise<void> {
    const { error } = await this.supabase.from("property_snapshots").insert({
      deal_id: dealId,
      organization_id: this.orgId(),
      source_url: sourceUrl,
      snapshot_type: "json",
      content,
    });
    if (error) throw error;
  }

  async getFreedomSnapshot(): Promise<FreedomSnapshot> {
    const { data, error } = await this.supabase
      .from("freedom_snapshots")
      .select("*")
      .eq("organization_id", this.orgId())
      .order("snapshot_date", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;

    if (data) return mapFreedomSnapshot(data);

    const deals = await this.listDeals();
    const passive = deals.filter((d) => d.stage === "rental").length * 1200 * 12;
    const fixed = 48000;
    return {
      id: "computed",
      organization_id: this.orgId(),
      snapshot_date: new Date().toISOString().split("T")[0],
      active_income: 0,
      passive_income: passive,
      fixed_expenses: fixed,
      liquidity: 85000,
      reserves: 25000,
      coverage_ratio: fixed > 0 ? passive / fixed : 0,
    };
  }

  async saveFreedomSnapshot(
    input: Omit<FreedomSnapshot, "id" | "organization_id" | "coverage_ratio">
  ): Promise<FreedomSnapshot> {
    const coverage =
      input.fixed_expenses > 0 ? input.passive_income / input.fixed_expenses : 0;

    const { data, error } = await this.supabase
      .from("freedom_snapshots")
      .insert({
        organization_id: this.orgId(),
        snapshot_date: input.snapshot_date,
        active_income: input.active_income,
        passive_income: input.passive_income,
        fixed_expenses: input.fixed_expenses,
        liquidity: input.liquidity,
        reserves: input.reserves,
        coverage_ratio: coverage,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapFreedomSnapshot(data);
  }

  async listPropertyPrices(dealIds: string[]): Promise<Record<string, number | null>> {
    if (dealIds.length === 0) return {};
    const { data, error } = await this.supabase
      .from("normalized_properties")
      .select("deal_id, price_asked")
      .eq("organization_id", this.orgId())
      .in("deal_id", dealIds);
    if (error) throw error;

    const prices: Record<string, number | null> = {};
    for (const id of dealIds) prices[id] = null;
    for (const row of data ?? []) {
      prices[row.deal_id] = row.price_asked != null ? Number(row.price_asked) : null;
    }
    return prices;
  }
}
