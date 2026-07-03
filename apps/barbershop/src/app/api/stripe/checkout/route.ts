import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  plan: z.enum(["base", "pro"]),
  organizationId: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Parametri non validi" }, { status: 400 });
  }
  const { plan, email } = parsed.data;

  // Modalità simulata: nessuna chiave Stripe configurata.
  if (!isStripeConfigured() || plan === "base") {
    return NextResponse.json({ simulated: true, plan });
  }

  const priceId = process.env.STRIPE_PRICE_PRO;
  if (!priceId) {
    return NextResponse.json({ simulated: true, plan, reason: "STRIPE_PRICE_PRO mancante" });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ simulated: true, plan });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${appUrl}/abbonamento?checkout=success`,
      cancel_url: `${appUrl}/abbonamento?checkout=cancel`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "Errore nella creazione del checkout" }, { status: 500 });
  }
}
