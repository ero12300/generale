import Link from "next/link";
import {
  CalendarClock,
  Users,
  Wallet,
  Gift,
  Check,
  Scissors,
  ArrowRight,
  BarChart3,
  Star,
  ShieldCheck,
} from "lucide-react";
import { PLANS } from "@/lib/plans";

const features = [
  {
    icon: CalendarClock,
    title: "Prenotazioni online 24/7",
    desc: "I tuoi clienti prenotano dal telefono in pochi tap. Tu gestisci l'agenda per barbiere senza sovrapposizioni.",
  },
  {
    icon: Users,
    title: "Database clienti",
    desc: "Storico visite, preferenze, note e contatti sempre a portata di mano. Fidelizza chi torna da te.",
  },
  {
    icon: Wallet,
    title: "Gestione incassi",
    desc: "Registra ogni incasso, distingui contanti e carta, tieni sotto controllo il fatturato giornaliero.",
  },
  {
    icon: Gift,
    title: "Sconti & Porta un Amico",
    desc: "Crea campagne sconto e referral per attirare nuovi clienti e premiare quelli fedeli.",
  },
  {
    icon: BarChart3,
    title: "Analytics premium",
    desc: "Scontrino medio, trend incassi, clienti top. Decisioni basate sui numeri, non sulle sensazioni.",
  },
  {
    icon: ShieldCheck,
    title: "Scalabile e sicuro",
    desc: "Cresci con il piano Pro: più barbieri, più campagne, più potenza. Su infrastruttura cloud.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-premium text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-zinc-950">
              <Scissors className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Barber<span className="text-amber-500">Suite</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
            <a href="#funzioni" className="hover:text-zinc-100">Funzioni</a>
            <a href="#prezzi" className="hover:text-zinc-100">Prezzi</a>
            <Link href="/prenota/barber-studio-eros" className="hover:text-zinc-100">
              Prenota una prova
            </Link>
          </nav>
          <Link
            href="/dashboard"
            className="rounded-lg bg-gradient-to-b from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-amber-500"
          >
            Entra nella Demo
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <div className="animate-fade-in-up max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              <Star className="h-3.5 w-3.5" /> Il gestionale premium per barbieri
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Gestisci il tuo <span className="text-gradient-gold">barbershop</span> come un
              vero business.
            </h1>
            <p className="mt-6 text-lg text-zinc-400 md:text-xl">
              Prenotazioni online, database clienti, incassi e campagne sconti in
              un&apos;unica dashboard elegante. Meno caos, più clienti, più fatturato.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 px-7 py-3.5 text-base font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-amber-500"
              >
                Prova la Demo gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#prezzi"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-7 py-3.5 text-base font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                Vedi i prezzi
              </a>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Nessuna carta richiesta · Modalità demo con dati di esempio già pronti
            </p>
          </div>
        </div>
      </section>

      {/* Funzioni */}
      <section id="funzioni" className="border-t border-zinc-800/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Tutto in un unico posto</h2>
            <p className="mt-4 text-zinc-400">
              Progettato con i barbieri, per i barbieri. Ogni funzione pensata per farti
              risparmiare tempo e guadagnare di più.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-amber-500/40 hover:bg-zinc-900"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prezzi */}
      <section id="prezzi" className="border-t border-zinc-800/60 py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Prezzi semplici e scalabili</h2>
            <p className="mt-4 text-zinc-400">
              Inizia gratis. Passa a Pro quando sei pronto a crescere. Disdici quando vuoi.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={
                  "relative rounded-3xl border p-8 " +
                  (plan.highlighted
                    ? "border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-zinc-900/40 shadow-2xl shadow-amber-900/20"
                    : "border-zinc-800 bg-zinc-900/40")
                }
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-8 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-zinc-950">
                    Più scelto
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.priceLabel}</span>
                  {plan.priceCents > 0 && (
                    <span className="mb-1 text-zinc-400">/mese</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/abbonamento"
                  className={
                    "mt-8 flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition " +
                    (plan.highlighted
                      ? "bg-gradient-to-b from-amber-500 to-amber-600 text-zinc-950 hover:from-amber-400 hover:to-amber-500"
                      : "border border-zinc-700 text-zinc-100 hover:bg-zinc-800")
                  }
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="border-t border-zinc-800/60 py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Pronto a portare il tuo salone al livello successivo?
          </h2>
          <p className="mt-4 text-zinc-400">
            Entra nella demo e scopri quanto è semplice gestire tutto da un&apos;unica app.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 px-8 py-4 text-base font-semibold text-zinc-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-amber-500"
          >
            Entra nella Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-zinc-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-amber-500" />
            <span>BarberSuite · Gestionale per barbershop</span>
          </div>
          <p>Demo dimostrativa · I dati non sono consulenza commerciale.</p>
        </div>
      </footer>
    </div>
  );
}
