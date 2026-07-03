import { NextResponse } from "next/server";
import { BARBER_PRICING_PLANS } from "@/lib/barber/monetization";

export async function GET() {
  return NextResponse.json({ plans: BARBER_PRICING_PLANS });
}
