import type { SubscriptionPlan } from "@ristocare/types";
import { PLAN_LABELS, PLAN_PRICES } from "@ristocare/types";
import type Stripe from "stripe";

const CHECKOUT_PLANS: SubscriptionPlan[] = ["start", "pro", "premium"];

export function isCheckoutPlan(plan: string): plan is SubscriptionPlan {
  return CHECKOUT_PLANS.includes(plan as SubscriptionPlan);
}

export function buildCheckoutLineItems(plan: SubscriptionPlan): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const pricing = PLAN_PRICES[plan];
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: PLAN_LABELS[plan],
          description: "Abbonamento mensile RistoCare OS",
        },
        unit_amount: Math.round(pricing.monthly * 100),
        recurring: { interval: "month" },
      },
      quantity: 1,
    },
  ];

  if (pricing.setup > 0) {
    items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: `Setup ${PLAN_LABELS[plan]}`,
          description: "Attivazione e onboarding iniziale",
        },
        unit_amount: Math.round(pricing.setup * 100),
      },
      quantity: 1,
    });
  }

  return items;
}
