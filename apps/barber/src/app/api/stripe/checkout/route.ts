import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, appUrl } from "@/lib/stripe/config";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email: string | undefined = body?.email;

  // Modalità demo: Stripe non configurato -> segnaliamo al client di simulare l'upgrade.
  if (!isStripeConfigured()) {
    return NextResponse.json({
      demo: true,
      url: `${appUrl()}/dashboard/abbonamento?upgrade=success&demo=1`,
    });
  }

  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PRICE_PRO_MONTHLY non configurato" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non disponibile" }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: 14 },
      success_url: `${appUrl()}/dashboard/abbonamento?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl()}/dashboard/abbonamento?upgrade=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
