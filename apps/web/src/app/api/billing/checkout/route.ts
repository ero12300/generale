import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { saasPlans, type PlanTier } from "@/lib/barber-data";

const checkoutSchema = z.object({
  planId: z.enum(["basic", "pro", "elite"]),
});

const stripePriceEnv: Record<PlanTier, string | undefined> = {
  basic: process.env.STRIPE_PRICE_BASIC,
  pro: process.env.STRIPE_PRICE_PRO,
  elite: process.env.STRIPE_PRICE_ELITE,
};

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Piano non valido", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const plan = saasPlans.find((item) => item.id === parsed.data.planId);
  const priceId = stripePriceEnv[parsed.data.planId];
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  if (!plan) {
    return NextResponse.json({ error: "Piano inesistente" }, { status: 404 });
  }

  if (!secretKey || !priceId) {
    return NextResponse.json({
      mode: "demo",
      url: `/billing?checkout=demo-${plan.id}`,
      message: "Stripe non configurato: aggiungi STRIPE_SECRET_KEY e STRIPE_PRICE_* su Vercel.",
    });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?checkout=success&plan=${plan.id}`,
    cancel_url: `${appUrl}/billing?checkout=cancelled&plan=${plan.id}`,
    metadata: {
      planId: plan.id,
      product: "royal-fade-os",
    },
  });

  return NextResponse.json({ mode: "stripe", url: session.url });
}
