"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { apiGet, apiSend } from "@/lib/client-api";
import { PLAN_CATALOG } from "@/lib/plan";
import { formatCurrencyShort } from "@/lib/utils";
import type { Organization, Plan } from "@/lib/types";

function AbbonamentoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const cat = await apiGet<{ org: Organization }>("/api/catalog");
    setOrg(cat.org);
  }, []);

  useEffect(() => {
    reload().catch((e) => setError(e.message));
  }, [reload]);

  useEffect(() => {
    if (params.get("success")) {
      setNotice(
        params.get("demo")
          ? "Piano Pro attivato in modalità demo. In produzione qui avviene il pagamento Stripe reale."
          : "Pagamento completato! Il piano Pro è attivo."
      );
      reload();
    } else if (params.get("downgraded")) {
      setNotice("Sei tornato al piano Base.");
    } else if (params.get("canceled")) {
      setError("Pagamento annullato.");
    }
  }, [params, reload]);

  async function choosePlan(plan: Plan) {
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await apiSend<{ url: string; demo: boolean }>(
        "/api/billing/checkout",
        "POST",
        { plan }
      );
      if (res.url) {
        // In demo l'URL è locale; con Stripe è l'URL di pagamento.
        window.location.href = res.url;
      } else {
        await reload();
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setLoadingPlan(null);
    }
  }

  const currentPlan = org?.plan ?? "base";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Abbonamento</h1>
        <p className="mt-1 text-zinc-400">
          Piano attuale:{" "}
          <Badge variant={currentPlan === "pro" ? "default" : "secondary"}>
            {currentPlan === "pro" ? "PRO" : "BASE"}
          </Badge>
        </p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-600/40 bg-emerald-600/10 px-4 py-3 text-emerald-300">
          <Sparkles className="h-4 w-4" /> {notice}
        </div>
      )}
      {error && (
        <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {PLAN_CATALOG.map((plan) => {
          const isPro = plan.id === "pro";
          const isCurrent = plan.id === currentPlan;
          return (
            <Card
              key={plan.id}
              className={isPro ? "border-[#c9a24b]/50" : undefined}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold">{plan.name}</h2>
                  {isPro && <Crown className="h-5 w-5 text-gold-soft" />}
                </div>
                <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold">
                    {plan.priceMonthly === 0 ? "Gratis" : formatCurrencyShort(plan.priceMonthly)}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="mb-1 text-sm text-zinc-500">/ mese</span>
                  )}
                </div>
                <ul className="mt-6 space-y-2.5">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={isPro ? "default" : "secondary"}
                  disabled={isCurrent || loadingPlan !== null}
                  onClick={() => choosePlan(plan.id)}
                >
                  {isCurrent
                    ? "Piano attuale"
                    : loadingPlan === plan.id
                      ? "Attendere…"
                      : plan.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-500">
        Pagamenti gestiti in modo sicuro tramite Stripe. Puoi disdire quando vuoi.
      </p>
    </div>
  );
}

export default function AbbonamentoPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-zinc-800/60" />}>
      <AbbonamentoContent />
    </Suspense>
  );
}
