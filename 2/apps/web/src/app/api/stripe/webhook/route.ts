import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/auth/session";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook non configurato" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Firma non valida" }, { status: 400 });
  }

  const supabase = await getSupabaseClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.organization_id ?? session.client_reference_id;
      const planTier = session.metadata?.plan_tier ?? "pro";

      if (orgId) {
        const { data: plan } = await supabase
          .schema("profit")
          .from("plans")
          .select("id")
          .eq("tier", planTier)
          .single();

        if (plan) {
          const { data: existing } = await supabase
            .schema("profit")
            .from("subscriptions")
            .select("id")
            .eq("organization_id", orgId)
            .maybeSingle();

          const payload = {
            organization_id: orgId,
            plan_id: plan.id,
            status: "active" as const,
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
            stripe_subscription_id:
              typeof session.subscription === "string" ? session.subscription : null,
          };

          if (existing?.id) {
            await supabase
              .schema("profit")
              .from("subscriptions")
              .update(payload)
              .eq("id", existing.id);
          } else {
            await supabase.schema("profit").from("subscriptions").insert(payload);
          }
        }

        if (session.id) {
          await supabase
            .schema("profit")
            .from("payments")
            .update({ status: "paid", paid_at: new Date().toISOString() })
            .eq("stripe_session_id", session.id);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const orgId = sub.metadata?.organization_id;
      if (orgId) {
        await supabase
          .schema("profit")
          .from("subscriptions")
          .update({ status: "cancelled", ends_at: new Date().toISOString() })
          .eq("organization_id", orgId);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
