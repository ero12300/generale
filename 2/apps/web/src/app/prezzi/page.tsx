import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS, formatEuro } from "@ristoprofit/types";
import { CheckoutButton } from "@/components/billing/checkout-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrezziPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <MarketingHeader />
      <main className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center mb-14 animate-fade-up">
          <p className="text-sm font-medium text-emerald-700 uppercase tracking-widest mb-3">
            Prezzi trasparenti
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">Piani e prezzi</h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg">
            Setup iniziale per configurazione + canone mensile per controllo continuo.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {PLANS.map((plan, i) => (
            <Card
              key={plan.tier}
              className={`animate-fade-up ${
                plan.tier === "pro"
                  ? "border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-950/20"
                  : ""
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardHeader>
                {plan.tier === "pro" && (
                  <span className="inline-flex w-fit text-xs font-semibold text-emerald-700 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1 rounded-full mb-2">
                    Più scelto
                  </span>
                )}
                <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                {plan.monthly_price_cents > 0 ? (
                  <div className="mt-4">
                    <p className="font-display text-4xl font-semibold text-zinc-50">
                      {formatEuro(plan.monthly_price_cents)}
                      <span className="text-base text-zinc-500 font-normal font-sans">/mese</span>
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Setup una tantum: {formatEuro(plan.setup_price_cents)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl text-amber-400 mt-4 font-display">Prezzo su preventivo</p>
                )}
                <ul className="mt-6 space-y-2.5 text-sm text-zinc-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="text-emerald-500 shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {plan.max_recipes && (
                  <p className="text-xs text-zinc-500 mt-4">
                    Fino a {plan.max_recipes} ricette · {plan.max_users} utenti
                  </p>
                )}
                {plan.monthly_price_cents > 0 && plan.tier !== "enterprise" && (
                  <div className="mt-6">
                    <CheckoutButton tier={plan.tier} label={`Attiva ${plan.name}`} />
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 p-6 rounded-xl border border-amber-500/30 bg-amber-500/5 animate-fade-up">
          <h2 className="font-display font-semibold text-amber-400">Offerta lancio Messina</h2>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Primi 10 clienti: setup Pro a 690€, canone Pro a 99€/mese per 12 mesi, report iniziale incluso.
          </p>
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/demo">Richiedi preventivo</Link>
          </Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
