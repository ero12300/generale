import { NextResponse } from "next/server";
import { validationError } from "@/lib/api-response";
import { getStripeServerClient } from "@/lib/payments/stripe";
import { parseBody } from "@/lib/validations/api";
import { stripeCheckoutSchema } from "@/lib/validations/barber";

const PLAN_PRICE_LOOKUP: Record<"basic" | "pro", string | undefined> = {
  basic: process.env.STRIPE_PRICE_BASIC,
  pro: process.env.STRIPE_PRICE_PRO,
};

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(stripeCheckoutSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const stripe = getStripeServerClient();
  if (!stripe) {
    return NextResponse.json({
      mode: "demo",
      checkout_url: "/barber/billing?status=demo",
      message: "Stripe non configurato: usa la modalità demo fino al setup in produzione.",
    });
  }

  const priceId = PLAN_PRICE_LOOKUP[parsed.data.plan];
  if (!priceId) return validationError("Prezzo Stripe non configurato per il piano selezionato");

  const successUrl =
    parsed.data.success_url ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/barber/billing?status=success`;
  const cancelUrl =
    parsed.data.cancel_url ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/barber/billing?status=cancelled`;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ mode: "live", checkout_url: session.url });
}
