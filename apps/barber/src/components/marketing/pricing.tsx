"use client";

import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function Pricing() {
  const plans = [PLANS.free, PLANS.base, PLANS.pro];

  return (
    <section id="prezzi" className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">Prezzi</div>
        <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">
          Semplice. <span className="gold-text">Onesto.</span> Scalabile.
        </h2>
        <p className="mt-4 text-white/70">
          Prova gratis. Passa a Base quando vuoi il link pubblico prenotazioni. Passa a Pro per referral e multi-postazione.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className={cn(
              "relative rounded-2xl p-6 glass transition",
              p.highlight && "gold-border shadow-[0_30px_80px_-30px_rgba(217,163,38,0.35)]",
            )}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-[color:var(--color-gold-300)] to-[color:var(--color-gold-500)] px-3 py-1 text-[10px] uppercase tracking-widest text-[color:var(--color-ink-900)]">
                <Sparkles className="h-3 w-3" />
                Più scelto
              </div>
            )}
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-2xl text-white">{p.name}</h3>
              {p.monthlyEur === 0 ? (
                <span className="text-2xl font-display text-white/80">Free</span>
              ) : (
                <span className="text-3xl font-display text-white">
                  €{p.monthlyEur}
                  <span className="ml-1 text-sm text-white/50">/mese</span>
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/60">{p.tagline}</p>

            <ul className="my-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                  <Check className="mt-0.5 h-4 w-4 text-[color:var(--color-gold-300)]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={p.highlight ? "gold" : "outline"}
              asChild
            >
              <Link href={p.monthlyEur === 0 ? "/signup" : `/app/abbonamento?upgrade=${p.id}`}>
                {p.monthlyEur === 0 ? "Inizia gratis" : `Attiva ${p.name}`}
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-xs text-white/40">
        Pagamenti in sicurezza con Stripe · Annulla quando vuoi · IVA esclusa
      </div>
    </section>
  );
}
