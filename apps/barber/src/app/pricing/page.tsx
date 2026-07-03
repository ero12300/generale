"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SUBSCRIPTION_PLANS, type SubscriptionPlanId } from "@/lib/stripe/plans";

function PricingContent() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("plan") as SubscriptionPlanId | null;
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(planId: SubscriptionPlanId) {
    if (planId === "starter") {
      window.location.href = "/signup";
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = (await res.json()) as { url?: string; error?: string; demo?: boolean };

      if (data.demo) {
        setError("Stripe non configurato. Configura le chiavi API per abbonamenti reali.");
        setLoading(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "Errore durante il checkout");
        setLoading(null);
      }
    } catch {
      setError("Errore di connessione");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Scegli il piano giusto per te
            </h1>
            <p className="text-cream/60 max-w-xl mx-auto">
              Inizia gratis e scala quando il tuo salone cresce. Pagamenti sicuri con Stripe.
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-400 text-sm text-center max-w-xl mx-auto">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <Card
                key={plan.id}
                className={
                  plan.id === preselected || plan.highlighted
                    ? "border-gold/40 ring-1 ring-gold/20"
                    : ""
                }
              >
                <CardContent className="p-8">
                  {plan.highlighted && (
                    <span className="inline-block text-xs font-medium text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1 mb-4">
                      Consigliato
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-cream/50 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gold">{plan.priceLabel}</span>
                    <span className="text-cream/50 text-sm ml-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-cream/70">
                        <span className="text-gold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full"
                    disabled={loading === plan.id}
                    onClick={() => void handleCheckout(plan.id)}
                  >
                    {loading === plan.id
                      ? "Reindirizzamento..."
                      : plan.id === "starter"
                        ? "Inizia Gratis"
                        : `Abbonati a ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-cream/40 mt-12">
            Pagamenti elaborati in modo sicuro da Stripe. Puoi annullare in qualsiasi momento.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-cream/50">Caricamento...</div>}>
      <PricingContent />
    </Suspense>
  );
}
