import Stripe from "stripe";
import { BarberSubscriptionTier } from "@deal-desk/types";
import { getPlanById } from "@/lib/barber/monetization";

let stripeClient: Stripe | null = null;

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  if (stripeClient) return stripeClient;
  stripeClient = new Stripe(secretKey);
  return stripeClient;
}

export async function createSubscriptionCheckout(options: {
  planId: BarberSubscriptionTier;
  customerEmail?: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const plan = getPlanById(options.planId);
  const stripe = getStripeClient();

  if (!stripe) {
    return {
      checkoutUrl: `${appUrl}/barber?billing=demo&plan=${plan.id}`,
      mode: "demo" as const,
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: options.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          recurring: { interval: "month" },
          product_data: {
            name: `Barber ${plan.name}`,
            description: "Gestionale premium barberia con CRM, booking e incassi",
          },
          unit_amount: plan.monthly_price_cents,
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/barber?billing=success`,
    cancel_url: `${appUrl}/barber?billing=cancelled`,
    metadata: {
      plan_id: plan.id,
    },
  });

  return {
    checkoutUrl: session.url ?? `${appUrl}/barber?billing=error`,
    mode: "stripe" as const,
  };
}
