"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import type { ShopSettings } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export function SubscriptionManager() {
  const searchParams = useSearchParams();
  const esito = searchParams.get("esito");

  const [status, setStatus] = useState<Status>("loading");
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [working, setWorking] = useState(false);
  const [demoActivated, setDemoActivated] = useState(false);

  useEffect(() => {
    getStore()
      .getSettings()
      .then((sett) => {
        setSettings(sett);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare le impostazioni.");
        setStatus("error");
      });
  }, []);

  async function switchPlan(target: "base" | "pro") {
    if (!settings) return;
    setErrorMsg("");
    setWorking(true);
    try {
      if (target === "pro") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "pro" }),
        });
        const data = (await res.json()) as {
          url?: string;
          demo?: boolean;
          error?: string;
        };
        if (!res.ok) {
          setErrorMsg(data.error ?? "Errore durante l'avvio del pagamento.");
          return;
        }
        if (data.url) {
          window.location.href = data.url;
          return;
        }
        // Modalità demo: Stripe non configurato, attiviamo direttamente
        setDemoActivated(true);
      }
      const updated = { ...settings, plan: target };
      await getStore().saveSettings(updated);
      setSettings(updated);
    } catch {
      setErrorMsg("Errore di rete. Riprova.");
    } finally {
      setWorking(false);
    }
  }

  if (status === "loading") {
    return <div className="card animate-pulse text-cream-dim">Caricamento abbonamento…</div>;
  }
  if (status === "error" || !settings) {
    return <div className="card border-red-500/40 text-red-300">{errorMsg}</div>;
  }

  const current = PLANS[settings.plan];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Il tuo abbonamento</h1>
        <p className="mt-1 text-cream-dim">
          Gestisci il piano di BarberOS. I pagamenti sono gestiti in sicurezza da Stripe.
        </p>
      </div>

      {esito === "successo" && (
        <p className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          Pagamento completato! Il piano Pro è attivo. Grazie per la fiducia.
        </p>
      )}
      {esito === "annullato" && (
        <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          Pagamento annullato. Puoi riprovare quando vuoi.
        </p>
      )}
      {demoActivated && (
        <p className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          Modalità demo: piano Pro attivato senza pagamento. Con le chiavi Stripe
          configurate qui partirebbe il checkout reale.
        </p>
      )}
      {errorMsg && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMsg}
        </p>
      )}

      <div className="card border-gold/40">
        <p className="text-xs font-semibold uppercase tracking-widest text-cream-dim">
          Piano attuale
        </p>
        <p className="font-display mt-2 text-3xl font-bold text-gold">
          {current.name}{" "}
          <span className="text-lg font-normal text-cream-dim">
            · {current.priceLabel}
          </span>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = plan.id === settings.plan;
          return (
            <div
              key={plan.id}
              className={`card flex flex-col ${
                plan.id === "pro" ? "border-gold/60" : ""
              }`}
            >
              <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold text-gold">{plan.priceLabel}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-cream-dim">
                    <span aria-hidden className="mt-0.5 text-gold">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={isCurrent || working}
                onClick={() => switchPlan(plan.id)}
                className={`mt-8 ${plan.id === "pro" ? "btn-gold" : "btn-outline"}`}
              >
                {isCurrent
                  ? "Piano attivo"
                  : working
                    ? "Attendere…"
                    : plan.id === "pro"
                      ? "Passa a Pro con Stripe"
                      : "Torna al piano Base"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-cream-dim">
        Nota: in modalità demo (senza chiavi Stripe) il cambio piano è simulato. In
        produzione il pulsante &quot;Passa a Pro&quot; apre il checkout Stripe e il
        webhook attiva automaticamente il piano.
      </p>
    </div>
  );
}
