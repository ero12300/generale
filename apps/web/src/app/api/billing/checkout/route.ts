import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  tier: z.enum(["basic", "pro"]),
});

function getPriceIdByTier(tier: "basic" | "pro"): string | undefined {
  return tier === "basic" ? process.env.STRIPE_PRICE_BASIC : process.env.STRIPE_PRICE_PRO;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const priceId = getPriceIdByTier(parsed.data.tier);

  if (!secretKey || !priceId) {
    return NextResponse.json({
      data: {
        mode: "demo",
        checkoutUrl: `${baseUrl}/barber?billing=demo&tier=${parsed.data.tier}`,
      },
    });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/barber?checkout=success`,
    cancel_url: `${baseUrl}/barber?checkout=cancel`,
    metadata: {
      tier: parsed.data.tier,
    },
  });

  return NextResponse.json({
    data: {
      mode: "stripe",
      checkoutUrl: session.url,
    },
  });
}
