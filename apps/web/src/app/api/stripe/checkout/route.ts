import { NextResponse } from "next/server";
import Stripe from "stripe";
import { validationError } from "@/lib/api-response";
import { getBarberRepository } from "@/lib/barber/repository";
import { stripeCheckoutSchema, parseBody } from "@/lib/validations/api";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(stripeCheckoutSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const repo = await getBarberRepository();
  const plan = (await repo.listPlans()).find((item) => item.id === parsed.data.planId);
  if (!plan) return validationError("Piano non disponibile");

  const priceId = process.env[plan.stripe_price_env];
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey || !priceId) {
    return NextResponse.json({
      mode: "demo",
      message: `Checkout demo: configura STRIPE_SECRET_KEY e ${plan.stripe_price_env} su Vercel.`,
    });
  }

  const stripe = new Stripe(secretKey);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/billing?checkout=success`,
    cancel_url: `${baseUrl}/billing?checkout=cancelled`,
    metadata: {
      product: "barber-saas",
      planId: plan.id,
    },
  });

  return NextResponse.json({ mode: "stripe", url: session.url });
}
