import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/validations";
import { getAppUrl, getStripeClient, getStripePriceId } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Piano non valido" }, { status: 400 });
  }

  const stripe = getStripeClient();
  const priceId = getStripePriceId(parsed.data.plan);

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        ok: false,
        message: "Stripe non configurato. Inserisci STRIPE_SECRET_KEY e il price id del piano su Vercel.",
      },
      { status: 503 }
    );
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/?checkout=success`,
    cancel_url: `${appUrl}/#pricing`,
    metadata: {
      plan: parsed.data.plan,
    },
  });

  return NextResponse.json({ ok: true, url: session.url });
}
