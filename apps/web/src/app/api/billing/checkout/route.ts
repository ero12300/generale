import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutRequestSchema, type BarberPlanId } from "@/lib/barber/schemas";

const stripePriceEnv: Record<BarberPlanId, string | undefined> = {
  basic: process.env.STRIPE_PRICE_BASIC,
  pro: process.env.STRIPE_PRICE_PRO,
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const price = stripePriceEnv[parsed.data.planId];

  if (!secretKey || !price) {
    return NextResponse.json(
      {
        error:
          "Checkout Stripe da configurare: aggiungi STRIPE_SECRET_KEY e il Price ID del piano.",
      },
      { status: 503 }
    );
  }

  const origin =
    request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`,
    metadata: {
      app: "barber-os",
      planId: parsed.data.planId,
    },
  });

  return NextResponse.json({ url: session.url });
}
