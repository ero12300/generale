"use client";

import { useState, useEffect } from "react";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

export default function AbbonamentoPage() {
  const { data, setPlan } = useStore();
  const current = data.subscription.plan;
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setPlan("pro");
      setMessage("Pagamento completato! Il piano Pro è attivo.");
    } else if (params.get("checkout") === "cancel") {
      setMessage("Checkout annullato. Nessun addebito effettuato.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function choosePlan(plan: PlanId) {
    setMessage(null);
    if (plan === current) return;
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, organizationId: data.organization.id }),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url as string;
        return;
      }
      // Modalità simulata (nessuna chiave Stripe): applica localmente.
      setPlan(plan);
      setMessage(
        plan === "pro"
          ? "Piano Pro attivato in modalità demo. Configura Stripe per i pagamenti reali."
          : "Sei passato al piano Base."
      );
    } catch {
      setMessage("Si è verificato un errore. Riprova.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Abbonamento"
        subtitle="Scegli il piano più adatto alla crescita del tuo salone."
      />

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <Crown className="h-5 w-5 text-amber-400" />
        <div className="flex-1">
          <p className="text-sm">
            Piano attuale:{" "}
            <strong className="text-amber-300">
              {current === "pro" ? "Pro" : "Base"}
            </strong>{" "}
            <Badge variant={data.subscription.status === "active" ? "success" : "warning"}>
              {data.subscription.status === "trialing"
                ? "In prova"
                : data.subscription.status === "active"
                  ? "Attivo"
                  : "Annullato"}
            </Badge>
          </p>
          {data.subscription.renewsAt && (
            <p className="text-xs text-zinc-500">
              Rinnovo: {new Date(data.subscription.renewsAt).toLocaleDateString("it-IT")}
            </p>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
          <Sparkles className="h-4 w-4" /> {message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === current;
          return (
            <Card
              key={plan.id}
              className={plan.highlighted ? "border-amber-500/50" : undefined}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  {plan.highlighted && <Badge>Consigliato</Badge>}
                </div>
                <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.priceLabel}</span>
                  {plan.priceCents > 0 && <span className="mb-1 text-zinc-400">/mese</span>}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={isCurrent ? "outline" : plan.highlighted ? "default" : "secondary"}
                  disabled={isCurrent || loading !== null}
                  onClick={() => choosePlan(plan.id)}
                >
                  {loading === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isCurrent
                    ? "Piano attivo"
                    : plan.id === "pro"
                      ? "Passa a Pro"
                      : "Torna a Base"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-500">
        Pagamenti gestiti in sicurezza con Stripe. Puoi disdire in qualsiasi momento.
        In modalità demo l&apos;upgrade è simulato senza addebito reale.
      </p>
    </div>
  );
}
