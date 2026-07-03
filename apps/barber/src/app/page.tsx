import Link from "next/link";
import {
  Scissors,
  CalendarCheck2,
  Users,
  Wallet,
  Gift,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  ShieldCheck,
  Zap,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TIER_LIMITS, type SubscriptionTier } from "@/types";
import { formatCurrency } from "@/lib/utils";

const features = [
  {
    icon: CalendarCheck2,
    title: "Agenda intelligente",
    desc: "Calendario in tempo reale, prenotazioni pubbliche e reminder automatici. Zero doppie prenotazioni.",
  },
  {
    icon: Wallet,
    title: "Cassa & incassi",
    desc: "Registro giornaliero con split contanti/POS, mance e sconti. Report per giorno, settimana, mese.",
  },
  {
    icon: Users,
    title: "CRM clienti",
    desc: "Rubrica ricca: preferenze, note, storico visite, punti fedeltà. Il tuo cliente ricordato in un tap.",
  },
  {
    icon: Gift,
    title: "Campagne & Referral",
    desc: "Sconti a codice, porta-un-amico con reward automatico, programma fedeltà 10+1.",
  },
  {
    icon: Sparkles,
    title: "Pagina pubblica",
    desc: "Un link, il cliente prenota da smartphone in 20 secondi. Con il tuo brand.",
  },
  {
    icon: ShieldCheck,
    title: "Sicuro & scalabile",
    desc: "Firebase + Vercel. Multi-tenant, backup automatico, RGPD-ready, pronto per crescere.",
  },
];

const testimonials = [
  {
    name: "Antonio, Milano",
    role: "Filo Barber Studio",
    text: "Prima gestivo tutto su carta. Ora vedo gli incassi del mese in un colpo d'occhio e i clienti prenotano da soli. +32% fatturato in 90 giorni.",
  },
  {
    name: "Salvatore, Napoli",
    role: "Rasura Gentleman's Club",
    text: "Il porta-un-amico ha portato 40 nuovi clienti nel primo trimestre. E li ho tutti in rubrica con note e preferenze.",
  },
  {
    name: "Marco, Torino",
    role: "The Cut Room",
    text: "Sono passato da 3 no-show al giorno a quasi zero. I reminder e la pagina pubblica hanno cambiato il mio business.",
  },
];

