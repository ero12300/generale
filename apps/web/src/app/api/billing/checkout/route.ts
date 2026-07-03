import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/barber/validations";
import { getStripeServer } from "@/lib/stripe";
import { subscriptionTiers } from "@/lib/barber-data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues.map((issue) => issue.message).join("; "),
      },
      { status: 400 }
    );
  }

  const plan = subscriptionTiers.find((tier) => tier.id === parsed.data.plan);
  if (!plan) {
    return NextResponse.json({ ok: false, error: "Piano non trovato" }, { status: 404 });
  }

  const stripe = getStripeServer();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  if (!stripe) {
    return NextResponse.json({
      ok: true,
      mode: "preview",
      checkoutUrl: `${baseUrl}${parsed.data.originPath}?checkout=preview&plan=${plan.id}`,
      message:
        "Stripe non configurato: anteprima attiva. Collega STRIPE_SECRET_KEY per il checkout reale.",
    });
  }

  const priceLookupKey =
    parsed.data.billingCycle === "yearly"
      ? `${plan.stripe_price_lookup_key}_yearly`
      : plan.stripe_price_lookup_key;

  const prices = await stripe.prices.list({
    lookup_keys: [priceLookupKey],
    expand: ["data.product"],
    limit: 1,
  });

  const stripePrice = prices.data[0];
  if (!stripePrice) {
    return NextResponse.json(
      { ok: false, error: `Prezzo Stripe non trovato per lookup key ${priceLookupKey}` },
      { status: 404 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${baseUrl}/growth?checkout=success&plan=${plan.id}`,
    cancel_url: `${baseUrl}/growth?checkout=cancelled&plan=${plan.id}`,
    line_items: [{ price: stripePrice.id, quantity: 1 }],
    billing_address_collection: "required",
    allow_promotion_codes: true,
    metadata: {
      app: "atelier-barber-club",
      plan: plan.id,
      billingCycle: parsed.data.billingCycle,
    },
  });

  return NextResponse.json({
    ok: true,
    mode: "live",
    checkoutUrl: session.url,
  });
}
