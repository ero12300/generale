import Stripe from "stripe";
import { NextResponse } from "next/server";
import { requireAuthContext, getSupabaseClient } from "@/lib/auth/session";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configurato. Imposta STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  try {
    const auth = await requireAuthContext();
    const body = await request.json();
    const tier = (body.tier as string) ?? "pro";

    const supabase = await getSupabaseClient();
    const { data: plan, error: planError } = await supabase
      .schema("profit")
      .from("plans")
      .select("*")
      .eq("tier", tier)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Piano non trovato" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (plan.stripe_price_id) {
      lineItems.push({ price: plan.stripe_price_id, quantity: 1 });
    } else {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `RistoProfit ${plan.name} — Canone mensile`,
            description: "Abbonamento mensile RistoProfit OS",
          },
          unit_amount: plan.monthly_price_cents,
          recurring: { interval: "month" },
        },
        quantity: 1,
      });
    }

    if (plan.setup_price_cents > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `RistoProfit ${plan.name} — Setup iniziale`,
          },
          unit_amount: plan.setup_price_cents,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${appUrl}/app/impostazioni?checkout=success`,
      cancel_url: `${appUrl}/prezzi?checkout=cancelled`,
      client_reference_id: auth.organizationId,
      customer_email: auth.email ?? undefined,
      metadata: {
        organization_id: auth.organizationId,
        plan_tier: tier,
      },
      subscription_data: {
        metadata: {
          organization_id: auth.organizationId,
          plan_tier: tier,
        },
      },
    });

    await supabase.schema("profit").from("payments").insert({
      organization_id: auth.organizationId,
      amount_cents: plan.monthly_price_cents + plan.setup_price_cents,
      payment_type: "subscription",
      method: "stripe",
      status: "pending",
      stripe_session_id: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Errore Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
