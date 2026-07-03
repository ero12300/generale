"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "29€/mese",
    features: ["Agenda smart", "CRM clienti", "Incassi manuali", "Report base"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "79€/mese",
    features: [
      "Tutto Basic",
      "Campagne referral automatiche",
      "Pagamenti online Stripe",
      "Automazioni reminder premium",
    ],
  },
];

export function BillingPanel() {
  const [loadingPlan, setLoadingPlan] = useState<"basic" | "pro" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: "basic" | "pro") {
    setLoadingPlan(plan);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/barber/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore checkout");
      if (data.checkout_url) {
        window.location.href = data.checkout_url as string;
        return;
      }
      setMessage(data.message ?? "Checkout preparato.");
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Errore checkout");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monetizzazione SaaS</CardTitle>
          <Badge className="bg-amber-600 text-white">Stripe Ready</Badge>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-zinc-300">
            Modello suggerito: abbonamento mensile con piano Basic e Pro + upsell su campagne e
            pagamenti online.
          </p>
          <p className="text-xs text-zinc-500">
            Se Stripe non è configurato, il sistema resta in modalità demo senza bloccare l’operatività.
          </p>
          {message && <p className="text-xs text-emerald-400">{message}</p>}
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.id === "pro" ? "border-amber-700/60" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.id === "pro" && <Badge className="bg-amber-600 text-white">Consigliato</Badge>}
              </CardTitle>
              <p className="text-2xl font-semibold">{plan.price}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {plan.features.map((feature) => (
                <p key={feature} className="text-sm text-zinc-300 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" /> {feature}
                </p>
              ))}
              <Button
                className="w-full"
                variant={plan.id === "pro" ? "default" : "secondary"}
                onClick={() => void startCheckout(plan.id)}
                disabled={loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? "Reindirizzamento..." : `Attiva ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
