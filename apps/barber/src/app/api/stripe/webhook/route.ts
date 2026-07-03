import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/plans";
import { getAdminDb } from "@/lib/firebase/admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configurato" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  const db = getAdminDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const planId = session.metadata?.planId;
      const customerId = session.customer as string | null;

      if (db && planId && customerId) {
        const shopsRef = db.collection("shops");
        const snapshot = await shopsRef
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            plan: planId,
            stripeSubscriptionId: session.subscription,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      if (db) {
        const snapshot = await db
          .collection("shops")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!snapshot.empty) {
          await snapshot.docs[0].ref.update({
            plan: "starter",
            stripeSubscriptionId: null,
            updatedAt: new Date().toISOString(),
          });
        }
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
