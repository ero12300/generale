import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/plans";

export async function POST() {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({
      demo: true,
      error: "Stripe non configurato",
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

  const session = await stripe.billingPortal.sessions.create({
    customer: "cus_demo",
    return_url: `${appUrl}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
