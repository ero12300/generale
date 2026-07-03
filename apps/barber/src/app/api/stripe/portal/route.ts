import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { appUrl } from "@/lib/env";

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.json().catch(() => ({} as any));
  const customerId = body?.customerId as string | undefined;

  if (!stripe) {
    return NextResponse.json({ demo: true, message: "Stripe non configurato" }, { status: 200 });
  }
  if (!customerId) {
    return NextResponse.json({ error: "customerId mancante" }, { status: 400 });
  }
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl.replace(/\/$/, "")}/app/abbonamento`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore portale" }, { status: 500 });
  }
}
