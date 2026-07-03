import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured, appUrl } from "@/lib/stripe/config";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const customerId: string | undefined = body?.customerId;

  if (!isStripeConfigured()) {
    return NextResponse.json({
      demo: true,
      url: `${appUrl()}/dashboard/abbonamento?portal=demo`,
    });
  }

  const stripe = getStripe();
  if (!stripe || !customerId) {
    return NextResponse.json({ error: "Parametri mancanti" }, { status: 400 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl()}/dashboard/abbonamento`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
