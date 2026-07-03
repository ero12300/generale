import type { PlanId } from "./types";
import { PLANS, type Plan } from "./plans";

export function getPlan(plan: PlanId): Plan {
  return PLANS[plan];
}

export type FeatureKey = keyof Plan["limits"];

export function hasFeature(plan: PlanId, feature: FeatureKey): boolean {
  const value = PLANS[plan].limits[feature];
  return typeof value === "boolean" ? value : value > 0;
}

// Ritorna true se il limite quantitativo è stato raggiunto per il piano corrente.
export function isLimitReached(
  plan: PlanId,
  feature: "maxBookingsPerMonth" | "maxClients" | "maxCampaigns",
  currentCount: number,
): boolean {
  const limit = PLANS[plan].limits[feature];
  return currentCount >= limit;
}
