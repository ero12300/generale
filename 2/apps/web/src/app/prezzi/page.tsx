import { MarketingHeader, MarketingFooter } from "@/components/marketing/header-footer";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS, formatEuro } from "@ristoprofit/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrezziPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingHeader />
      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Prezzi e piani</h1>
        <p className="text-zinc-400 mb-12">
          Setup iniziale per configurazione + canone mensile per controllo continuo.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {PLANS.map((plan) => (
            <Card key={plan.tier} className={plan.tier === "pro" ? "border-emerald-500/40" : ""}>
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.monthly_price_cents > 0 ? (
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-emerald-400">
                      {formatEuro(plan.monthly_price_cents)}
                      <span className="text-base text-zinc-500 font-normal">/mese</span>
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Setup una tantum: {formatEuro(plan.setup_price_cents)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl text-amber-400 mt-4">Prezzo su preventivo</p>
                )}
                <ul className="mt-6 space-y-2 text-sm text-zinc-300">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {plan.max_recipes && (
                  <p className="text-xs text-zinc-500 mt-4">
                    Fino a {plan.max_recipes} ricette · {plan.max_users} utenti
                  </p>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 p-6 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <h2 className="font-semibold text-amber-400">Offerta lancio Messina</h2>
          <p className="text-sm text-zinc-400 mt-2">
            Primi 10 clienti: setup Pro a 690€, canone Pro a 99€/mese per 12 mesi, report iniziale incluso.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Button asChild><Link href="/demo">Richiedi preventivo</Link></Button>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
