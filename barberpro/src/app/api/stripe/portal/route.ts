import { NextResponse } from "next/server";
import { getStripe, stripeEnabled, siteUrl } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!stripeEnabled) {
    return NextResponse.json({ error: "Portale disponibile solo con Stripe configurato." });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe non configurato." });
  }

  // In un'app completa il customerId viene recuperato dal profilo utente
  // salvato al momento del checkout (via webhook). Qui usiamo l'env come esempio.
  const customerId = process.env.STRIPE_DEMO_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({
      error: "Nessun cliente Stripe associato. Completa prima un abbonamento.",
    });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${siteUrl(req.url)}/dashboard/settings`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore Stripe" },
      { status: 500 },
    );
  }
}
