/**
 * Tipi di dominio condivisi di RistoProfit OS.
 *
 * Multi-tenant: ogni entità di business è collegata a una `organizationId`.
 * In produzione questi tipi corrispondono alle tabelle Postgres su Supabase con
 * Row Level Security per garantire l'isolamento dei dati tra clienti.
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
  /** Canone mensile in centesimi (null = su preventivo). */
  monthlyCents: number | null;
  /** Setup iniziale in centesimi. */
  setupCents: number;
  /** Etichetta prezzo da mostrare quando il prezzo è "su preventivo". */
  priceLabel?: string;
  target: string;
  features: string[];
  highlighted?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  city: string;
  planId: PlanId;
  modules: { ristoprofit: boolean; ristocare: boolean };
}

export interface PriceTrend {
  ingredient: string;
  /** Variazione percentuale rispetto all'ultimo acquisto (es. 0.12 = +12%). */
  changeRatio: number;
}

export interface DailyKpi {
  date: string;
  revenueCents: number;
  covers: number;
  staffCostCents: number;
  foodCostRatio: number;
}
