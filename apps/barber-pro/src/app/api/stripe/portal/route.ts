import { NextResponse } from "next/server";
import { stripe, stripeConfigured } from "@/lib/stripe/server";
import { getShop } from "@/lib/data/repo";

export async function POST(req: Request) {
  if (!stripeConfigured()) return NextResponse.json({ simulated: true });
  const client = stripe();
  if (!client) return NextResponse.json({ simulated: true });
  const shop = await getShop();
  if (!shop?.stripeCustomerId) {
    return NextResponse.json({ error: "Nessun cliente Stripe collegato" }, { status: 400 });
  }
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    req.headers.get("origin") ||
    "http://localhost:3100";
  const portal = await client.billingPortal.sessions.create({
    customer: shop.stripeCustomerId,
    return_url: `${origin}/abbonamento`,
  });
  return NextResponse.json({ url: portal.url });
}
