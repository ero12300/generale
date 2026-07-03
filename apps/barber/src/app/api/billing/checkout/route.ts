import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";
import { createSubscriptionCheckout, isStripeConfigured } from "@/lib/stripe";
import { handleRouteError, jsonError } from "@/lib/api-helpers";

const checkoutSchema = z.object({
  plan: z.enum(["base", "pro"]),
});

export async function POST(request: NextRequest) {
  try {
    const { plan } = checkoutSchema.parse(await request.json());
    const store = await getStore();

    if (isStripeConfigured()) {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
      const url = await createSubscriptionCheckout(plan, appUrl);
      if (!url) return jsonError("Impossibile creare la sessione Stripe.", 502);
      return NextResponse.json({ url });
    }

    // Modalità demo: senza Stripe l'upgrade è immediato per provare il flusso
    await store.updateSettings({ plan });
    return NextResponse.json({ demo: true, plan });
  } catch (error) {
    return handleRouteError(error);
  }
}
