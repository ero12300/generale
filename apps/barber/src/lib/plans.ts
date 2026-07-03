import type { PlanId } from "./types";

export interface PlanDef {
  id: PlanId;
  name: string;
  priceMonthlyCents: number;
  tagline: string;
  features: string[];
  limits: {
    maxClients: number | null;
    maxBookingsPerMonth: number | null;
    campaigns: boolean;
    onlineBooking: boolean;
    exportCsv: boolean;
  };
}

export const PLANS: Record<PlanId, PlanDef> = {
  base: {
    id: "base",
    name: "Base",
    priceMonthlyCents: 1900,
    tagline: "Per iniziare a digitalizzare il salone",
    features: [
      "Gestionale incassi giornaliero",
      "Agenda prenotazioni interna",
      "Fino a 100 clienti in rubrica",
      "Fino a 150 prenotazioni al mese",
      "1 operatore",
    ],
    limits: {
      maxClients: 100,
      maxBookingsPerMonth: 150,
      campaigns: false,
      onlineBooking: false,
      exportCsv: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthlyCents: 4900,
    tagline: "Per far crescere il salone in automatico",
    features: [
      "Tutto del piano Base",
      "Clienti e prenotazioni illimitati",
      "Prenotazione online per i clienti",
      "Campagne sconti e Porta un Amico",
      "Statistiche avanzate incassi",
      "Export CSV per il commercialista",
      "Operatori illimitati",
    ],
    limits: {
      maxClients: null,
      maxBookingsPerMonth: null,
      campaigns: true,
      onlineBooking: true,
      exportCsv: true,
    },
  },
};

export function planAllows(
  plan: PlanId,
  feature: keyof PlanDef["limits"]
): boolean {
  const limit = PLANS[plan].limits[feature];
  return limit === true || limit === null;
}

/** true se il piano consente di aggiungere un altro cliente. */
export function canAddClient(plan: PlanId, currentCount: number): boolean {
  const max = PLANS[plan].limits.maxClients;
  return max === null || currentCount < max;
}

export function canAddBooking(plan: PlanId, bookingsThisMonth: number): boolean {
  const max = PLANS[plan].limits.maxBookingsPerMonth;
  return max === null || bookingsThisMonth < max;
}
