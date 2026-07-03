import type { PlanId } from "./types";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  /** Prezzo mensile in centesimi */
  priceCents: number;
  highlighted?: boolean;
  cta: string;
  features: PlanFeature[];
  /** Limiti applicati dal feature gating */
  limits: {
    maxClients: number | null;
    maxServices: number | null;
    campaigns: boolean;
    analytics: boolean;
    onlineBooking: boolean;
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Starter",
    tagline: "Per iniziare a digitalizzare il salone",
    priceCents: 0,
    cta: "Inizia gratis",
    features: [
      { label: "Agenda prenotazioni", included: true },
      { label: "Fino a 30 clienti", included: true },
      { label: "Fino a 3 servizi", included: true },
      { label: "Registro incassi base", included: true },
      { label: "Campagne sconti & porta un amico", included: false },
      { label: "Dashboard analitica avanzata", included: false },
      { label: "Prenotazione online per i clienti", included: false },
    ],
    limits: {
      maxClients: 30,
      maxServices: 3,
      campaigns: false,
      analytics: false,
      onlineBooking: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Il salone che cresce senza limiti",
    priceCents: 2900,
    highlighted: true,
    cta: "Passa a Pro",
    features: [
      { label: "Agenda prenotazioni illimitata", included: true },
      { label: "Clienti illimitati", included: true },
      { label: "Servizi illimitati", included: true },
      { label: "Gestionale incassi completo", included: true },
      { label: "Campagne sconti & porta un amico", included: true },
      { label: "Dashboard analitica avanzata", included: true },
      { label: "Prenotazione online per i clienti", included: true },
    ],
    limits: {
      maxClients: null,
      maxServices: null,
      campaigns: true,
      analytics: true,
      onlineBooking: true,
    },
  },
};

export const PLAN_LIST: Plan[] = [PLANS.free, PLANS.pro];

export function planOf(id: PlanId): Plan {
  return PLANS[id] ?? PLANS.free;
}
