import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { jsonError, jsonOk } from "@/lib/api-response";
import { buildCheckoutLineItems, isCheckoutPlan } from "@/lib/stripe/plans";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";

const checkoutSchema = z.object({
  plan: z.enum(["start", "pro", "premium"]),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return jsonError("Pagamenti non configurati. Contatta il supporto.", 503);
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Piano non valido");
  }

  const { plan } = parsed.data;
  if (!isCheckoutPlan(plan)) {
    return jsonError("Piano non disponibile online");
  }

  const session = await getSession();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
  const stripe = getStripe();

  const metadata: Record<string, string> = { plan };
  if (session.orgId) metadata.organization_id = session.orgId;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: buildCheckoutLineItems(plan),
    success_url: `${appUrl}/pacchetti/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pacchetti?cancelled=1`,
    customer_email: session.email ?? undefined,
    metadata,
    subscription_data: { metadata },
    allow_promotion_codes: true,
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    locale: "it",
  });

  if (!checkoutSession.url) {
    return jsonError("Impossibile avviare il pagamento", 500);
  }

  return jsonOk({ url: checkoutSession.url });
}
