import { NextResponse } from "next/server";
import { z } from "zod";
import { priceIdForPlan, stripe, stripeConfigured } from "@/lib/stripe/server";
import { getShop, updateShopPlan, DEMO_SHOP_ID } from "@/lib/data/repo";

const bodySchema = z.object({ plan: z.enum(["free", "pro", "business"]) });

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const plan = parsed.data.plan;

  // Se Stripe non è configurato o è un downgrade a free → attivazione simulata locale.
  if (plan === "free" || !stripeConfigured()) {
    await updateShopPlan(DEMO_SHOP_ID, { plan });
    return NextResponse.json({ simulated: true });
  }

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json({ error: "Price ID Stripe non configurato per questo piano" }, { status: 400 });
  }
  const client = stripe();
  if (!client) return NextResponse.json({ simulated: true });

  const shop = await getShop();
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    "http://localhost:3100";

  const session = await client.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/abbonamento?checkout=success`,
    cancel_url: `${origin}/abbonamento?checkout=cancel`,
    metadata: { shopId: shop?.id ?? DEMO_SHOP_ID, plan },
    subscription_data: {
      metadata: { shopId: shop?.id ?? DEMO_SHOP_ID, plan },
    },
    customer_email: shop?.ownerUid ? undefined : undefined,
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
