import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdmin } from "@/lib/firebase/admin";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ ok: true, ignored: "stripe non configurato" }, { status: 200 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "signature mancante" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature error: ${err?.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const uid = s.metadata?.uid;
        const plan = s.metadata?.plan;
        if (uid && plan) await updateUserPlan(uid, plan, s);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const uid = sub.metadata?.uid;
        const plan = sub.metadata?.plan;
        if (uid) await updateUserSubscription(uid, plan, sub);
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "handler error" }, { status: 500 });
  }
}

async function updateUserPlan(uid: string, plan: string, s: Stripe.Checkout.Session) {
  const { db } = getAdmin();
  if (!db) return;
  await db.collection("users").doc(uid).set({
    plan,
    stripeCustomerId: s.customer,
    stripeSubscriptionId: s.subscription,
  }, { merge: true });
}

async function updateUserSubscription(uid: string, plan: string | undefined, sub: Stripe.Subscription) {
  const { db } = getAdmin();
  if (!db) return;
  await db.collection("users").doc(uid).set({
    plan: sub.status === "active" || sub.status === "trialing" ? plan ?? "base" : "free",
    stripeSubscriptionId: sub.id,
    stripeSubscriptionStatus: sub.status,
    currentPeriodEnd: new Date((sub.current_period_end ?? 0) * 1000).toISOString(),
  }, { merge: true });
}
