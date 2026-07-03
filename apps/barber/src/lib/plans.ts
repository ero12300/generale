import type { Feature, PlanId } from "@/types";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyEur: number;
  priceId?: string;
  highlight?: boolean;
  features: string[];
  includes: Feature[];
  limits: {
    clients: number | "unlimited";
    bookingsPerMonth: number | "unlimited";
    staff: number | "unlimited";
  };
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Per iniziare a testare, senza carta.",
    monthlyEur: 0,
    features: [
      "Fino a 30 clienti",
      "Prenotazioni manuali illimitate",
      "1 barbiere",
      "Incassi giornalieri",
      "Nessun link pubblico prenotazione",
    ],
    includes: [
      "bookings.calendar",
      "clients.crm",
      "revenue.pos",
    ],
    limits: { clients: 30, bookingsPerMonth: "unlimited", staff: 1 },
  },
  base: {
    id: "base",
    name: "Base",
    tagline: "Il set completo per un barbiere solo.",
    monthlyEur: 19,
    priceId: process.env.STRIPE_PRICE_BASE_MONTHLY,
    features: [
      "Clienti illimitati",
      "Link pubblico prenotazioni",
      "Calendario e promemoria",
      "Registro incassi + report giorno/mese",
      "Codici sconto",
      "1 postazione",
    ],
    includes: [
      "bookings.calendar",
      "bookings.public_page",
      "clients.crm",
      "clients.notes",
      "revenue.pos",
      "revenue.reports",
      "campaigns.discounts",
      "export.csv",
    ],
    limits: { clients: "unlimited", bookingsPerMonth: "unlimited", staff: 1 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "Per barbershop che crescono e vogliono scalare.",
    monthlyEur: 39,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY,
    highlight: true,
    features: [
      "Tutto quello che c'è in Base",
      "Campagne referral porta-un-amico",
      "Multi-barbiere / multi-postazione",
      "Report avanzati per servizio e cliente",
      "Priorità assistenza + white-label link",
    ],
    includes: [
      "bookings.calendar",
      "bookings.public_page",
      "clients.crm",
      "clients.notes",
      "revenue.pos",
      "revenue.reports",
      "campaigns.discounts",
      "campaigns.referral",
      "staff.multi",
      "export.csv",
    ],
    limits: { clients: "unlimited", bookingsPerMonth: "unlimited", staff: "unlimited" },
  },
};

export function hasFeature(plan: PlanId | undefined, feature: Feature) {
  if (!plan) return false;
  return PLANS[plan].includes.includes(feature);
}

export function planName(plan: PlanId | undefined) {
  if (!plan) return "—";
  return PLANS[plan].name;
}
