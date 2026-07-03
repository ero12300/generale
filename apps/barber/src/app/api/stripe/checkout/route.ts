import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PLANS } from "@/lib/plans";
import { appUrl } from "@/lib/env";

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.json().catch(() => ({} as any));
  const plan = body?.plan as "base" | "pro" | undefined;
  const uid = body?.uid as string | undefined;
  const email = body?.email as string | undefined;

  if (!stripe) {
    return NextResponse.json({ demo: true, message: "Stripe non configurato: attiva la variabile STRIPE_SECRET_KEY" }, { status: 200 });
  }

  if (!plan || (plan !== "base" && plan !== "pro")) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }

  const priceId = PLANS[plan].priceId ?? (plan === "base" ? process.env.STRIPE_PRICE_BASE_MONTHLY : process.env.STRIPE_PRICE_PRO_MONTHLY);
  if (!priceId) {
    return NextResponse.json({ error: `Configura STRIPE_PRICE_${plan.toUpperCase()}_MONTHLY` }, { status: 400 });
  }

  const base = appUrl.replace(/\/$/, "");
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      metadata: { uid: uid ?? "", plan },
      subscription_data: { metadata: { uid: uid ?? "", plan } },
      success_url: `${base}/app/abbonamento?checkout=success&plan=${plan}`,
      cancel_url: `${base}/app/abbonamento?checkout=cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore Stripe" }, { status: 500 });
  }
}
