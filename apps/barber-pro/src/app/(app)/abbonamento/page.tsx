import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getShop } from "@/lib/data/repo";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { SubscriptionActions } from "@/components/subscription/SubscriptionActions";
import { Badge } from "@/components/ui/Badge";
import { formatEUR } from "@/lib/utils";
import { Check, Crown } from "lucide-react";
import { stripeConfigured } from "@/lib/stripe/server";

export default async function AbbonamentoPage() {
  const shop = await getShop();
  const currentPlan = shop?.plan ?? "free";
  const stripeOn = stripeConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gold-shine">Abbonamento</h1>
        <p className="text-ink-400 text-sm mt-1">
          Gestisci il tuo piano e aumenta le funzionalità disponibili quando vuoi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Il tuo piano attuale</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge tone={currentPlan === "pro" ? "gold" : currentPlan === "business" ? "violet" : "default"}>
                {PLANS[currentPlan].name.toUpperCase()}
              </Badge>
              {currentPlan !== "free" ? (
                <span className="text-xs text-ink-500">
                  {formatEUR(PLANS[currentPlan].priceMonthlyEur)}/mese
                </span>
              ) : null}
            </div>
          </div>
          {shop?.stripeSubscriptionId ? (
            <SubscriptionActions hasSubscription />
          ) : null}
        </CardHeader>
        <CardBody>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {PLANS[currentPlan].features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-ink-200">
                <Check className="w-4 h-4 text-[color:var(--color-gold-400)]" /> {f}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {!stripeOn ? (
        <div className="glass rounded-xl p-4 text-sm text-ink-300 border border-amber-500/30">
          <strong className="text-amber-300">Stripe non configurato.</strong> I pulsanti di
          upgrade partono in modalità simulazione: attivano il piano localmente per farti
          esplorare i limiti. Configura le variabili <code>STRIPE_*</code> in{" "}
          <code>.env.local</code> per usare pagamenti reali.
        </div>
      ) : null}

      <div className="grid md:grid-cols-3 gap-3">
        {PLAN_ORDER.map((k) => {
          const p = PLANS[k];
          const isCurrent = k === currentPlan;
          return (
            <div
              key={k}
              className={`relative glass rounded-2xl p-6 flex flex-col ${p.highlight ? "gold-ring" : ""} ${isCurrent ? "border-2 border-[color:var(--color-gold-500)]/60" : ""}`}
            >
              {isCurrent ? (
                <div className="absolute -top-3 left-6 px-2 py-0.5 rounded-full bg-[color:var(--color-gold-500)]/20 text-[color:var(--color-gold-300)] border border-[color:var(--color-gold-500)]/30 text-[11px] font-medium inline-flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Attuale
                </div>
              ) : null}
              <div>
                <div className="text-xs uppercase tracking-wider text-ink-400">{p.name}</div>
                <div className="font-display text-3xl mt-1">
                  {p.priceMonthlyEur === 0 ? "Gratis" : formatEUR(p.priceMonthlyEur)}
                  {p.priceMonthlyEur > 0 ? <span className="text-sm text-ink-400 font-sans">/mese</span> : null}
                </div>
                <p className="text-sm text-ink-400 mt-1">{p.tagline}</p>
              </div>
              <ul className="space-y-2 mt-4 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-200">
                    <Check className="w-4 h-4 mt-0.5 text-[color:var(--color-gold-400)]" /> {f}
                  </li>
                ))}
              </ul>
              <SubscriptionActions plan={k} isCurrent={isCurrent} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
