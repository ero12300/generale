import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json({ demo: true, error: "Stripe non configurato in demo." }, { status: 200 });
    }
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non inizializzato" }, { status: 500 });
    }
    const body = await req.json().catch(() => ({}));
    const customerId: string | undefined = body?.customerId;
    if (!customerId) {
      return NextResponse.json({ error: "customerId mancante" }, { status: 400 });
    }
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/impostazioni`,
    });
    return NextResponse.json({ portalUrl: portal.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Errore portal";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
