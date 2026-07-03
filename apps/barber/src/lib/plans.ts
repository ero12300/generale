import type { PlanId } from "./types";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceMonthlyCents: number;
  tagline: string;
  features: string[];
  /** Chiavi funzionali abilitate dal piano */
  capabilities: Capability[];
}

export type Capability =
  | "prenotazioni"
  | "incassi"
  | "clienti"
  | "campagne"
  | "referral"
  | "report_avanzati";

export const PLANS: Record<PlanId, PlanDefinition> = {
  base: {
    id: "base",
    name: "Base",
    priceMonthlyCents: 1900,
    tagline: "Per iniziare a digitalizzare il salone",
    features: [
      "Prenotazioni online illimitate",
      "Agenda giornaliera",
      "Registro incassi",
      "Database clienti",
    ],
    capabilities: ["prenotazioni", "incassi", "clienti"],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthlyCents: 4900,
    tagline: "Per far crescere il fatturato",
    features: [
      "Tutto il piano Base",
      "Campagne sconto con codici",
      "Programma \u201cPorta un amico\u201d",
      "Report avanzati e top servizi",
      "Supporto prioritario",
    ],
    capabilities: [
      "prenotazioni",
      "incassi",
      "clienti",
      "campagne",
      "referral",
      "report_avanzati",
    ],
  },
};

export function planHasCapability(plan: PlanId, capability: Capability): boolean {
  return PLANS[plan].capabilities.includes(capability);
}
