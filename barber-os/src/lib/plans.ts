import type { PlanId } from "./types";

export interface PlanFeatures {
  id: PlanId;
  name: string;
  priceLabel: string;
  priceCentsMonthly: number;
  maxCustomers: number | null;
  maxBookingsPerMonth: number | null;
  campaigns: boolean;
  advancedReports: boolean;
  highlights: string[];
}

export const PLANS: Record<PlanId, PlanFeatures> = {
  base: {
    id: "base",
    name: "Base",
    priceLabel: "Gratis",
    priceCentsMonthly: 0,
    maxCustomers: 50,
    maxBookingsPerMonth: 60,
    campaigns: false,
    advancedReports: false,
    highlights: [
      "Agenda prenotazioni online",
      "Registro incassi giornaliero",
      "Fino a 50 clienti in rubrica",
      "Fino a 60 prenotazioni al mese",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceLabel: "29€/mese",
    priceCentsMonthly: 2900,
    maxCustomers: null,
    maxBookingsPerMonth: null,
    campaigns: true,
    advancedReports: false,
    highlights: [
      "Tutto ciò che è incluso nel piano Base",
      "Clienti e prenotazioni illimitati",
      "Campagne sconto e porta un amico",
      "Report incassi avanzati",
      "Supporto prioritario",
    ],
  },
};

export function planAllowsNewCustomer(
  plan: PlanId,
  currentCustomers: number
): boolean {
  const max = PLANS[plan].maxCustomers;
  return max === null || currentCustomers < max;
}

export function planAllowsNewBooking(
  plan: PlanId,
  bookingsThisMonth: number
): boolean {
  const max = PLANS[plan].maxBookingsPerMonth;
  return max === null || bookingsThisMonth < max;
}
