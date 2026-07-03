import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { isStripeConfigured } from "@/lib/stripe";
import { handleRouteError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const store = await getStore();
    const settings = await store.getSettings();
    return NextResponse.json({
      plan: settings.plan,
      plans: Object.values(PLANS),
      stripeConfigured: isStripeConfigured(),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
