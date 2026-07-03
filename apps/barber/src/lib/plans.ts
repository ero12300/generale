import type { PlanId } from "./types";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceCents: number; // prezzo mensile in centesimi
  priceLabel: string;
  cta: string;
  highlight?: boolean;
  // Limiti applicati lato prodotto per differenziare Free vs Pro
  limits: {
    maxBookingsPerMonth: number; // Infinity per Pro
    maxClients: number;
    maxCampaigns: number;
    onlineBooking: boolean;
    referralProgram: boolean;
    advancedAnalytics: boolean;
    smsReminders: boolean;
    multiBarber: boolean;
  };
  features: string[];
  // Stripe price id (impostato via env in produzione)
  stripePriceEnv?: string;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Start",
    tagline: "Perfetto per iniziare a digitalizzare la barberia",
    priceCents: 0,
    priceLabel: "€0",
    cta: "Inizia gratis",
    limits: {
      maxBookingsPerMonth: 40,
      maxClients: 60,
      maxCampaigns: 1,
      onlineBooking: true,
      referralProgram: false,
      advancedAnalytics: false,
      smsReminders: false,
      multiBarber: false,
    },
    features: [
      "Prenotazioni online (fino a 40/mese)",
      "Registro incassi giornaliero",
      "Database clienti (fino a 60)",
      "1 campagna sconto attiva",
      "1 postazione barbiere",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Tutto illimitato per far scalare il tuo business",
    priceCents: 2900,
    priceLabel: "€29",
    cta: "Passa a Pro",
    highlight: true,
    stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY",
    limits: {
      maxBookingsPerMonth: Number.POSITIVE_INFINITY,
      maxClients: Number.POSITIVE_INFINITY,
      maxCampaigns: Number.POSITIVE_INFINITY,
      onlineBooking: true,
      referralProgram: true,
      advancedAnalytics: true,
      smsReminders: true,
      multiBarber: true,
    },
    features: [
      "Prenotazioni online illimitate",
      "Gestione incassi avanzata + report",
      "Database clienti illimitato con tier VIP",
      "Campagne sconto illimitate",
      'Programma "Porta un amico" con premi',
      "Analytics avanzate e trend fatturato",
      "Promemoria SMS/Email automatici",
      "Più postazioni barbiere",
      "Supporto prioritario",
    ],
  },
};

export const PLAN_LIST = [PLANS.free, PLANS.pro];
