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
import { demoStore } from "@/lib/demo-store";
import type { DataRepository } from "./repository";

const offerLetters: Record<string, OfferLetter> = {};

export class DemoRepository implements DataRepository {
  readonly context: AuthContext = {
    mode: "demo",
    userId: null,
    email: null,
    organizationId: demoStore.orgId,
    organizationName: demoStore.orgName,
  };

  async listDeals(): Promise<Deal[]> {
    return demoStore.listDeals();
  }

  async getDeal(id: string): Promise<Deal | null> {
    return demoStore.getDeal(id) ?? null;
  }

  async createDeal(input: CreateDealInput): Promise<Deal> {
    return demoStore.createDeal(input);
  }

  async updateDeal(id: string, patch: UpdateDealPatch): Promise<Deal | null> {
    return demoStore.updateDeal(id, patch) ?? null;
  }

  async getDealDetail(id: string): Promise<DealDetail | null> {
    const deal = demoStore.getDeal(id);
    if (!deal) return null;
    return {
      deal,
      property: demoStore.getProperty(id) ?? null,
      analysis: demoStore.getAnalysis(id) ?? null,
      workItems: demoStore.listWorkItems(id),
      offerLetter: offerLetters[id] ?? null,
    };
  }

  async getProperty(dealId: string): Promise<NormalizedProperty | null> {
    return demoStore.getProperty(dealId) ?? null;
  }

  async upsertProperty(dealId: string, data: Partial<NormalizedProperty>): Promise<NormalizedProperty> {
    return demoStore.upsertProperty(dealId, data);
  }

  async confirmProperty(dealId: string): Promise<NormalizedProperty> {
    return demoStore.upsertProperty(dealId, {
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      confirmed_by: null,
    });
  }

  async saveAnalysis(
    dealId: string,
    _assumptions: Record<string, unknown>,
    result: AnalysisResult
  ): Promise<void> {
    demoStore.saveAnalysis(dealId, result);
  }

  async getAnalysis(dealId: string): Promise<AnalysisResult | null> {
    return demoStore.getAnalysis(dealId) ?? null;
  }

  async listWorkItems(dealId: string): Promise<WorkItem[]> {
    return demoStore.listWorkItems(dealId);
  }

  async setWorkItems(dealId: string, items: WorkItem[]): Promise<void> {
    demoStore.setWorkItems(dealId, items);
  }

  async saveOfferLetter(
    dealId: string,
    offeredPrice: number,
    commercialText: string,
    legalPlaceholders: Record<string, unknown>[]
  ): Promise<OfferLetter> {
    const existing = offerLetters[dealId];
    const letter: OfferLetter = {
      id: existing?.id ?? `offer-${dealId}`,
      deal_id: dealId,
      organization_id: demoStore.orgId,
      version: (existing?.version ?? 0) + 1,
      offered_price: offeredPrice,
      commercial_text: commercialText,
      legal_placeholders: legalPlaceholders,
      status: "draft",
      created_at: new Date().toISOString(),
    };
    offerLetters[dealId] = letter;
    return letter;
  }

  async savePropertySnapshot(
    dealId: string,
    sourceUrl: string,
    content: Record<string, unknown>
  ): Promise<void> {
    void dealId;
    void sourceUrl;
    void content;
  }

  async getFreedomSnapshot(): Promise<FreedomSnapshot> {
    return demoStore.getFreedomSnapshot();
  }

  async saveFreedomSnapshot(
    input: Omit<FreedomSnapshot, "id" | "organization_id" | "coverage_ratio">
  ): Promise<FreedomSnapshot> {
    const coverage =
      input.fixed_expenses > 0 ? input.passive_income / input.fixed_expenses : 0;
    return {
      id: "freedom-001",
      organization_id: demoStore.orgId,
      coverage_ratio: coverage,
      ...input,
    };
  }

  async listPropertyPrices(dealIds: string[]): Promise<Record<string, number | null>> {
    const prices: Record<string, number | null> = {};
    for (const id of dealIds) {
      prices[id] = demoStore.getProperty(id)?.price_asked ?? null;
    }
    return prices;
  }
}
