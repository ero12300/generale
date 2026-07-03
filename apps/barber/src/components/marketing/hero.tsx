"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass gold-border px-3 py-1.5 text-xs text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-gold-300)]" />
            Nuovo · Rasoio 1.0 in accesso anticipato
          </div>

          <h1 className="font-display text-5xl leading-[1.05] text-white md:text-6xl lg:text-7xl">
            Il gestionale premium <br className="hidden md:block" />
            per il tuo <span className="gold-text shine">barbershop</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Prenotazioni online, registro incassi, database clienti e campagne "porta-un-amico".
            Tutto in un'app veloce, elegante e pronta a scalare con te.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="gold" asChild>
              <Link href="/signup">
                Inizia gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/book/demo-shop">Vedi pagina prenotazione</Link>
            </Button>
          </div>

          <div className="mx-auto mt-4 max-w-md text-xs text-white/40">
            Nessuna carta richiesta · Modalità demo pronta in 5 secondi
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      <div className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-[color:var(--color-gold-500)]/25 via-transparent to-[color:var(--color-copper-500)]/25 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] gold-border glass-strong shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/5 bg-[color:var(--color-ink-900)]/70 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          </div>
          <div className="ml-3 text-xs text-white/40">rasoio.app/app</div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          <MockCard
            icon={<Wallet className="h-5 w-5" />}
            label="Incasso di oggi"
            value="€ 348,00"
            delta="+18% vs ieri"
            deltaPositive
          />
          <MockCard
            icon={<Calendar className="h-5 w-5" />}
            label="Prenotazioni oggi"
            value="14"
            delta="3 confermate ora"
          />
          <MockCard
            icon={<Users className="h-5 w-5" />}
            label="Nuovi clienti"
            value="+7"
            delta="da referral 42%"
            deltaPositive
          />

          <div className="glass rounded-2xl p-4 md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">Agenda oggi · Martedì</div>
                <div className="font-display text-lg text-white">6 prenotazioni</div>
              </div>
              <span className="rounded-full border border-[color:var(--color-gold-300)]/30 bg-[color:var(--color-gold-500)]/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-[color:var(--color-gold-200)]">
                Live
              </span>
            </div>
            <ul className="divide-y divide-white/5">
              {[
                { t: "09:30", n: "Marco B.", s: "Taglio + barba", p: "€35" },
                { t: "10:15", n: "Luca F.", s: "Barba scolpita", p: "€18" },
                { t: "11:00", n: "Andrea R.", s: "Taglio uomo", p: "€22" },
                { t: "12:00", n: "Simone C.", s: "Taglio + barba", p: "€35" },
              ].map((r) => (
                <li key={r.t} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-14 font-mono text-white/60">{r.t}</span>
                    <span className="text-white">{r.n}</span>
                    <span className="text-white/50">· {r.s}</span>
                  </div>
                  <span className="text-[color:var(--color-gold-200)]">{r.p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wider text-white/50">Referral attivi</div>
            <div className="mt-1 font-display text-2xl text-white">Porta-un-amico</div>
            <p className="mt-2 text-sm text-white/60">
              Ogni cliente porta un amico → 5€ di sconto per entrambi. In 30 giorni: 18 nuovi clienti.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[color:var(--color-gold-200)]">
              <span className="rounded-md border border-[color:var(--color-gold-300)]/30 bg-black/40 px-2 py-1 font-mono">RASOIO-MARCO-A9F2</span>
              <span className="text-white/40">3 usi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockCard({
  icon,
  label,
  value,
  delta,
  deltaPositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  deltaPositive?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)]">
          {icon}
        </span>
      </div>
      <div className="mt-2 font-display text-3xl text-white">{value}</div>
      <div className={"mt-1 text-xs " + (deltaPositive ? "text-emerald-300" : "text-white/50")}>{delta}</div>
    </div>
  );
}
