import type { Plan } from "./types";

export interface PlanFeatures {
  onlineBooking: boolean;
  referralProgram: boolean;
  advancedReports: boolean;
  multiStaff: boolean;
  export: boolean;
  maxClients: number;
  maxActiveCampaigns: number;
  maxStaff: number;
}

export const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  base: {
    onlineBooking: true,
    referralProgram: false,
    advancedReports: false,
    multiStaff: false,
    export: false,
    maxClients: 40,
    maxActiveCampaigns: 1,
    maxStaff: 1,
  },
  pro: {
    onlineBooking: true,
    referralProgram: true,
    advancedReports: true,
    multiStaff: true,
    export: true,
    maxClients: Infinity,
    maxActiveCampaigns: Infinity,
    maxStaff: Infinity,
  },
};

export interface PlanCatalogEntry {
  id: Plan;
  name: string;
  priceMonthly: number;
  tagline: string;
  highlights: string[];
  cta: string;
}

export const PLAN_CATALOG: PlanCatalogEntry[] = [
  {
    id: "base",
    name: "Base",
    priceMonthly: 0,
    tagline: "Per iniziare a digitalizzare il tuo salone",
    highlights: [
      "Prenotazioni online e interne",
      "Agenda giornaliera",
      "Database clienti (fino a 40)",
      "Registro incassi giornaliero",
      "1 campagna sconto attiva",
    ],
    cta: "Inizia gratis",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 29,
    tagline: "Per far crescere e fidelizzare la clientela",
    highlights: [
      "Tutto del piano Base",
      "Clienti illimitati e multi-operatore",
      'Programma "Porta un amico" e referral',
      "Campagne sconto illimitate",
      "Report incassi avanzati ed export",
    ],
    cta: "Passa a Pro",
  },
];

export function planFeatures(plan: Plan): PlanFeatures {
  return PLAN_FEATURES[plan];
}

export function canUseFeature(
  plan: Plan,
  feature: keyof Omit<PlanFeatures, "maxClients" | "maxActiveCampaigns" | "maxStaff">
): boolean {
  return PLAN_FEATURES[plan][feature];
}
