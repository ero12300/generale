import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { ok, parseBody, validationError } from "@/lib/api-response";
import { checkoutSchema } from "@/lib/validations";
import { PLAN_CATALOG } from "@/lib/plan";

/**
 * Avvia il checkout dell'abbonamento.
 *
 * - Con STRIPE_SECRET_KEY configurata: crea una sessione Stripe Checkout
 *   (subscription) e restituisce l'URL di pagamento reale.
 * - In modalità demo (nessuna chiave): simula l'upgrade aggiornando il piano
 *   nello store e restituisce un URL di ritorno locale.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = parseBody(checkoutSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const plan = parsed.data.plan;
  const origin = new URL(request.url).origin;
  const secret = process.env.STRIPE_SECRET_KEY;

  // Downgrade / piano gratuito: nessun pagamento necessario.
  if (plan === "base") {
    store.setPlan("base");
    return ok({ demo: true, url: `${origin}/abbonamento?downgraded=1` });
  }

  const catalog = PLAN_CATALOG.find((p) => p.id === plan);
  const priceEuro = catalog?.priceMonthly ?? 29;

  if (!secret) {
    // Modalità demo: attiva subito il piano Pro per dimostrare il flusso.
    store.setPlan("pro");
    return ok({ demo: true, url: `${origin}/abbonamento?success=1&demo=1` });
  }

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secret);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        process.env.STRIPE_PRICE_PRO
          ? { price: process.env.STRIPE_PRICE_PRO, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "eur",
                recurring: { interval: "month" },
                unit_amount: Math.round(priceEuro * 100),
                product_data: {
                  name: "Lama d'Oro — Piano Pro",
                },
              },
            },
      ],
      success_url: `${origin}/abbonamento?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/abbonamento?canceled=1`,
    });

    return ok({ demo: false, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore Stripe";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
