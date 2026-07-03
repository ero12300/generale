"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Check, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { formatEuro, cn } from "@/lib/utils";
import { useShopData } from "@/hooks/use-shop-data";
import { demoStore } from "@/lib/demo-store";
import { toast } from "@/components/ui/toaster";
import type { PlanTier } from "@/types";

export default function SubscriptionPage() {
  return (
    <React.Suspense fallback={<div className="text-ink-400">Caricamento…</div>}>
      <SubscriptionInner />
    </React.Suspense>
  );
}

function SubscriptionInner() {
  const params = useSearchParams();
  const { shop } = useShopData();
  const [loading, setLoading] = React.useState<PlanTier | null>(null);

  // Se torniamo da un checkout demo, upgradare localmente per far vedere il piano
  React.useEffect(() => {
    if (params.get("demo") === "1") {
      const plan = params.get("plan") as PlanTier | null;
      if (plan && (plan === "pro" || plan === "business")) {
        demoStore.updateShop({ plan });
        toast({
          title: "Piano attivato (demo)",
          description: `Sei ora sul piano ${PLANS[plan].name}. In produzione questo passa da Stripe.`,
          variant: "success",
        });
      }
    }
    if (params.get("success") === "1") {
      toast({
        title: "Abbonamento attivo",
        description: "Grazie! Il webhook Stripe aggiornerà il tuo piano tra pochi secondi.",
        variant: "success",
      });
    }
    if (params.get("cancelled") === "1") {
      toast({ title: "Checkout annullato", variant: "info" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function subscribe(tier: PlanTier) {
    if (tier === "free") {
      demoStore.updateShop({ plan: "free" });
      toast({ title: "Passato al piano Starter", variant: "info" });
      return;
    }
    setLoading(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Errore",
          description: data.error ?? "Impossibile avviare il checkout",
          variant: "error",
        });
      }
    } catch (err) {
      toast({
        title: "Errore",
        description: (err as Error).message,
        variant: "error",
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="glass-strong rounded-xl p-6 border-[color:var(--color-gold-500)]/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-300)] mb-1">
            Piano attivo
          </div>
          <div className="font-display text-3xl text-ink-50 flex items-center gap-3">
            {PLANS[shop.plan].name}
            {shop.plan === "pro" && <Sparkles className="h-6 w-6 text-[color:var(--color-gold-400)]" />}
          </div>
          <div className="text-sm text-ink-400 mt-1">
            {shop.plan === "free"
              ? "Piano gratuito — passa a Pro per sbloccare tutte le funzioni."
              : `${formatEuro(PLANS[shop.plan].priceCentsMonthly)} al mese · disdici quando vuoi`}
          </div>
        </div>
        {shop.plan !== "free" && (
          <Badge variant="success">
            <CheckCircle2 className="h-3 w-3" /> Abbonamento attivo
          </Badge>
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl text-ink-50 mb-2">Scegli il piano</h2>
        <p className="text-sm text-ink-400 mb-6">
          Puoi cambiare piano o disdire in qualsiasi momento. Pagamento sicuro
          tramite Stripe.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {PLAN_ORDER.map((tier) => {
            const p = PLANS[tier];
            const active = shop.plan === tier;
            return (
              <div
                key={tier}
                className={cn(
                  "rounded-2xl p-6 relative",
                  p.highlight
                    ? "glass-strong border-[color:var(--color-gold-500)]/50"
                    : "glass"
                )}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold">Più scelto</Badge>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-300)] mb-1">
                    {p.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display text-4xl text-ink-50">
                      {p.priceCentsMonthly === 0 ? "0 €" : formatEuro(p.priceCentsMonthly)}
                    </span>
                    <span className="text-xs text-ink-400">/mese</span>
                  </div>
                  <p className="text-xs text-ink-400">{p.tagline}</p>
                </div>

                <ul className="space-y-2 mb-6 text-sm">
                  <Row on label={p.bookingsPerMonth === "unlimited" ? "Prenotazioni illimitate" : `${p.bookingsPerMonth} prenotazioni/mese`} />
                  <Row on label={`Fino a ${p.maxBarbers} barbieri`} />
                  <Row on label="Database clienti" />
                  <Row on={p.revenueAnalytics} label="Report incassi" />
                  <Row on={p.referralCampaigns} label="Referral" />
                  <Row on={p.smsReminders} label="Reminder SMS/WhatsApp" />
                  <Row on={p.customBranding} label="Branding" />
                  <Row on={p.multiLocation} label="Multi-sede" />
                </ul>

                <Button
                  className="w-full"
                  variant={active ? "secondary" : p.highlight ? "primary" : "secondary"}
                  disabled={active || loading !== null}
                  onClick={() => subscribe(tier)}
                >
                  {loading === tier ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : active ? (
                    "Piano attivo"
                  ) : tier === "free" ? (
                    "Torna a Starter"
                  ) : (
                    `Attiva ${p.name}`
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass rounded-xl p-6 text-sm text-ink-300">
        <h3 className="font-medium text-ink-50 mb-2">Come funziona la fatturazione</h3>
        <ul className="space-y-1.5 text-ink-400">
          <li>• Il pagamento viene addebitato mensilmente tramite Stripe (sicuro, PCI-DSS).</li>
          <li>• Puoi disdire in qualsiasi momento — i dati restano tuoi ed esportabili.</li>
          <li>• Fatture elettroniche automatiche disponibili nella dashboard Stripe.</li>
          <li>• Nessun costo di attivazione, nessun contratto vincolante.</li>
        </ul>
      </div>
    </div>
  );
}

function Row({ on, label }: { on: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {on ? (
        <Check className="h-3.5 w-3.5 text-[color:var(--color-gold-400)] shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 text-ink-600 shrink-0" />
      )}
      <span className={on ? "text-ink-100" : "text-ink-500 line-through"}>
        {label}
      </span>
    </li>
  );
}
