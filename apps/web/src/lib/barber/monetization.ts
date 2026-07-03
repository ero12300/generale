import { BarberPricingPlan, BarberSubscriptionTier } from "@deal-desk/types";

export const BARBER_PRICING_PLANS: BarberPricingPlan[] = [
  {
    id: "base",
    name: "Base",
    monthly_price_cents: 2900,
    features: [
      "Agenda prenotazioni online",
      "CRM clienti essenziale",
      "Report incassi mensili",
      "1 campagna sconti attiva",
    ],
    cta: "Inizia con Base",
    recommended: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly_price_cents: 7900,
    features: [
      "Tutto il piano Base",
      "Referral porta-un-amico illimitato",
      "Automazioni reminder WhatsApp/SMS",
      "Segmentazione clienti avanzata",
      "Multi-operatore e analytics premium",
    ],
    cta: "Passa a Pro",
    recommended: true,
  },
];

export function getPlanById(planId: BarberSubscriptionTier) {
  return BARBER_PRICING_PLANS.find((plan) => plan.id === planId) ?? BARBER_PRICING_PLANS[0];
}

export function canCreateCampaign(currentTier: BarberSubscriptionTier, activeCampaignsCount: number) {
  if (currentTier === "pro") return true;
  return activeCampaignsCount < 1;
}
