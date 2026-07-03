import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, priceIdForPlan, stripeConfigured } from "@/lib/stripe";

const bodySchema = z.object({
  plan: z.enum(["base", "pro"]),
});

/**
 * Crea una sessione Stripe Checkout in modalità abbonamento.
 * Se Stripe non è configurato risponde { demo: true } e il client
 * attiva il piano in modalità dimostrativa.
 */
export async function POST(request: Request) {
  let parsed;
  try {
    parsed = bodySchema.safeParse(await request.json());
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }
  const { plan } = parsed.data;

  if (!stripeConfigured()) {
    return NextResponse.json({ demo: true, plan });
  }

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json(
      { error: `Prezzo Stripe non configurato per il piano ${plan}` },
      { status: 500 },
    );
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3100";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { plan },
      subscription_data: { metadata: { plan } },
      success_url: `${origin}/app/abbonamento?success=1&plan=${plan}`,
      cancel_url: `${origin}/app/abbonamento?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore Stripe sconosciuto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
