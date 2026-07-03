"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Sparkles, ExternalLink, X } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store/store-context";
import { PLAN_LIST, PLANS } from "@/lib/plans";

export default function AbbonamentoPage() {
  const { state, setPlan } = useStore();
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ tone: "ok" | "info"; text: string } | null>(null);

  const currentPlan = state.subscription.plan;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgrade") === "success") {
      setPlan("pro", {
        status: "trialing",
        currentPeriodEnd: new Date(Date.now() + 14 * 864e5).toISOString(),
      });
      setBanner({
        tone: "ok",
        text: params.get("demo")
          ? "Upgrade a Pro simulato (modalità demo). Collega Stripe per pagamenti reali."
          : "Benvenuto in Pro! Il tuo abbonamento è attivo.",
      });
      window.history.replaceState({}, "", "/dashboard/abbonamento");
    } else if (params.get("upgrade") === "cancelled") {
      setBanner({ tone: "info", text: "Upgrade annullato. Puoi riprovare quando vuoi." });
      window.history.replaceState({}, "", "/dashboard/abbonamento");
    }
  }, [setPlan]);

  async function upgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBanner({ tone: "info", text: data.error ?? "Impossibile avviare il checkout." });
      }
    } catch {
      setBanner({ tone: "info", text: "Errore di rete durante il checkout." });
    } finally {
      setLoading(false);
    }
  }

  function downgrade() {
    setPlan("free", { status: "canceled", currentPeriodEnd: undefined });
    setBanner({ tone: "info", text: "Sei tornato al piano Start." });
  }

  return (
    <div className="p-5 md:p-8">
      <PageHeader
        title="Abbonamento"
        subtitle="Scegli il piano giusto per la tua barberia. Cresci senza limiti."
      />

      {banner && (
        <div className={`mb-5 flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
          banner.tone === "ok"
            ? "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
            : "border-border bg-surface text-muted"
        }`}>
          <span className="flex items-center gap-2"><Sparkles size={16} /> {banner.text}</span>
          <button onClick={() => setBanner(null)} aria-label="Chiudi"><X size={16} /></button>
        </div>
      )}

      {/* Current status */}
      <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm text-muted">Piano attuale</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold">{PLANS[currentPlan].name}</span>
            {currentPlan === "pro" ? <Badge tone="gold"><Crown size={11} /> Pro</Badge> : <Badge tone="gray">Gratuito</Badge>}
          </div>
          {state.subscription.currentPeriodEnd && (
            <div className="mt-1 text-xs text-muted">
              {state.subscription.status === "trialing" ? "Prova gratuita fino al " : "Rinnovo il "}
              {new Date(state.subscription.currentPeriodEnd).toLocaleDateString("it-IT")}
            </div>
          )}
        </div>
        {currentPlan === "pro" ? (
          <Button variant="subtle" onClick={downgrade}>Torna a Start</Button>
        ) : (
          <Button onClick={upgrade} disabled={loading}>
            <Crown size={16} /> {loading ? "Attendere…" : "Passa a Pro"}
          </Button>
        )}
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        {PLAN_LIST.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-7 ${
                plan.highlight
                  ? "border-[var(--gold-deep)] bg-gradient-to-b from-[var(--gold)]/10 to-transparent"
                  : "border-border bg-surface"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full gold-gradient px-3 py-1 text-xs font-semibold text-[#0b0b0f]">
                  <Crown size={12} /> Consigliato
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.priceLabel}</span>
                <span className="mb-1 text-sm text-muted">/mese</span>
              </div>

              {isCurrent ? (
                <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm text-muted">
                  <Check size={16} /> Piano attivo
                </div>
              ) : plan.id === "pro" ? (
                <Button className="mt-6 w-full" onClick={upgrade} disabled={loading}>
                  <Crown size={16} /> {loading ? "Attendere…" : "Passa a Pro"}
                </Button>
              ) : (
                <Button className="mt-6 w-full" variant="subtle" onClick={downgrade}>Scegli Start</Button>
              )}

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={17} className="mt-0.5 shrink-0 text-[var(--gold)]" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <Card className="mt-6">
        <div className="flex items-start gap-3">
          <ExternalLink size={18} className="mt-0.5 text-[var(--gold)]" />
          <div className="text-sm text-muted">
            <p className="font-medium text-foreground">Pagamenti con Stripe</p>
            <p className="mt-1">
              I pagamenti sono gestiti in modo sicuro da Stripe. In modalità demo l&apos;upgrade è simulato;
              collegando le chiavi Stripe (<span className="font-mono">STRIPE_SECRET_KEY</span> e
              {" "}<span className="font-mono">STRIPE_PRICE_PRO_MONTHLY</span>) i pagamenti diventano reali,
              con prova gratuita di 14 giorni.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
