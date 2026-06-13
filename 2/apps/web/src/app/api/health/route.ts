import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ristoprofit-os",
    stripe: {
      secret_key: Boolean(process.env.STRIPE_SECRET_KEY),
      publishable_key: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      webhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      livemode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ?? false,
    },
  });
}
