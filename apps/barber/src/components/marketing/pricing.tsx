"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { formatEuro } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="gold" className="mb-4">
            Prezzi trasparenti
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-50 mb-4">
            Un investimento che si ripaga in
            <span className="text-gold-gradient"> due tagli.</span>
          </h2>
          <p className="text-lg text-ink-400">
            Prova gratis. Se non ti piace, nessun problema. Se ti piace, hai un
            gestionale che costa meno di un caffè al giorno.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {PLAN_ORDER.map((tier) => {
            const p = PLANS[tier];
            const isFeatured = p.highlight;
            return (
              <div
                key={p.tier}
                className={cn(
                  "relative rounded-2xl p-8 flex flex-col",
                  isFeatured
                    ? "glass-strong border-[color:var(--color-gold-500)]/50 shadow-[0_30px_80px_-30px_rgba(201,162,75,0.4)] scale-[1.02]"
                    : "glass"
                )}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold">Più scelto</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-xs text-[color:var(--color-gold-300)] uppercase tracking-widest mb-1">
                    Piano {p.name}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-display text-5xl text-ink-50">
                      {p.priceCentsMonthly === 0 ? "0 €" : formatEuro(p.priceCentsMonthly)}
                    </span>
                    <span className="text-ink-400 text-sm">/mese</span>
                  </div>
                  <p className="text-sm text-ink-400">{p.tagline}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <FeatureRow
                    on
                    label={
                      p.bookingsPerMonth === "unlimited"
                        ? "Prenotazioni illimitate"
                        : `${p.bookingsPerMonth} prenotazioni/mese`
                    }
                  />
                  <FeatureRow on label={`Fino a ${p.maxBarbers} ${p.maxBarbers === 1 ? "barbiere" : "barbieri"}`} />
                  <FeatureRow on label="Database clienti + storico" />
                  <FeatureRow on={p.publicBookingPage} label="Pagina prenotazione pubblica" />
                  <FeatureRow on={p.revenueAnalytics} label="Report incassi avanzati" />
                  <FeatureRow on={p.referralCampaigns} label='Campagne "porta un amico"' />
                  <FeatureRow on={p.smsReminders} label="Reminder SMS/WhatsApp" />
                  <FeatureRow on={p.customBranding} label="Branding personalizzato" />
                  <FeatureRow on={p.multiLocation} label="Multi-sede" />
                  <FeatureRow on={p.apiAccess} label="Accesso API" />
                  <FeatureRow on={p.prioritySupport} label="Supporto prioritario" />
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={isFeatured ? "primary" : "secondary"}
                >
                  <Link
                    href={
                      p.tier === "free"
                        ? "/dashboard"
                        : `/dashboard/abbonamento?plan=${p.tier}`
                    }
                  >
                    {p.cta}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-ink-500 mt-8">
          Puoi disdire in qualsiasi momento. Fatturazione tramite Stripe, sicura
          e a norma.
        </p>
      </div>
    </section>
  );
}

function FeatureRow({ on, label }: { on: boolean; label: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      {on ? (
        <Check className="h-4 w-4 text-[color:var(--color-gold-400)] shrink-0" />
      ) : (
        <X className="h-4 w-4 text-ink-600 shrink-0" />
      )}
      <span className={on ? "text-ink-100" : "text-ink-500 line-through"}>
        {label}
      </span>
    </li>
  );
}
