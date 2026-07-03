import { NextResponse } from "next/server";
import Stripe from "stripe";

interface CheckoutPayload {
  plan?: "pro";
  customerEmail?: string;
}

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

function getBaseUrl(origin: string | null): string {
  if (origin) return origin;
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const baseUrl = getBaseUrl(request.headers.get("origin"));

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        message:
          "Stripe non configurato. Imposta STRIPE_SECRET_KEY e STRIPE_PRICE_PRO_MONTHLY per il checkout.",
      },
      { status: 400 }
    );
  }

  let payload: CheckoutPayload = {};
  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch {
    payload = {};
  }

  if (payload.plan && payload.plan !== "pro") {
    return NextResponse.json({ message: "Piano non supportato." }, { status: 422 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/barber?checkout=success`,
    cancel_url: `${baseUrl}/barber?checkout=cancel`,
    customer_email: payload.customerEmail,
    metadata: {
      app: "barberos",
      plan: "pro",
    },
  });

  return NextResponse.json({ url: session.url });
}
