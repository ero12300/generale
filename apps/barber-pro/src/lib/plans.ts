import type { Plan } from "./types";

export interface PlanConfig {
  id: Plan;
  name: string;
  tagline: string;
  priceMonthlyEur: number;
  currency: "EUR";
  cta: string;
  highlight: boolean;
  limits: {
    maxClients: number | "unlimited";
    maxBookingsPerMonth: number | "unlimited";
    maxStaff: number | "unlimited";
    canUseCampaigns: boolean;
    canUseReferral: boolean;
    canUsePublicBooking: boolean;
    canUseAdvancedAnalytics: boolean;
    canExport: boolean;
    supportSLA: string;
  };
  features: string[];
  stripeEnvKey?: "STRIPE_PRICE_PRO_MONTHLY" | "STRIPE_PRICE_BUSINESS_MONTHLY";
}

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: "free",
    name: "Starter",
    tagline: "Per iniziare senza costi",
    priceMonthlyEur: 0,
    currency: "EUR",
    cta: "Inizia gratis",
    highlight: false,
    limits: {
      maxClients: 50,
      maxBookingsPerMonth: 40,
      maxStaff: 1,
      canUseCampaigns: false,
      canUseReferral: false,
      canUsePublicBooking: true,
      canUseAdvancedAnalytics: false,
      canExport: false,
      supportSLA: "Community",
    },
    features: [
      "Fino a 50 clienti",
      "40 prenotazioni/mese",
      "1 postazione",
      "Pagina prenotazioni pubblica",
      "Registrazione incassi manuale",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Il più scelto dai saloni",
    priceMonthlyEur: 29,
    currency: "EUR",
    cta: "Attiva Pro",
    highlight: true,
    limits: {
      maxClients: "unlimited",
      maxBookingsPerMonth: "unlimited",
      maxStaff: 5,
      canUseCampaigns: true,
      canUseReferral: true,
      canUsePublicBooking: true,
      canUseAdvancedAnalytics: true,
      canExport: true,
      supportSLA: "Email · 24h",
    },
    features: [
      "Clienti e prenotazioni illimitati",
      "Fino a 5 barbieri",
      "Campagne sconto e coupon",
      "Programma referral \u201cporta un amico\u201d",
      "Analytics avanzata su incassi",
      "Export CSV incassi e clienti",
    ],
    stripeEnvKey: "STRIPE_PRICE_PRO_MONTHLY",
  },
  business: {
    id: "business",
    name: "Business",
    tagline: "Per catene e franchising",
    priceMonthlyEur: 79,
    currency: "EUR",
    cta: "Contattaci",
    highlight: false,
    limits: {
      maxClients: "unlimited",
      maxBookingsPerMonth: "unlimited",
      maxStaff: "unlimited",
      canUseCampaigns: true,
      canUseReferral: true,
      canUsePublicBooking: true,
      canUseAdvancedAnalytics: true,
      canExport: true,
      supportSLA: "Priority · 4h",
    },
    features: [
      "Tutto in Pro",
      "Barbieri illimitati",
      "Multi-sede (roadmap)",
      "Onboarding dedicato",
      "SLA priority 4h",
    ],
    stripeEnvKey: "STRIPE_PRICE_BUSINESS_MONTHLY",
  },
};

export const PLAN_ORDER: Plan[] = ["free", "pro", "business"];

export function planRank(p: Plan): number {
  return PLAN_ORDER.indexOf(p);
}

export function isAtLeast(current: Plan, required: Plan): boolean {
  return planRank(current) >= planRank(required);
}