function TierIcon({ tier }: { tier: SubscriptionTier }) {
  if (tier === "elite") return <Crown className="h-5 w-5" />;
  if (tier === "pro") return <Zap className="h-5 w-5" />;
  return <Scissors className="h-5 w-5" />;
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden grain">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-lg shadow-gold-500/20">
              <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl tracking-tight text-ink-50">
              Filo<span className="text-gold-300">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-ink-200">
            <a href="#features" className="hover:text-ink-50 transition-colors">Funzioni</a>
            <a href="#pricing" className="hover:text-ink-50 transition-colors">Prezzi</a>
            <a href="#testimonials" className="hover:text-ink-50 transition-colors">Testimonianze</a>
            <Link href="/book/filo-barber-studio" className="hover:text-ink-50 transition-colors">Demo prenotazione</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Accedi</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Inizia gratis <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gold-500/10 blur-[120px]" />
          <div className="absolute top-40 left-10 h-[300px] w-[300px] rounded-full bg-gold-400/5 blur-[80px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40 text-center">
          <Badge variant="gold" className="mx-auto mb-6">
            <Sparkles className="h-3 w-3" />
            La suite premium per barber shop
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-ink-50">
            Il tuo barber shop,
            <br />
            <span className="gradient-text italic">al livello successivo.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-ink-300 leading-relaxed">
            Prenotazioni, incassi, CRM clienti, campagne referral. Un solo strumento,
            eleganza da boutique, potenza da SaaS enterprise.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Prova gratis 14 giorni
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/dashboard">Guarda la demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-ink-400">Nessuna carta richiesta · Setup in 3 minuti</p>

          {/* Metric bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { k: "+32%", v: "fatturato medio" },
              { k: "3 min", v: "per il setup" },
              { k: "-87%", v: "no-show" },
              { k: "24/7", v: "prenotazioni online" },
            ].map((m) => (
              <div key={m.v} className="surface rounded-xl p-4 text-left">
                <div className="font-display text-3xl gradient-text">{m.k}</div>
                <div className="text-xs text-ink-400 uppercase tracking-widest mt-1">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock dashboard preview */}
      <section className="relative -mt-16 pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="surface-elevated rounded-2xl p-2 md:p-4 relative overflow-hidden">
            <div className="absolute inset-x-0 -top-1/2 h-full bg-gradient-to-b from-gold-400/10 via-transparent to-transparent pointer-events-none" />
            <div className="rounded-xl bg-ink-950/80 border border-white/5 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Incassi oggi", value: "€ 428,00", trend: "+18%", sub: "vs. ieri" },
                { label: "Prenotazioni oggi", value: "9 / 12", trend: "75%", sub: "occupazione" },
                { label: "Nuovi clienti", value: "3", trend: "+2", sub: "questa settimana" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5">
                  <div className="text-xs uppercase tracking-widest text-ink-400">{s.label}</div>
                  <div className="mt-3 font-display text-3xl text-ink-50">{s.value}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-400">{s.trend}</span>
                    <span className="text-ink-400">{s.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="muted" className="mb-4">Cosa include</Badge>
            <h2 className="font-display text-4xl md:text-5xl text-ink-50 tracking-tight">
              Tutto quello che ti serve.
              <br />
              <span className="gradient-text italic">Niente di superfluo.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="surface rounded-2xl p-6 hover:border-gold-400/20 transition-colors group"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gold-400/10 border border-gold-400/20 text-gold-300 group-hover:bg-gold-400/15 transition-colors">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl text-ink-50 mb-2">{f.title}</h3>
                <p className="text-sm text-ink-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gold-500/5 blur-[120px]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="muted" className="mb-4">Prezzi trasparenti</Badge>
            <h2 className="font-display text-4xl md:text-5xl text-ink-50 tracking-tight">
              Un piano per <span className="gradient-text italic">ogni salone.</span>
            </h2>
            <p className="mt-4 text-ink-300">
              Inizia gratis. Aggiorna quando cresci. Cancella quando vuoi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {(Object.keys(TIER_LIMITS) as SubscriptionTier[]).map((tier) => {
              const p = TIER_LIMITS[tier];
              const highlight = p.highlight;
              return (
                <div
                  key={tier}
                  className={
                    highlight
                      ? "relative rounded-2xl p-[1px] bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700 shadow-[0_20px_60px_-20px_rgba(212,167,44,0.4)]"
                      : "surface rounded-2xl"
                  }
                >
                  <div className={highlight ? "surface-elevated rounded-[15px] p-6 h-full" : "p-6 h-full"}>
                    {highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="gold" className="shadow-lg">Più popolare</Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gold-300">
                      <TierIcon tier={tier} />
                      <span className="text-sm uppercase tracking-widest">{p.label}</span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-5xl text-ink-50">
                        {p.priceMonthly === 0 ? "0€" : formatCurrency(p.priceMonthly).replace(",00", "")}
                      </span>
                      <span className="text-ink-400 text-sm">/ mese</span>
                    </div>
                    <ul className="mt-6 space-y-2.5">
                      {p.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm text-ink-200">
                          <Check className="h-4 w-4 text-gold-300 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={highlight ? "primary" : "secondary"}
                      className="w-full mt-8"
                    >
                      <Link href={tier === "free" ? "/signup" : `/signup?tier=${tier}`}>
                        {p.ctaLabel}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="muted" className="mb-4">Testimonianze</Badge>
            <h2 className="font-display text-4xl md:text-5xl text-ink-50 tracking-tight">
              Amato dai <span className="gradient-text italic">barbieri d'Italia.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="surface rounded-2xl p-6">
                <div className="flex gap-0.5 text-gold-300 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-ink-100 leading-relaxed italic">"{t.text}"</p>
                <div className="mt-5 pt-5 border-t border-white/5">
                  <div className="text-ink-50 font-medium">{t.name}</div>
                  <div className="text-xs text-ink-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="surface-elevated rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-6xl text-ink-50 tracking-tight leading-tight">
                Pronto a <span className="gradient-text italic">brillare?</span>
              </h2>
              <p className="mt-6 text-lg text-ink-300 max-w-xl mx-auto">
                Setup in 3 minuti. Nessuna carta di credito richiesta.
                Il primo mese è offerto dallo staff Filo.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Inizia gratis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard">Prova la demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ink-400">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-gold-400" />
            <span className="font-display text-ink-200">Filo</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-ink-100 transition-colors">Demo</Link>
            <a href="#pricing" className="hover:text-ink-100 transition-colors">Prezzi</a>
            <a href="mailto:hello@filo.app" className="hover:text-ink-100 transition-colors">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
