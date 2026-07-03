import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession } from "@/lib/stripe";
import { getShop } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const { shopId, returnUrl } = await req.json();

    const shop = await getShop(shopId);
    if (!shop?.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer" }, { status: 400 });
    }

    const session = await createCustomerPortalSession({
      customerId: shop.stripeCustomerId,
      returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
