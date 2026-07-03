import { NextResponse } from "next/server";
import { stripe, stripeConfigured } from "@/lib/stripe/server";
import { updateShopPlan } from "@/lib/data/repo";

// I webhook devono ricevere il body raw. Disabilitiamo il body parser di Next.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: "Stripe non configurato" }, { status: 500 });
  }
  const client = stripe();
  if (!client) return NextResponse.json({ error: "Stripe non configurato" }, { status: 500 });

  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !whSecret) {
    return NextResponse.json({ error: "Webhook secret mancante" }, { status: 400 });
  }
  const buf = Buffer.from(await req.arrayBuffer());
  let event;
  try {
    event = client.webhooks.constructEvent(buf, sig, whSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature invalid: ${(err as Error).message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const shopId = (session.metadata?.shopId as string | undefined) ?? "demo-shop";
        const plan = (session.metadata?.plan as "pro" | "business" | undefined) ?? "pro";
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        await updateShopPlan(shopId, {
          plan,
          stripeCustomerId: customerId ?? null,
          stripeSubscriptionId: subscriptionId ?? null,
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const shopId = (sub.metadata?.shopId as string | undefined) ?? "demo-shop";
        const plan = (sub.metadata?.plan as "pro" | "business" | undefined) ?? "pro";
        const active = sub.status === "active" || sub.status === "trialing";
        await updateShopPlan(shopId, {
          plan: active ? plan : "free",
          currentPeriodEnd: (sub as { current_period_end?: number }).current_period_end
            ? new Date(((sub as { current_period_end: number }).current_period_end) * 1000).toISOString()
            : null,
        });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
