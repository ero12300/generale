import { NextResponse } from "next/server";
import { getStripe, stripeEnabled, stripePricePro, siteUrl } from "@/lib/stripe";

export async function POST(req: Request) {
  // Senza chiavi Stripe: rispondiamo "demo" così il client simula l'upgrade.
  if (!stripeEnabled) {
    return NextResponse.json({ demo: true });
  }

  const stripe = getStripe();
  if (!stripe || !stripePricePro) {
    return NextResponse.json({ demo: true });
  }

  const base = siteUrl(req.url);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: stripePricePro, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${base}/dashboard/settings?checkout=success`,
      cancel_url: `${base}/dashboard/settings?checkout=cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore Stripe" },
      { status: 500 },
    );
  }
}
