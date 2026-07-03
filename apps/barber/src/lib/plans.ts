import type { PlanConfig, PlanTier } from "@/types";

/**
 * Configurazione piani BarberPro.
 * I prezzi sono in centesimi (mai float per importi monetari).
 */
export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    tier: "free",
    name: "Starter",
    priceCentsMonthly: 0,
    tagline: "Per iniziare, senza carta di credito.",
    bookingsPerMonth: 30,
    maxBarbers: 1,
    publicBookingPage: true,
    clientDatabase: true,
    revenueAnalytics: false,
    referralCampaigns: false,
    smsReminders: false,
    customBranding: false,
    multiLocation: false,
    apiAccess: false,
    prioritySupport: false,
    cta: "Inizia gratis",
  },
  pro: {
    tier: "pro",
    name: "Pro",
    priceCentsMonthly: 2900, // 29,00 €
    tagline: "Per il barbiere professionista che vuole crescere.",
    bookingsPerMonth: "unlimited",
    maxBarbers: 3,
    publicBookingPage: true,
    clientDatabase: true,
    revenueAnalytics: true,
    referralCampaigns: true,
    smsReminders: true,
    customBranding: true,
    multiLocation: false,
    apiAccess: false,
    prioritySupport: false,
    highlight: true,
    cta: "Attiva Pro",
  },
  business: {
    tier: "business",
    name: "Business",
    priceCentsMonthly: 7900, // 79,00 €
    tagline: "Per catene, franchise e barbershop premium.",
    bookingsPerMonth: "unlimited",
    maxBarbers: 20,
    publicBookingPage: true,
    clientDatabase: true,
    revenueAnalytics: true,
    referralCampaigns: true,
    smsReminders: true,
    customBranding: true,
    multiLocation: true,
    apiAccess: true,
    prioritySupport: true,
    cta: "Passa a Business",
  },
};

export function getPlan(tier: PlanTier): PlanConfig {
  return PLANS[tier];
}

export const PLAN_ORDER: PlanTier[] = ["free", "pro", "business"];

/** Elenco feature per la tabella comparativa marketing. */
export const PLAN_FEATURES: Array<{
  key: keyof PlanConfig | "bookingsPerMonth" | "maxBarbers";
  label: string;
  render?: (value: unknown) => string;
}> = [
  {
    key: "bookingsPerMonth",
    label: "Prenotazioni al mese",
    render: (v) => (v === "unlimited" ? "Illimitate" : `Fino a ${v}`),
  },
  {
    key: "maxBarbers",
    label: "Barbieri collaboratori",
    render: (v) => `Fino a ${v}`,
  },
  { key: "publicBookingPage", label: "Pagina prenotazione pubblica" },
  { key: "clientDatabase", label: "Database clienti + storico" },
  { key: "revenueAnalytics", label: "Report incassi avanzati" },
  { key: "referralCampaigns", label: 'Campagne "porta un amico"' },
  { key: "smsReminders", label: "Reminder SMS/WhatsApp" },
  { key: "customBranding", label: "Branding personalizzato" },
  { key: "multiLocation", label: "Multi-sede" },
  { key: "apiAccess", label: "Accesso API" },
  { key: "prioritySupport", label: "Supporto prioritario" },
];
