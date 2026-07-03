"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Crown, Check, Loader2, ExternalLink, RotateCcw } from "lucide-react";
import { PLAN_LIST } from "@/lib/plans";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import { useToast } from "@/components/ui/Toast";
import { formatCents, cn } from "@/lib/format";

export function Billing() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);

  // Gestione del ritorno dal checkout Stripe (o dal fallback demo).
  useEffect(() => {
    const status = searchParams.get("checkout");
    if (status === "success") {
      ws.setPlan("pro");
      toast("Abbonamento Pro attivato. Grazie!", "success");
      router.replace("/dashboard/settings");
    } else if (status === "cancel") {
      toast("Pagamento annullato", "info");
      router.replace("/dashboard/settings");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const upgrade = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      if (data.demo) {
        // Stripe non configurato: simuliamo l'attivazione per dimostrare il flusso.
        ws.setPlan("pro");
        toast("Modalità demo: piano Pro attivato senza pagamento reale.", "success");
      } else {
        toast(data.error ?? "Errore nel checkout", "error");
      }
    } catch {
      toast("Errore di connessione al pagamento", "error");
    } finally {
      setBusy(false);
    }
  };

  const manage = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      toast(data.error ?? "Portale non disponibile in modalità demo.", "info");
    } catch {
      toast("Errore di connessione", "error");
    } finally {
      setBusy(false);
    }
  };

  const isPro = ws.settings.plan === "pro";

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-gold-soft" />
        <h2 className="font-display text-xl text-cream">Piano & abbonamento</h2>
      </div>
      <p className="mt-1 text-sm text-cream/50">
        Piano attuale:{" "}
        <span className={cn("font-medium", isPro ? "text-gold-soft" : "text-cream")}>{ws.plan.name}</span>
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {PLAN_LIST.map((plan) => {
          const current = plan.id === ws.settings.plan;
          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-2xl border p-5",
                current ? "border-gold/50 bg-gold/5" : "border-ink-line bg-ink-soft/40",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-cream">{plan.name}</h3>
                {current ? (
                  <span className="badge border-gold/40 bg-gold-gradient text-ink">Attivo</span>
                ) : null}
              </div>
              <p className="mt-1 font-display text-2xl text-gold-soft">
                {plan.priceCents === 0 ? "Gratis" : `${formatCents(plan.priceCents)}/mese`}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-cream/70">
                {plan.features.filter((f) => f.included).slice(0, 4).map((f) => (
                  <li key={f.label} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-gold-soft" /> {f.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {!isPro ? (
          <button onClick={upgrade} disabled={busy} className="btn-gold">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
            Passa a Pro — {formatCents(PLAN_LIST[1].priceCents)}/mese
          </button>
        ) : (
          <>
            <button onClick={manage} disabled={busy} className="btn-outline-gold">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
              Gestisci abbonamento
            </button>
            <button onClick={() => { ws.setPlan("free"); toast("Tornato al piano Starter", "info"); }} className="btn-ghost">
              <RotateCcw className="h-4 w-4" /> Torna a Starter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
