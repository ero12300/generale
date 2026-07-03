"use client";

import {
  BarChart3,
  CalendarCheck,
  Check,
  Gift,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, SectionHeading, Spinner } from "@/components/ui";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import { PLANS } from "@/lib/types";

export default function LandingPage() {
  const { state, loading } = useStore();

  return (
    <main className="relative overflow-hidden">
      <BackgroundDecor />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-gold-400" aria-hidden />
          <span className="font-display text-xl font-semibold tracking-wide">
            BarberSuite
          </span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Navigazione principale">
          <Link href="/app">
            <Button variant="ghost">Area gestionale</Button>
          </Link>
          <Link href="/prenota">
            <Button>Prenota ora</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 text-center md:pt-24">
        <div className="animate-fade-up space-y-6">
          <Badge tone="gold">
            <Sparkles className="mr-1 h-3 w-3" aria-hidden /> Esperienza premium
          </Badge>
          <h1 className="font-display mx-auto max-w-3xl text-5xl font-semibold leading-tight text-cream md:text-7xl">
            L&apos;arte del barbiere,
            <span className="text-gold-400"> il rigore del gestionale.</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-cream/60">
            Prenotazioni online, cassa e incassi, database clienti e campagne
            porta-un-amico. Tutto in un&apos;unica suite elegante, pronta per il tuo
            salone.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/prenota">
              <Button className="px-8 py-3 text-base">
                <CalendarCheck className="h-4 w-4" aria-hidden /> Prenota un
                appuntamento
              </Button>
            </Link>
            <Link href="/app">
              <Button variant="outline" className="px-8 py-3 text-base">
                Entra nel gestionale
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Servizi / listino */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading
          eyebrow="Listino"
          title="I nostri rituali"
          subtitle="Ogni servizio è un'esperienza curata nei dettagli: consulenza, precisione e prodotti selezionati."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {loading || !state ? (
            <Spinner label="Carico il listino…" />
          ) : (
            state.services
              .filter((s) => s.active)
              .map((service) => (
                <Card
                  key={service.id}
                  className="group flex items-start justify-between gap-4 transition hover:border-gold-500/30"
                >
                  <div>
                    <h3 className="font-display text-xl text-cream">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-cream/50">
                      {service.description}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-widest text-cream/40">
                      {service.durationMinutes} minuti
                    </p>
                  </div>
                  <p className="font-display shrink-0 text-2xl text-gold-400">
                    {formatEuro(service.priceCents)}
                  </p>
                </Card>
              ))
          )}
        </div>
      </section>

      {/* Funzioni gestionale */}
      <section className="relative z-10 border-y border-white/5 bg-ink-900/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Per il titolare"
            title="Una suite completa per far crescere il salone"
            subtitle="BarberSuite non è solo prenotazioni: è il gestionale interno che tiene sotto controllo incassi, clienti e promozioni."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<BarChart3 className="h-5 w-5" aria-hidden />}
              title="Incassi & KPI"
              text="Registro cassa giornaliero, ticket medio, incassi per barbiere e metodo di pagamento."
            />
            <FeatureCard
              icon={<CalendarCheck className="h-5 w-5" aria-hidden />}
              title="Agenda prenotazioni"
              text="Slot intelligenti per barbiere, conferme e chiusura appuntamento con incasso automatico."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" aria-hidden />}
              title="Database clienti"
              text="Schede cliente con storico, consenso marketing e codice referral personale."
            />
            <FeatureCard
              icon={<Gift className="h-5 w-5" aria-hidden />}
              title="Campagne & referral"
              text="Codici sconto percentuali o fissi e programma porta-un-amico per riempire l'agenda."
            />
          </div>
        </div>
      </section>

      {/* Pricing SaaS */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24" id="prezzi">
        <SectionHeading
          eyebrow="Abbonamento"
          title="Scegli il piano per la tua barberia"
          subtitle="Inizia con il piano Base e passa a Pro quando vuoi sbloccare campagne sconto, referral e clienti illimitati. Pagamenti gestiti con Stripe."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {Object.values(PLANS).map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.id === "pro"
                  ? "relative border-gold-500/40 shadow-[0_0_60px_-20px] shadow-gold-500/30"
                  : undefined
              }
            >
              {plan.id === "pro" ? (
                <span className="absolute -top-3 right-6">
                  <Badge tone="gold">Consigliato</Badge>
                </span>
              ) : null}
              <h3 className="font-display text-2xl text-cream">{plan.label}</h3>
              <p className="mt-2">
                <span className="font-display text-4xl text-gold-400">
                  {formatEuro(plan.priceMonthlyCents)}
                </span>
                <span className="text-sm text-cream/50"> /mese</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-cream/70">
                <PlanItem>
                  {plan.maxCustomers === null
                    ? "Clienti illimitati"
                    : `Fino a ${plan.maxCustomers} clienti`}
                </PlanItem>
                <PlanItem>
                  {plan.maxBarbers === null
                    ? "Barbieri illimitati"
                    : `Fino a ${plan.maxBarbers} barbieri`}
                </PlanItem>
                <PlanItem>Prenotazioni online illimitate</PlanItem>
                <PlanItem>Registro incassi e KPI</PlanItem>
                <PlanItem muted={!plan.campaigns}>
                  Campagne sconto {plan.campaigns ? "" : "(solo Pro)"}
                </PlanItem>
                <PlanItem muted={!plan.referralProgram}>
                  Programma porta-un-amico {plan.referralProgram ? "" : "(solo Pro)"}
                </PlanItem>
                <PlanItem muted={!plan.csvExport}>
                  Export CSV incassi {plan.csvExport ? "" : "(solo Pro)"}
                </PlanItem>
              </ul>
              <Link href="/app/abbonamento" className="mt-8 block">
                <Button
                  variant={plan.id === "pro" ? "primary" : "outline"}
                  className="w-full"
                >
                  Attiva {plan.label}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-cream/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} BarberSuite — Gestionale premium per
            barberie.
          </p>
          <p>Vercel + Firebase + Stripe · Demo senza credenziali</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className="space-y-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
        {icon}
      </span>
      <h3 className="font-display text-lg text-cream">{title}</h3>
      <p className="text-sm leading-relaxed text-cream/50">{text}</p>
    </Card>
  );
}

function PlanItem({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <li className={`flex items-start gap-2 ${muted ? "text-cream/30" : ""}`}>
      <Check
        className={`mt-0.5 h-4 w-4 shrink-0 ${muted ? "text-cream/20" : "text-gold-400"}`}
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-gold-600/5 blur-3xl" />
    </div>
  );
}
