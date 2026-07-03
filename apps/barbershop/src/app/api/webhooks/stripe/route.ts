import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { updateShop } from "@/lib/firestore";
import { db, query, collection, where, getDocs } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  async function getShopByStripeCustomer(customerId: string) {
    const q = query(collection(db, "shops"), where("stripeCustomerId", "==", customerId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any;
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const shop = await getShopByStripeCustomer(sub.customer);
      if (shop) {
        await updateShop(shop.id, {
          plan: sub.status === "active" || sub.status === "trialing" ? "pro" : "free",
          stripeSubscriptionId: sub.id,
          subscriptionStatus: sub.status,
          trialEndsAt: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : undefined,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const shop = await getShopByStripeCustomer(sub.customer);
      if (shop) {
        await updateShop(shop.id, {
          plan: "free",
          subscriptionStatus: "canceled",
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
