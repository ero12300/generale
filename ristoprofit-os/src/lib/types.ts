/**
 * Tipi condivisi RistoProfit OS.
 * Tutti gli importi monetari sono espressi in centesimi (interi),
 * mai in float, per evitare errori di arrotondamento.
 */

export type Role =
  | "super_admin"
  | "admin_emotive"
  | "operator_emotive"
  | "sales_agent"
  | "customer_owner"
  | "customer_manager"
  | "customer_staff"
  | "referral_partner";

export type PlanId = "start" | "pro" | "premium" | "enterprise";

export interface Plan {
  id: PlanId;
  name: string;
  monthlyCents: number | null; // null = su preventivo
  setupCents: number | null;
  target: string;
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
}

export type Unit = "kg" | "g" | "l" | "ml" | "pz";

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  /** prezzo per unità base (kg, l o pz) in centesimi */
  priceCents: number;
  /** prezzo precedente, per calcolare la variazione */
  previousPriceCents: number;
  supplierId: string;
  stockQty: number;
  minStockQty: number;
}

export interface RecipeItem {
  ingredientId: string;
  /** quantità in g, ml o pz a seconda dell'unità dell'ingrediente */
  quantity: number;
  /** percentuale di scarto (0-100) */
  wastePct: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  items: RecipeItem[];
  packagingCents: number;
  /** prezzo di vendita IVA inclusa, in centesimi */
  salePriceCents: number;
  vatPct: number;
  portions: number;
  /** vendite ultimi 30 giorni */
  soldLast30: number;
}

export interface Supplier {
  id: string;
  name: string;
  city: string;
}

export interface SupplierInvoice {
  id: string;
  supplierId: string;
  date: string;
  totalCents: number;
  status: "caricata" | "verificata" | "da_verificare";
  items: { ingredientId: string; quantity: number; unitPriceCents: number }[];
}

export interface StaffShift {
  staffId: string;
  name: string;
  role: string;
  hours: number;
  hourlyCostCents: number;
}

export interface DailySales {
  date: string;
  revenueCents: number;
  covers: number;
}

export interface SalesAgent {
  id: string;
  name: string;
  level: "base" | "senior";
  activeClients: number;
  mrrCents: number;
  setupSoldCents: number;
  demosDone: number;
  commissionsAccruedCents: number;
  commissionsPaidCents: number;
}

export type LeadStatus =
  | "Nuovo"
  | "Contattato"
  | "Demo fissata"
  | "Preventivo inviato"
  | "In trattativa"
  | "Chiuso vinto"
  | "Chiuso perso"
  | "Non valido"
  | "Già presente"
  | "Premio maturato"
  | "Premio pagato";

export interface ReferralLead {
  id: string;
  partnerId: string;
  customerName: string;
  city: string;
  phone: string;
  createdAt: string;
  status: LeadStatus;
  plan?: PlanId;
  rewardCents?: number;
  rewardPaid?: boolean;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  city: string;
  plan: PlanId;
  status: "attivo" | "in_prova" | "scaduto" | "setup";
  mrrCents: number;
  agentId?: string;
}
