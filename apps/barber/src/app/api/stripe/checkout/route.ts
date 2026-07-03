import { NextResponse } from "next/server";
import { z } from "zod";
import { SUBSCRIPTION_PLANS, getStripe, type SubscriptionPlanId } from "@/lib/stripe/plans";

const bodySchema = z.object({
  planId: z.enum(["pro", "elite"]),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const plan = SUBSCRIPTION_PLANS[body.planId as SubscriptionPlanId];

    const stripe = getStripe();
    if (!stripe || !plan.stripePriceId) {
      return NextResponse.json({
        demo: true,
        error: "Stripe non configurato. Aggiungi STRIPE_SECRET_KEY e STRIPE_PRICE_PRO nel file .env",
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?success=true`,
      cancel_url: `${appUrl}/pricing?cancelled=true`,
      metadata: { planId: body.planId },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore checkout";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
