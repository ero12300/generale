import Link from "next/link";
import {
  CalendarCheck,
  ChartNoAxesCombined,
  Check,
  Gift,
  Scissors,
  Users,
  Wallet,
} from "lucide-react";
import { PLANS } from "@/lib/plans";
import { formatEuro } from "@/lib/money";
import { buttonGhost, buttonPrimary } from "@/components/ui";

const FEATURES = [
  {
    icon: Wallet,
    title: "Gestionale incassi",
    text: "Registra ogni servizio in pochi secondi. Cassa giornaliera, settimanale e mensile sempre sotto controllo, divisa per contanti e carta.",
  },
  {
    icon: CalendarCheck,
    title: "Prenotazioni integrate",
    text: "Agenda interna per il salone e pagina di prenotazione online per i tuoi clienti, con controllo automatico degli orari occupati.",
  },
  {
    icon: Users,
    title: "Database clienti",
    text: "Rubrica completa con storico visite e spesa totale. Riconosci i clienti migliori e coccolali come meritano.",
  },
  {
    icon: Gift,
    title: "Porta un Amico e sconti",
    text: "Ogni cliente ha un codice personale: chi porta un amico riceve un premio. Campagne sconto attivabili con un click.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Statistiche che contano",
    text: "Scontrino medio, andamento ultimi 7 giorni, sconti concessi: i numeri giusti per decidere prezzi e promozioni.",
  },
  {
    icon: Scissors,
    title: "Fatto per il salone",
    text: "Interfaccia elegante, veloce, usabile con una mano tra un taglio e l'altro. Zero formazione necessaria.",
  },
];

export default function LandingPage() {
  return (
    <div className="texture min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
            <Scissors className="h-4 w-4 text-gold-bright" aria-hidden />
          </span>
          <span className="font-display text-xl tracking-wide text-cream">
            BarberFlow
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/prenota" className={buttonGhost}>
            Prenota online
          </Link>
          <Link href="/app" className={buttonPrimary}>
            Entra nel gestionale
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">
          Il gestionale premium per barbieri
        </p>
        <h1 className="mx-auto max-w-3xl font-display text-5xl leading-tight text-cream md:text-6xl">
          Il tuo salone, <span className="text-gold-bright">in ordine</span>{" "}
          come la tua barba
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Incassi, prenotazioni, clienti e campagne Porta un Amico in un unico
          strumento elegante. Meno carta, più poltrona.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/app" className={buttonPrimary}>
            Prova la demo gratuita
          </Link>
          <a href="#prezzi" className={buttonGhost}>
            Vedi i piani
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-panel p-6 transition hover:border-gold/40"
            >
              <f.icon className="h-6 w-6 text-gold-bright" aria-hidden />
              <h3 className="mt-4 font-display text-lg text-cream">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="prezzi" className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="text-center font-display text-4xl text-cream">
          Un abbonamento, <span className="text-gold-bright">zero pensieri</span>
        </h2>
        <p className="mt-3 text-center text-muted">
          Inizia con il piano Base, passa a Pro quando il salone cresce.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {Object.values(PLANS).map((plan) => (
            <div
              key={plan.id}
              className={
                plan.id === "pro"
                  ? "gold-ring rounded-3xl border border-gold/50 bg-panel p-8"
                  : "rounded-3xl border border-line bg-panel p-8"
              }
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl text-cream">
                  {plan.name}
                </h3>
                {plan.id === "pro" ? (
                  <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                    Consigliato
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
              <p className="mt-6">
                <span className="font-display text-5xl text-gold-bright">
                  {formatEuro(plan.priceMonthlyCents)}
                </span>
                <span className="text-sm text-muted"> /mese</span>
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-cream/90"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-gold-bright"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/app/abbonamento"
                className={`${plan.id === "pro" ? buttonPrimary : buttonGhost} mt-8 w-full`}
              >
                Scegli {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-muted">
        BarberFlow — Vercel + Firebase + Stripe. Demo senza credenziali, dati in
        memoria.
      </footer>
    </div>
  );
}
