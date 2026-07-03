import Link from "next/link";
import {
  CalendarCheck,
  ChartNoAxesCombined,
  Check,
  Gift,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import { getStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const store = await getStore();
  const [services, settings] = await Promise.all([
    store.listServices(),
    store.getSettings(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
          aria-label="Navigazione principale"
        >
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-gold" aria-hidden />
            <span className="font-display text-xl font-bold tracking-wide">
              Barber<span className="text-gold">OS</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#servizi" className="transition-colors hover:text-foreground">
              Servizi
            </a>
            <a href="#referral" className="transition-colors hover:text-foreground">
              Porta un amico
            </a>
            <a href="#piani" className="transition-colors hover:text-foreground">
              Per i barbieri
            </a>
            <Link href="/admin" className="transition-colors hover:text-foreground">
              Area gestionale
            </Link>
          </div>
          <Link
            href="/prenota"
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-background transition-colors hover:bg-gold-soft"
          >
            Prenota ora
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-texture relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-gold-dim/50 bg-surface px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-soft">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {settings.shopName}
          </p>
          <h1 className="animate-fade-up font-display mx-auto max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
            L&apos;arte del taglio,
            <br />
            <span className="gold-gradient-text">l&apos;eleganza del servizio</span>
          </h1>
          <p className="animate-fade-up-delay-1 mx-auto mt-6 max-w-xl text-lg text-muted">
            Prenota in 30 secondi il tuo prossimo taglio. Barbieri esperti,
            prodotti premium e un&apos;esperienza su misura, ogni volta.
          </p>
          <div className="animate-fade-up-delay-2 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/prenota"
              className="rounded-full bg-gold px-8 py-3.5 font-semibold text-background transition-transform hover:scale-105 hover:bg-gold-soft"
            >
              Prenota il tuo posto
            </Link>
            <a
              href="#servizi"
              className="rounded-full border border-border bg-surface px-8 py-3.5 font-semibold transition-colors hover:border-gold-dim"
            >
              Scopri i servizi
            </a>
          </div>
          <dl className="animate-fade-up-delay-2 mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 text-center">
            {[
              ["4.9★", "Valutazione clienti"],
              ["12+", "Anni di esperienza"],
              ["30s", "Per prenotare online"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl font-bold text-gold-soft">
                  {value}
                </dd>
                <dd className="mt-1 text-xs uppercase tracking-wider text-muted">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Servizi */}
      <section id="servizi" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-4xl font-bold">
            I nostri <span className="text-gold">servizi</span>
          </h2>
          <p className="mt-3 text-muted">
            Ogni servizio include consulenza personalizzata e prodotti premium.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group relative rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-gold-dim"
            >
              {service.popular && (
                <span className="absolute -top-2.5 right-5 rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-background">
                  Più richiesto
                </span>
              )}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-semibold">
                  {service.name}
                </h3>
                <span className="whitespace-nowrap font-display text-xl font-bold text-gold-soft">
                  {formatEuro(service.priceCents)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {service.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted">
                  {service.durationMin} min
                </span>
                <Link
                  href={`/prenota?servizio=${service.id}`}
                  className="text-sm font-semibold text-gold transition-colors hover:text-gold-soft"
                >
                  Prenota →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Porta un amico */}
      <section
        id="referral"
        className="border-y border-border bg-surface"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <Gift className="h-4 w-4" aria-hidden /> Programma fedeltà
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight">
              Porta un amico,
              <br />
              <span className="gold-gradient-text">risparmiate entrambi</span>
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Ogni cliente riceve un codice personale. Il tuo amico ottiene il
              15% di sconto sul primo taglio e tu accumuli vantaggi esclusivi ad
              ogni nuova presentazione.
            </p>
            <Link
              href="/prenota"
              className="mt-8 inline-block rounded-full bg-gold px-7 py-3 font-semibold text-background transition-colors hover:bg-gold-soft"
            >
              Ottieni il tuo codice
            </Link>
          </div>
          <ol className="space-y-4" aria-label="Come funziona il programma porta un amico">
            {[
              ["1", "Prenota il tuo servizio", "Al termine ricevi il tuo codice personale, es. MARIO-X3F."],
              ["2", "Condividi il codice", "Invialo a chi vuoi: vale il 15% di sconto sul primo servizio."],
              ["3", "Accumula vantaggi", "Il salone traccia ogni amico portato e ti premia in cassa."],
            ].map(([num, title, desc]) => (
              <li
                key={num}
                className="flex gap-4 rounded-2xl border border-border bg-surface-2 p-5"
              >
                <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-dim text-lg font-bold text-gold">
                  {num}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Piani SaaS per i barbieri */}
      <section id="piani" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Per i barbieri
          </p>
          <h2 className="font-display text-4xl font-bold">
            Porta BarberOS nel tuo salone
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Il gestionale completo: prenotazioni online, registro incassi,
            database clienti e campagne marketing. Un abbonamento, zero
            pensieri.
          </p>
        </div>
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {Object.values(PLANS).map((plan) => {
            const isPro = plan.id === "pro";
            return (
              <article
                key={plan.id}
                className={`relative rounded-2xl border p-8 ${
                  isPro
                    ? "border-gold bg-surface shadow-[0_0_40px_rgba(201,162,39,0.12)]"
                    : "border-border bg-surface"
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-background">
                    Consigliato
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                <p className="mt-5">
                  <span className="font-display text-5xl font-bold text-gold-soft">
                    {formatEuro(plan.priceMonthlyCents)}
                  </span>
                  <span className="text-sm text-muted"> /mese</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/admin/abbonamento"
                  className={`mt-8 block rounded-full py-3 text-center font-semibold transition-colors ${
                    isPro
                      ? "bg-gold text-background hover:bg-gold-soft"
                      : "border border-border hover:border-gold-dim"
                  }`}
                >
                  Attiva {plan.name}
                </Link>
              </article>
            );
          })}
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 text-center sm:grid-cols-3">
          {[
            [CalendarCheck, "Agenda sempre piena", "Prenotazioni online 24/7 senza telefonate"],
            [ChartNoAxesCombined, "Incassi sotto controllo", "Report giornalieri, settimanali e mensili"],
            [Users, "Clienti che ritornano", "Database clienti e campagne porta un amico"],
          ].map(([Icon, title, desc]) => {
            const IconCmp = Icon as typeof CalendarCheck;
            return (
              <div key={title as string} className="rounded-2xl border border-border bg-surface p-6">
                <IconCmp className="mx-auto h-6 w-6 text-gold" aria-hidden />
                <h3 className="mt-3 font-semibold">{title as string}</h3>
                <p className="mt-1 text-sm text-muted">{desc as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted md:flex-row">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-gold" aria-hidden />
            <span className="font-display font-bold text-foreground">
              Barber<span className="text-gold">OS</span>
            </span>
          </div>
          <p>Prenotazioni · Incassi · Clienti · Campagne</p>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Area gestionale →
          </Link>
        </div>
      </footer>
    </div>
  );
}
