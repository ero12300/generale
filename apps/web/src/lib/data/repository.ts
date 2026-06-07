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

export interface DataRepository {
  readonly context: AuthContext;

  listDeals(): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | null>;
  createDeal(input: CreateDealInput): Promise<Deal>;
  updateDeal(id: string, patch: UpdateDealPatch): Promise<Deal | null>;
  getDealDetail(id: string): Promise<DealDetail | null>;

  getProperty(dealId: string): Promise<NormalizedProperty | null>;
  upsertProperty(dealId: string, data: Partial<NormalizedProperty>): Promise<NormalizedProperty>;
  confirmProperty(dealId: string): Promise<NormalizedProperty>;

  saveAnalysis(
    dealId: string,
    assumptions: Record<string, unknown>,
    result: AnalysisResult
  ): Promise<void>;
  getAnalysis(dealId: string): Promise<AnalysisResult | null>;

  listWorkItems(dealId: string): Promise<WorkItem[]>;
  setWorkItems(dealId: string, items: WorkItem[]): Promise<void>;

  saveOfferLetter(
    dealId: string,
    offeredPrice: number,
    commercialText: string,
    legalPlaceholders: Record<string, unknown>[]
  ): Promise<OfferLetter>;

  savePropertySnapshot(dealId: string, sourceUrl: string, content: Record<string, unknown>): Promise<void>;

  getFreedomSnapshot(): Promise<FreedomSnapshot>;
  saveFreedomSnapshot(input: Omit<FreedomSnapshot, "id" | "organization_id" | "coverage_ratio">): Promise<FreedomSnapshot>;

  listPropertyPrices(dealIds: string[]): Promise<Record<string, number | null>>;
}
