import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";
import type { SubscriptionPlan } from "@ristocare/types";

export const runtime = "nodejs";

async function activateOrganizationPlan(params: {
  plan: SubscriptionPlan;
  organizationId?: string | null;
  billingEmail?: string | null;
}) {
  const admin = createAdminClient();
  if (!admin) {
    console.warn("[stripe] Supabase admin non configurato — skip aggiornamento piano");
    return;
  }

  const updates = { plan: params.plan, status: "active" as const };

  if (params.organizationId) {
    const { error } = await admin.from("organizations").update(updates).eq("id", params.organizationId);
    if (error) console.error("[stripe] update org by id:", error.message);
    return;
  }

  if (params.billingEmail) {
    const { error } = await admin
      .from("organizations")
      .update(updates)
      .eq("billing_email", params.billingEmail);
    if (error) console.error("[stripe] update org by email:", error.message);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const plan = session.metadata?.plan as SubscriptionPlan | undefined;
  if (!plan) return;

  await activateOrganizationPlan({
    plan,
    organizationId: session.metadata?.organization_id || null,
    billingEmail: session.customer_details?.email ?? session.customer_email,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const plan = subscription.metadata?.plan as SubscriptionPlan | undefined;
  const organizationId = subscription.metadata?.organization_id;
  const admin = createAdminClient();
  if (!admin || !organizationId) return;

  await admin
    .from("organizations")
    .update({ status: "cancelled", plan: plan ?? "start" })
    .eq("id", organizationId);
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return new Response("Stripe non configurato", { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe] Manca STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook non configurato", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Firma mancante", { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma non valida";
    console.error("[stripe] webhook signature:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
