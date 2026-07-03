"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Check,
  CircleAlert,
  CreditCard,
  Loader2,
} from "lucide-react";
import type { PlanId } from "@/lib/types";
import type { PlanDefinition } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { cn } from "@/lib/cn";

interface BillingInfo {
  plan: PlanId;
  plans: PlanDefinition[];
  stripeConfigured: boolean;
}

export function BillingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const esito = searchParams.get("esito");

  const [info, setInfo] = useState<BillingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyPlan, setBusyPlan] = useState<PlanId | null>(null);
  const [upgraded, setUpgraded] = useState(false);

  const load = useCallback(() => {
    fetch("/api/billing")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setInfo)
      .catch(() => setError("Impossibile caricare i dati di fatturazione."));
  }, []);

  useEffect(load, [load]);

  async function subscribe(plan: PlanId) {
    setBusyPlan(plan);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Errore durante l'attivazione.");
        return;
      }
      if (data.url) {
        // Stripe configurato: redirect al checkout reale
        window.location.href = data.url;
        return;
      }
      // Modalità demo: piano aggiornato subito
      setUpgraded(true);
      load();
      router.refresh();
    } catch {
      setError("Connessione non riuscita.");
    } finally {
      setBusyPlan(null);
    }
  }

  if (error && !info) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-danger/40 bg-surface p-5 text-danger">
        <CircleAlert className="h-5 w-5" aria-hidden /> {error}
      </p>
    );
  }

  if (!info) {
    return (
      <p className="flex items-center gap-2 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Caricamento…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {(esito === "successo" || upgraded) && (
        <p className="flex items-center gap-2 rounded-2xl border border-emerald-800 bg-surface p-4 text-sm text-success" role="status">
          <BadgeCheck className="h-5 w-5 shrink-0" aria-hidden />
          Piano attivato con successo! Tutte le funzioni sono ora disponibili.
        </p>
      )}
      {esito === "annullato" && (
        <p className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-sm text-muted" role="status">
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden />
          Pagamento annullato. Puoi riprovare quando vuoi.
        </p>
      )}
      {error && (
        <p className="flex items-center gap-2 rounded-2xl border border-danger/40 bg-surface p-4 text-sm text-danger" role="alert">
          <CircleAlert className="h-5 w-5 shrink-0" aria-hidden /> {error}
        </p>
      )}

      {!info.stripeConfigured && (
        <p className="rounded-2xl border border-gold-dim/40 bg-surface p-4 text-sm text-muted">
          <strong className="text-gold-soft">Modalità demo:</strong> Stripe non
          è configurato, quindi il cambio piano è immediato e gratuito. In
          produzione, configura le chiavi Stripe in <code>.env</code> per
          attivare il checkout reale con carta.
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {info.plans.map((plan) => {
          const isCurrent = plan.id === info.plan;
          const isPro = plan.id === "pro";
          return (
            <article
              key={plan.id}
              className={cn(
                "relative rounded-2xl border bg-surface p-7",
                isCurrent
                  ? "border-gold shadow-[0_0_40px_rgba(201,162,39,0.1)]"
                  : "border-border",
              )}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-background">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Piano attivo
                </span>
              )}
              <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <p className="mt-4">
                <span className="font-display text-4xl font-bold text-gold-soft">
                  {formatEuro(plan.priceMonthlyCents)}
                </span>
                <span className="text-sm text-muted"> /mese</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent || busyPlan !== null}
                onClick={() => subscribe(plan.id)}
                className={cn(
                  "mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3 font-bold transition-colors",
                  isCurrent
                    ? "cursor-default border border-border text-muted"
                    : isPro
                      ? "bg-gold text-background hover:bg-gold-soft"
                      : "border border-gold-dim text-gold-soft hover:bg-gold hover:text-background",
                  busyPlan !== null && !isCurrent && "opacity-60",
                )}
              >
                {busyPlan === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  !isCurrent && <CreditCard className="h-4 w-4" aria-hidden />
                )}
                {isCurrent
                  ? "Il tuo piano attuale"
                  : `Attiva ${plan.name} con Stripe`}
              </button>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
        <h3 className="mb-2 font-semibold text-foreground">
          Come funziona la monetizzazione
        </h3>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            Ogni barbershop che usa BarberOS paga un abbonamento mensile
            ricorrente gestito da <strong className="text-foreground">Stripe Billing</strong>.
          </li>
          <li>
            Il piano <strong className="text-foreground">Base (€19/mese)</strong> copre
            prenotazioni, agenda, incassi e clienti.
          </li>
          <li>
            Il piano <strong className="text-foreground">Pro (€49/mese)</strong> sblocca
            campagne sconto, programma referral e report avanzati.
          </li>
          <li>
            I webhook Stripe attivano o disattivano automaticamente le funzioni
            quando l&apos;abbonamento cambia o viene annullato.
          </li>
        </ul>
      </div>
    </div>
  );
}
