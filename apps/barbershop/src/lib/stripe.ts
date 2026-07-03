import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const STRIPE_PRICES = {
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
};

export async function createCheckoutSession({
  customerId,
  priceId,
  shopId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  priceId: string;
  shopId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { shopId },
    subscription_data: {
      trial_period_days: 14,
      metadata: { shopId },
    },
  });
  return session;
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}

export async function createStripeCustomer({
  email,
  name,
  shopId,
}: {
  email: string;
  name: string;
  shopId: string;
}) {
  return stripe.customers.create({ email, name, metadata: { shopId } });
}
