import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  Check,
  Gift,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CATALOG } from "@/lib/plan";
import { formatCurrencyShort } from "@/lib/utils";

const features = [
  {
    icon: CalendarCheck,
    title: "Prenotazioni online 24/7",
    text: "I clienti prenotano dal telefono in pochi tap. Tu ricevi tutto in agenda, senza telefonate.",
  },
  {
    icon: Wallet,
    title: "Gestione incassi",
    text: "Registra ogni servizio, monitora incassi giornalieri, settimanali e mensili in tempo reale.",
  },
  {
    icon: Users,
    title: "Database clienti",
    text: "Storico visite, spesa totale, note e punti fedeltà. Conosci ogni cliente come il palmo della tua mano.",
  },
  {
    icon: Gift,
    title: "Campagne e Porta un amico",
    text: "Sconti automatici e programma referral per far crescere la clientela col passaparola.",
  },
  {
    icon: BarChart3,
    title: "Report che contano",
    text: "Scopri servizi più redditizi, ticket medio e andamento settimanale con grafici chiari.",
  },
  {
    icon: Smartphone,
    title: "Tutto da mobile",
    text: "Gestisci il salone dallo smartphone. Interfaccia premium, veloce e accessibile da tastiera.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-premium text-zinc-100">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-[#0a0a0b]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#e3c680] to-[#c9a24b] text-zinc-950">
              <Scissors className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold gold-gradient-text">
              Lama d&apos;Oro
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#funzioni" className="hover:text-zinc-100">Funzioni</a>
            <a href="#prezzi" className="hover:text-zinc-100">Prezzi</a>
            <Link href="/prenota" className="hover:text-zinc-100">Prenota</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-300 hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-2 py-1"
            >
              Accedi
            </Link>
            <Button asChild size="sm">
              <Link href="/login">Prova gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 px-4 py-1.5 text-xs font-medium text-gold-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Il gestionale premium per barbershop
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Il tuo salone, <span className="gold-gradient-text">gestito come un&apos;opera d&apos;arte</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Prenotazioni online, incassi sempre sotto controllo, database clienti e
            campagne fedeltà. Tutto in un&apos;unica piattaforma elegante, pensata per far
            crescere la tua attività.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">Inizia gratis — 2 minuti</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/prenota">Vedi la prenotazione clienti</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Nessuna carta richiesta • Piano Base gratuito per sempre
          </p>
        </div>

        {/* Stat strip */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "+38%", v: "clienti che ritornano" },
            { k: "0", v: "telefonate perse" },
            { k: "24/7", v: "prenotazioni online" },
            { k: "5 min", v: "per iniziare" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-zinc-800 bg-[#17171a]/80 p-5 text-center card-ring"
            >
              <p className="font-display text-3xl font-bold gold-gradient-text">{s.k}</p>
              <p className="mt-1 text-xs text-zinc-400">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Funzioni */}
      <section id="funzioni" className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Tutto quello che serve al tuo barbershop
          </h2>
          <p className="mt-4 text-zinc-400">
            Un gestionale interno completo, più un servizio di prenotazione per i tuoi clienti.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-800 bg-[#17171a]/70 p-6 transition-colors hover:border-[#c9a24b]/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c9a24b]/15 text-gold-soft">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prezzi */}
      <section id="prezzi" className="mx-auto max-w-5xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Prezzi semplici, cresci quando vuoi
          </h2>
          <p className="mt-4 text-zinc-400">
            Inizia gratis. Passa a Pro quando vuoi fidelizzare e scalare.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PLAN_CATALOG.map((plan) => {
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={
                  "relative rounded-3xl border p-8 " +
                  (isPro
                    ? "border-[#c9a24b]/60 bg-gradient-to-b from-[#1c1a14] to-[#141416] card-ring"
                    : "border-zinc-800 bg-[#17171a]/70")
                }
              >
                {isPro && (
                  <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-b from-[#e3c680] to-[#c9a24b] px-3 py-1 text-xs font-semibold text-zinc-950">
                    Consigliato
                  </span>
                )}
                <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-zinc-400">{plan.tagline}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold">
                    {plan.priceMonthly === 0 ? "Gratis" : formatCurrencyShort(plan.priceMonthly)}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="mb-1 text-sm text-zinc-500">/ mese</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
                      {h}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 w-full"
                  variant={isPro ? "default" : "secondary"}
                >
                  <Link href="/login">{plan.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral highlight */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-center gap-10 rounded-3xl border border-zinc-800 bg-[#17171a]/70 p-8 md:grid-cols-2 md:p-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a24b]/40 bg-[#c9a24b]/10 px-3 py-1 text-xs text-gold-soft">
              <Gift className="h-3.5 w-3.5" /> Porta un amico
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">
              Trasforma i clienti in promotori
            </h2>
            <p className="mt-3 text-zinc-400">
              Ogni cliente ha un codice referral personale. Quando invita un amico, entrambi
              ricevono uno sconto e tu guadagni un nuovo cliente fedele. Il passaparola,
              automatizzato.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-gold-soft" />
              Dati clienti al sicuro, conformi al GDPR
            </div>
          </div>
          <div className="rounded-2xl border border-[#c9a24b]/30 bg-[#0e0e10] p-6">
            <div className="flex items-center gap-1 text-gold-soft">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-lg italic text-zinc-200">
              &ldquo;Da quando uso Lama d&apos;Oro ho l&apos;agenda sempre piena e so
              esattamente quanto incasso ogni giorno. Il programma porta-un-amico mi ha
              portato decine di clienti nuovi.&rdquo;
            </p>
            <p className="mt-4 text-sm text-zinc-500">— Marco, titolare barbershop</p>
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="mx-auto max-w-4xl px-5 pb-24 pt-8 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Pronto a far brillare il tuo salone?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Attiva il tuo gestionale in pochi minuti e offri ai clienti un&apos;esperienza
          di prenotazione da cinque stelle.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/login">Inizia ora, è gratis</Link>
        </Button>
      </section>

      <footer className="border-t border-zinc-800/70 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-zinc-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-gold" />
            <span className="font-display text-zinc-300">Lama d&apos;Oro</span>
          </div>
          <p>© {new Date().getFullYear()} Lama d&apos;Oro — Gestionale per barbershop</p>
        </div>
      </footer>
    </div>
  );
}
