import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, createStripeCustomer } from "@/lib/stripe";
import { getShop, updateShop } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const { shopId, priceId, successUrl, cancelUrl } = await req.json();

    const shop = await getShop(shopId);
    if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    let customerId = shop.stripeCustomerId;
    if (!customerId) {
      const customer = await createStripeCustomer({
        email: shop.email ?? "",
        name: shop.name,
        shopId: shop.id,
      });
      customerId = customer.id;
      await updateShop(shop.id, { stripeCustomerId: customerId });
    }

    const session = await createCheckoutSession({
      customerId,
      priceId,
      shopId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
