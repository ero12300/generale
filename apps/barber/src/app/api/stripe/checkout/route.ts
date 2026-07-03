import { NextResponse } from "next/server";
import { getStripe, getPriceIdForPlan, isStripeConfigured } from "@/lib/stripe/server";

/**
 * Avvia una Stripe Checkout Session per l'abbonamento al piano scelto.
 *
 * Body JSON: { plan: "pro" | "business" }
 *
 * Se Stripe non è configurato ritorna un URL demo che simula il flusso.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const plan = body?.plan as "pro" | "business" | undefined;
  if (plan !== "pro" && plan !== "business") {
    return NextResponse.json({ error: "invalid plan" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100";

  if (!isStripeConfigured()) {
    // Demo mode: fingiamo il flusso e torniamo alla pagina abbonamento con un flag.
    return NextResponse.json({
      url: `${appUrl}/dashboard/abbonamento?demo=1&plan=${plan}`,
      demo: true,
    });
  }

  const stripe = getStripe();
  const priceId = getPriceIdForPlan(plan);
  if (!stripe || !priceId) {
    return NextResponse.json(
      { error: "stripe not fully configured (missing price id)" },
      { status: 500 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/abbonamento?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/abbonamento?cancelled=1`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      subscription_data: { metadata: { plan } },
      metadata: { plan },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
