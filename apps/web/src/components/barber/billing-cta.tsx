"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import type { SubscriptionTier } from "@deal-desk/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/lib/utils";

export function BillingCta({ tiers }: { tiers: SubscriptionTier[] }) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier["id"]>("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; message: string }
  >({ status: "idle" });

  async function handleCheckout() {
    setState({ status: "loading" });

    const response = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: selectedPlan,
        billingCycle,
        originPath: "/growth",
      }),
    });

    const data = (await response.json()) as
      | { ok: false; error: string }
      | { ok: true; checkoutUrl: string; mode: "preview" | "live"; message?: string };

    if (!response.ok || !data.ok) {
      setState({
        status: "error",
        message: "Errore creazione checkout. Verifica configurazione Stripe.",
      });
      return;
    }

    if (data.mode === "preview") {
      setState({
        status: "success",
        message: data.message ?? "Modalita anteprima attiva: collega Stripe per il go-live.",
      });
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="grid gap-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-white/10 bg-black/30 p-1">
            {(["monthly", "yearly"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  billingCycle === cycle ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                }`}
              >
                {cycle === "monthly" ? "Mensile" : "Annuale"}
              </button>
            ))}
          </div>
          <p className="text-sm text-zinc-400">Flow Stripe pronto per SaaS Basic / Pro / Multi-location.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => {
            const price =
              billingCycle === "monthly" ? tier.monthly_price_cents : tier.yearly_price_cents;
            const isActive = selectedPlan === tier.id;

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedPlan(tier.id)}
                className={`rounded-3xl border p-5 text-left transition ${
                  isActive
                    ? "border-amber-400/60 bg-amber-500/10 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "border-white/10 bg-black/30 hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">{tier.name}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{formatCurrencyFromCents(price)}</p>
                <p className="mt-2 text-sm text-zinc-400">{tier.target}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleCheckout} className="min-w-48">
            {state.status === "loading" ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                Creo checkout
              </>
            ) : (
              <>
                Avvia monetizzazione
                <ArrowRight className="h-4 w-4" aria-hidden />
              </>
            )}
          </Button>
          <p className="text-sm text-zinc-400">
            Depositi, abbonamenti e billing portal possono vivere tutti dentro Stripe.
          </p>
        </div>

        {state.status === "error" && (
          <div className="flex items-start gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <TriangleAlert className="mt-0.5 h-4 w-4 text-rose-300" aria-hidden />
            <span>{state.message}</span>
          </div>
        )}

        {state.status === "success" && (
          <div className="flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" aria-hidden />
            <span>{state.message}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
