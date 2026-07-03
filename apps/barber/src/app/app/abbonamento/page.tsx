"use client";

import { Check, CreditCard, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  SectionHeading,
  Spinner,
} from "@/components/ui";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import { PLANS, type PlanId } from "@/lib/types";

export default function AbbonamentoPage() {
  return (
    <Suspense fallback={<Spinner label="Carico l'abbonamento…" />}>
      <AbbonamentoContent />
    </Suspense>
  );
}

function AbbonamentoContent() {
  const { state, loading, setPlan, resetDemo } = useStore();
  const searchParams = useSearchParams();
  const [busyPlan, setBusyPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Ritorno dal Checkout Stripe: ?success=1&plan=pro
  useEffect(() => {
    const success = searchParams.get("success");
    const planParam = searchParams.get("plan");
    if (success === "1" && (planParam === "base" || planParam === "pro")) {
      setPlan(planParam);
      setNotice(
        `Pagamento riuscito: piano ${PLANS[planParam].label} attivato. Grazie!`,
      );
    } else if (searchParams.get("canceled") === "1") {
      setNotice("Pagamento annullato: nessun addebito effettuato.");
    }
    // setPlan cambia identità quando lo stato si aggiorna: eseguiamo solo sul cambio dei parametri URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (loading || !state) return <Spinner label="Carico l'abbonamento…" />;

  const currentPlan = PLANS[state.settings.plan];

  async function activate(plan: PlanId) {
    setError(null);
    setNotice(null);
    setBusyPlan(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as {
        url?: string;
        demo?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Errore durante la creazione del pagamento");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.demo) {
        setPlan(plan);
        setNotice(
          `Modalità demo: piano ${PLANS[plan].label} attivato senza pagamento. Configura le chiavi Stripe per incassare davvero.`,
        );
      }
    } catch {
      setError("Impossibile contattare il server dei pagamenti");
    } finally {
      setBusyPlan(null);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Abbonamento"
        title="Il tuo piano BarberSuite"
        subtitle="La monetizzazione del gestionale passa da Stripe: abbonamento mensile ricorrente, upgrade e downgrade quando vuoi."
      />

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-cream/40">
            Piano attuale
          </p>
          <p className="font-display text-2xl text-cream">
            {currentPlan.label}{" "}
            <span className="text-base text-gold-300">
              {formatEuro(currentPlan.priceMonthlyCents)}/mese
            </span>
          </p>
        </div>
        <Badge tone={state.settings.subscriptionStatus === "active" ? "green" : "gold"}>
          {state.settings.subscriptionStatus === "active"
            ? "Attivo"
            : state.settings.subscriptionStatus === "trialing"
              ? "Periodo di prova"
              : "Cancellato"}
        </Badge>
      </Card>

      {notice ? (
        <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = plan.id === state.settings.plan;
          return (
            <Card
              key={plan.id}
              className={isCurrent ? "border-gold-500/50" : undefined}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-cream">{plan.label}</h3>
                {isCurrent ? <Badge tone="gold">In uso</Badge> : null}
              </div>
              <p className="mt-1">
                <span className="font-display text-3xl text-gold-400">
                  {formatEuro(plan.priceMonthlyCents)}
                </span>
                <span className="text-sm text-cream/50"> /mese</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-cream/70">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-gold-400" aria-hidden />
                  {plan.maxCustomers === null
                    ? "Clienti illimitati"
                    : `Fino a ${plan.maxCustomers} clienti`}
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-gold-400" aria-hidden />
                  {plan.campaigns
                    ? "Campagne sconto e referral"
                    : "Solo prenotazioni e cassa"}
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-gold-400" aria-hidden />
                  {plan.csvExport ? "Export CSV incassi" : "Report a schermo"}
                </li>
              </ul>
              <Button
                className="mt-6 w-full"
                variant={plan.id === "pro" ? "primary" : "outline"}
                disabled={isCurrent || busyPlan !== null}
                onClick={() => activate(plan.id)}
              >
                <CreditCard className="h-4 w-4" aria-hidden />
                {busyPlan === plan.id
                  ? "Apro il pagamento…"
                  : isCurrent
                    ? "Piano attivo"
                    : `Attiva ${plan.label}`}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-cream">Dati dimostrativi</p>
          <p className="text-xs text-cream/50">
            Riporta l&apos;app allo stato iniziale con dati di esempio.
          </p>
        </div>
        <Button variant="outline" onClick={resetDemo}>
          <RefreshCw className="h-4 w-4" aria-hidden /> Reset demo
        </Button>
      </Card>
    </div>
  );
}
