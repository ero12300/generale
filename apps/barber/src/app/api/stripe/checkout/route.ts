import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured, priceIdForTier } from "@/lib/stripe";

const BodySchema = z.object({
  tier: z.enum(["free", "pro", "elite"]),
  orgId: z.string().optional(),
  orgName: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
    }
    const { tier, orgId, orgName, successUrl, cancelUrl } = parsed.data;

    if (tier === "free") {
      return NextResponse.json({ demo: true, tier });
    }

    if (!isStripeConfigured) {
      return NextResponse.json({
        demo: true,
        tier,
        message: "Stripe non configurato. In demo l'upgrade è simulato.",
      });
    }

    const priceId = priceIdForTier(tier);
    if (!priceId) {
      return NextResponse.json(
        { error: `Price ID mancante per il tier ${tier}. Configura STRIPE_PRICE_${tier.toUpperCase()}.` },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe non inizializzato" }, { status: 500 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl ?? `${origin}/impostazioni?checkout=success&tier=${tier}`,
      cancel_url: cancelUrl ?? `${origin}/impostazioni?checkout=cancel`,
      metadata: { orgId: orgId ?? "", orgName: orgName ?? "", tier },
      subscription_data: {
        metadata: { orgId: orgId ?? "", tier },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    const msg = err instanceof Error ? err.message : "Errore sconosciuto";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
