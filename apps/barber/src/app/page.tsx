import Link from "next/link";
import {
  Scissors,
  CalendarCheck,
  Wallet,
  Users,
  Gift,
  BarChart3,
  Sparkles,
  Check,
  ArrowRight,
  Star,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { PLAN_LIST } from "@/lib/plans";
import { eur } from "@/lib/money";

const features = [
  {
    icon: CalendarCheck,
    title: "Prenotazioni online 24/7",
    desc: "I clienti prenotano dal telefono in pochi tocchi. Tu ricevi tutto in agenda, senza più telefonate a raffica.",
  },
  {
    icon: Wallet,
    title: "Gestione incassi",
    desc: "Registra ogni servizio, tieni sotto controllo cassa giornaliera, mensile e metodi di pagamento.",
  },
  {
    icon: Users,
    title: "Database clienti (CRM)",
    desc: "Storico visite, preferenze, spesa totale e clienti VIP. Conosci i tuoi clienti come mai prima.",
  },
  {
    icon: Gift,
    title: "Campagne & Porta un amico",
    desc: "Codici sconto e programma referral per riempire le poltrone anche nei giorni scarichi.",
  },
  {
    icon: BarChart3,
    title: "Report e trend",
    desc: "Fatturato, ticket medio, servizi più richiesti e rendimento per barbiere. Decisioni basate sui numeri.",
  },
  {
    icon: Sparkles,
    title: "Esperienza premium",
    desc: "Un'immagine curata e professionale che i tuoi clienti percepiscono dal primo istante.",
  },
];

const steps = [
  { n: "01", title: "Configura la barberia", desc: "Servizi, prezzi, orari e postazioni. Pronto in pochi minuti." },
  { n: "02", title: "Condividi il link prenotazioni", desc: "I clienti prenotano online, tu approvi con un tap." },
  { n: "03", title: "Incassa e fidelizza", desc: "Registra gli incassi e lancia campagne per farli tornare." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#funzioni" className="hover:text-foreground">Funzioni</a>
            <a href="#come-funziona" className="hover:text-foreground">Come funziona</a>
            <a href="#prezzi" className="hover:text-foreground">Prezzi</a>
          </nav>
          <div className="flex items-center gap-2">
            <ButtonLink href="/prenota" variant="ghost" size="sm">Demo prenotazione</ButtonLink>
            <ButtonLink href="/dashboard" size="sm">Entra nell&apos;app</ButtonLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[var(--gold)]/12 blur-[120px]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold-deep)]/40 bg-[var(--gold)]/10 px-3 py-1 text-xs font-medium text-[var(--gold-soft)]">
              <Sparkles size={13} /> Il gestionale premium per barbieri
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              La tua barberia,
              <br />
              <span className="text-gradient-gold">gestita come un brand.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted md:text-lg">
              Prenotazioni online, incassi sotto controllo, clienti fidelizzati e campagne marketing.
              Tutto in un&apos;unica app elegante e semplice da usare.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="/dashboard" size="lg">
                Prova la demo gratis <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/prenota" variant="outline" size="lg">
                Vedi la prenotazione
              </ButtonLink>
            </div>
            <div className="mt-6 flex items-center gap-5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-[var(--success)]" /> Nessuna carta richiesta</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-[var(--success)]" /> Dati al sicuro</span>
            </div>
          </div>

          {/* Mockup card */}
          <div className="animate-fade-up rounded-3xl border border-border bg-surface p-5 shadow-2xl md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient text-[#0b0b0f]"><Scissors size={15} /></span>
                <span className="text-sm font-medium">Barberia Da Eros</span>
              </div>
              <span className="text-xs text-muted">Oggi</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Incasso oggi", v: eur(9500) },
                { l: "Appuntamenti", v: "5" },
                { l: "Richieste", v: "1" },
              ].map((k) => (
                <div key={k.l} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="text-[11px] text-muted">{k.l}</div>
                  <div className="mt-1 text-lg font-semibold">{k.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { t: "09:00", n: "Giuseppe R.", s: "Taglio + Barba", tone: "text-[var(--success)]" },
                { t: "11:00", n: "Francesco E.", s: "Rasatura tradizionale", tone: "text-[#8fb4ff]" },
                { t: "15:00", n: "Davide F.", s: "Taglio uomo", tone: "text-[#8fb4ff]" },
              ].map((r) => (
                <div key={r.t} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium tabular-nums"><Clock size={13} className="text-muted" />{r.t}</span>
                  <span className="flex-1 text-sm">{r.n}</span>
                  <span className="text-xs text-muted">{r.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-8 text-center md:grid-cols-4">
          {[
            { v: "+30%", l: "Appuntamenti in più" },
            { v: "-70%", l: "Telefonate gestite" },
            { v: "24/7", l: "Prenotazioni aperte" },
            { v: "5★", l: "Esperienza cliente" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-bold text-gradient-gold md:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs text-muted md:text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="funzioni" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Tutto ciò che serve alla tua barberia</h2>
          <p className="mt-3 text-muted">Un solo strumento al posto di agenda cartacea, quaderno degli incassi e messaggi sparsi.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-hover rounded-2xl border border-border bg-surface p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/12 text-[var(--gold)]">
                <f.icon size={20} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="come-funziona" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">In 3 passi sei operativo</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-surface p-6">
                <span className="font-display text-5xl font-bold text-[var(--gold)]/25">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="prezzi" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Prezzi semplici e trasparenti</h2>
          <p className="mt-3 text-muted">Inizia gratis. Passa a Pro quando vuoi far crescere il business.</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {PLAN_LIST.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-7 ${
                plan.highlight
                  ? "border-[var(--gold-deep)] bg-gradient-to-b from-[var(--gold)]/10 to-transparent shadow-xl shadow-[var(--gold)]/10"
                  : "border-border bg-surface"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full gold-gradient px-3 py-1 text-xs font-semibold text-[#0b0b0f]">
                  <Star size={12} /> Più scelto
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.priceLabel}</span>
                <span className="mb-1 text-sm text-muted">/mese</span>
              </div>
              <ButtonLink
                href="/dashboard/abbonamento"
                variant={plan.highlight ? "gold" : "subtle"}
                className="mt-6 w-full"
              >
                {plan.cta}
              </ButtonLink>
              <ul className="mt-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={17} className="mt-0.5 shrink-0 text-[var(--gold)]" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Pagamenti sicuri gestiti con Stripe · Disdici quando vuoi · 14 giorni di prova su Pro
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--gold-deep)]/40 bg-gradient-to-br from-[var(--gold)]/12 via-surface to-surface p-10 text-center md:p-14">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Pronto a far crescere la tua barberia?</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">Prova la demo completa adesso. Dati di esempio già pronti, nessuna installazione.</p>
          <div className="mt-7 flex justify-center">
            <ButtonLink href="/dashboard" size="lg">Apri la dashboard <ArrowRight size={18} /></ButtonLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted md:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} BarberOS · Il gestionale premium per barbieri</p>
          <div className="flex gap-5">
            <Link href="/prenota" className="hover:text-foreground">Prenota</Link>
            <Link href="/dashboard" className="hover:text-foreground">App</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
