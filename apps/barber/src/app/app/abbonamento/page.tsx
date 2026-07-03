"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/app/topbar";
import { useOpenNav } from "@/app/app/nav-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { PLANS } from "@/lib/plans";
import { Check, ExternalLink, Sparkles } from "lucide-react";
import type { PlanId } from "@/types";
import { cn } from "@/lib/utils";
import { isStripeConfigured } from "@/lib/env";

export default function AbbonamentoPageWrapper() {
  return (
    <Suspense fallback={null}>
      <AbbonamentoPage />
    </Suspense>
  );
}

function AbbonamentoPage() {
  const { user, setPlan } = useAuth();
  const openNav = useOpenNav();
  const toast = useToast();
  const search = useSearchParams();
  const [loading, setLoading] = useState<PlanId | null>(null);

  useEffect(() => {
    const status = search.get("checkout");
    const plan = search.get("plan") as PlanId | null;
    const upgrade = search.get("upgrade") as PlanId | null;
    if (status === "success" && plan && plan !== "free") {
      setPlan(plan);
      toast.success(`Piano ${PLANS[plan].name} attivato`, "Le funzioni sono già sbloccate.");
    } else if (status === "cancel") {
      toast.info("Checkout annullato");
    } else if (upgrade && (upgrade === "base" || upgrade === "pro")) {
      startCheckout(upgrade);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCheckout = async (plan: PlanId) => {
    if (plan === "free") {
      setPlan("free");
      toast.success("Piano Free attivato");
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, uid: user?.uid, email: user?.email }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else if (data?.demo) {
        setPlan(plan);
        toast.info(`Attivato ${PLANS[plan].name} in demo`, "Configura Stripe per pagamenti reali.");
      } else {
        toast.error("Checkout non disponibile", data?.error ?? "");
      }
    } finally {
      setLoading(null);
    }
  };

  const openPortal = async () => {
    setLoading("pro");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerId: user?.stripeCustomerId }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else toast.info("Portale non disponibile", data?.error ?? "Modalità demo");
    } finally {
      setLoading(null);
    }
  };

  const activePlan = user?.plan ?? "free";
  const plans: PlanId[] = ["free", "base", "pro"];

  return (
    <>
      <Topbar
        title="Abbonamento"
        subtitle="Passa Base ↔ Pro quando vuoi. Nessuna carta per Free e demo."
        onOpenNav={openNav}
      />

      <Card className="mb-6 gold-border">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-white/50">Piano attivo</span>
              <Badge tone={activePlan === "pro" ? "gold" : activePlan === "base" ? "success" : "muted"}>
                {PLANS[activePlan].name}
              </Badge>
            </div>
            <div className="mt-1 font-display text-2xl text-white">
              {activePlan === "free" ? "Sei sul piano gratuito" : PLANS[activePlan].tagline}
            </div>
          </div>
          {activePlan !== "free" && (
            <Button variant="outline" onClick={openPortal} disabled={loading !== null}>
              <ExternalLink className="h-4 w-4" /> Gestisci fatturazione
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((id) => {
          const p = PLANS[id];
          const active = id === activePlan;
          return (
            <Card
              key={id}
              className={cn("relative flex flex-col", p.highlight && "gold-border shadow-[0_30px_80px_-30px_rgba(217,163,38,0.35)]")}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-[color:var(--color-gold-300)] to-[color:var(--color-gold-500)] px-3 py-1 text-[10px] uppercase tracking-widest text-[color:var(--color-ink-900)]">
                  <Sparkles className="h-3 w-3" /> Più scelto
                </div>
              )}
              <CardHeader>
                <div>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>{p.tagline}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl text-white">{p.monthlyEur === 0 ? "Free" : `€${p.monthlyEur}`}</div>
                  {p.monthlyEur !== 0 && <div className="text-xs text-white/50">al mese</div>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-white/85">
                      <Check className="mt-0.5 h-4 w-4 text-[color:var(--color-gold-300)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="mt-4">
                {active ? (
                  <Button variant="outline" className="w-full" disabled>Piano attivo</Button>
                ) : (
                  <Button
                    variant={p.highlight ? "gold" : "outline"}
                    className="w-full"
                    onClick={() => startCheckout(id)}
                    disabled={loading !== null}
                  >
                    {loading === id ? "Attendi…" : id === "free" ? "Passa a Free" : `Attiva ${p.name}`}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-white/40">
        {isStripeConfigured
          ? "Pagamenti gestiti da Stripe. Puoi annullare in qualsiasi momento dal portale fatturazione."
          : "Stripe non è configurato: i cambi piano funzionano in modalità demo. Aggiungi STRIPE_SECRET_KEY per pagamenti reali."}
      </p>
    </>
  );
}
