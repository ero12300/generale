import type { PlanFeature, PlanId } from "./types";

export const planPricing: Record<PlanId, { name: string; monthlyCents: number; tagline: string }> = {
  basic: {
    name: "Basic",
    monthlyCents: 3900,
    tagline: "Per partire con prenotazioni, clienti e incassi.",
  },
  pro: {
    name: "Pro",
    monthlyCents: 9900,
    tagline: "Per saloni che vogliono automatizzare crescita e retention.",
  },
};

export const planFeatures: PlanFeature[] = [
  { label: "Prenotazioni online", basic: true, pro: true },
  { label: "Database clienti", basic: "fino a 150", pro: "illimitato" },
  { label: "Gestionale incassi", basic: true, pro: true },
  { label: "Campagne sconto", basic: "manuali", pro: "automatiche" },
  { label: "Porta un amico", basic: false, pro: true },
  { label: "Report avanzati", basic: false, pro: true },
  { label: "Promemoria WhatsApp/SMS", basic: false, pro: true },
];

export function canUseFeature(plan: PlanId, feature: "referral" | "advancedReports" | "automations") {
  if (plan === "pro") return true;
  return feature !== "referral" && feature !== "advancedReports" && feature !== "automations";
}

export function getClientLimit(plan: PlanId) {
  return plan === "basic" ? 150 : Number.POSITIVE_INFINITY;
}
