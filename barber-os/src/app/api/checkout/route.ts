import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const requestSchema = z.object({
  plan: z.enum(["pro"]),
});

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }

  // Modalità demo: senza chiavi Stripe simuliamo l'attivazione
  if (!secretKey || !priceId) {
    return NextResponse.json({ demo: true });
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/admin/abbonamento?esito=successo`,
      cancel_url: `${appUrl}/admin/abbonamento?esito=annullato`,
      locale: "it",
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Errore creazione sessione Stripe:", error);
    return NextResponse.json(
      { error: "Impossibile avviare il pagamento. Riprova." },
      { status: 500 }
    );
  }
}
