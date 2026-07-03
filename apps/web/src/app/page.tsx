import Link from "next/link";
import { ArrowRight, CalendarDays, Crown, Scissors, Sparkles, Users, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listBarberPlans } from "@/lib/barber-demo";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { formatCurrency } from "@/lib/utils";

const pillars = [
  {
    icon: CalendarDays,
    title: "Prenotazioni premium",
    description:
      "Agenda in tempo reale, slot smart, reminder e gestione walk-in senza caos operativo.",
  },
  {
    icon: Users,
    title: "CRM clienti",
    description:
      "Storico visite, preferenze, ticket medio, referral e campagne riattivazione in un solo posto.",
  },
  {
    icon: WalletCards,
    title: "Incassi e monetizzazione",
    description:
      "Controllo cassa, mix pagamenti, upsell e piani SaaS con Stripe per vendere il software ad altri barber.",
  },
];

export default function Home() {
  const plans = listBarberPlans();
  const firebaseReady = isFirebaseConfigured();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-10 lg:px-10 lg:py-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
              <Scissors className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-amber-300">ATELIER BARBER SUITE</p>
              <p className="text-sm text-zinc-500">Gestionale premium per barbiere + prodotto SaaS</p>
            </div>
          </div>
          <div className="hidden gap-2 md:flex">
            <Badge variant="secondary">Vercel ready</Badge>
            <Badge variant={firebaseReady ? "success" : "warning"}>
              {firebaseReady ? "Firebase collegato" : "Firebase ready"}
            </Badge>
            <Badge variant="default">Stripe monetization</Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Badge variant="default" className="w-fit">
              Premium booking - CRM - incassi - referral
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                L&apos;app premium per trasformare un barber shop in un business ricorrente.
              </h1>
              <p className="max-w-2xl text-lg text-zinc-400">
                Una sola piattaforma per prendere prenotazioni, gestire clienti, tracciare incassi e
                trasformare il tuo gestionale in un SaaS vendibile in abbonamento.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Apri la demo operativa <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/agenda">Vai all&apos;agenda</Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Metric label="Ticket medio" value="EUR 48" detail="con upsell servizi premium" />
              <Metric label="Reminder no-show" value="-32%" detail="riduzione attese perse" />
              <Metric label="Referral attivi" value="+18" detail="clienti via porta un amico" />
            </div>
          </div>

          <Card className="border-amber-500/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-amber-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                Architettura consigliata
              </CardTitle>
              <CardDescription>
                Stack pensato per scalare da singolo barbiere a SaaS multi-salone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="font-medium text-zinc-100">Frontend</p>
                <p className="mt-1 text-zinc-400">Next.js su Vercel con UI premium e performance elevate.</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="font-medium text-zinc-100">Dati & auth</p>
                <p className="mt-1 text-zinc-400">
                  Firebase per auth, clienti, prenotazioni e notifiche; demo locale pronta anche senza credenziali.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="font-medium text-zinc-100">Monetizzazione</p>
                <p className="mt-1 text-zinc-400">
                  Stripe per piani Starter / Pro / Multi-store con upgrade e billing ricorrente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-zinc-900 bg-zinc-900/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-8 md:grid-cols-3 lg:px-10">
          {pillars.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-zinc-950/60">
              <CardHeader>
                <div className="mb-3 w-fit rounded-xl border border-amber-500/30 bg-amber-500/10 p-2">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="mb-8 space-y-2">
          <Badge variant="secondary">Prezzi pensati per monetizzare</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">Piani SaaS pronti da vendere</h2>
          <p className="max-w-2xl text-zinc-400">
            Parti da funzioni base per il singolo barber e sali con automazioni, multi-operatore e multi-sede.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.id === "pro" ? "border-amber-500/40 bg-amber-500/5" : ""}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.id === "pro" && <Badge variant="default">Piu richiesto</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-semibold">{formatCurrency(plan.monthly_price)}</p>
                  <p className="text-sm text-zinc-500">
                    oppure {formatCurrency(plan.yearly_price)} / anno
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 text-amber-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.id === "pro" ? "default" : "secondary"} className="w-full">
                  <Link href="/dashboard">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="bg-zinc-900/70">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
        <p className="mt-1 text-sm text-zinc-500">{detail}</p>
      </CardContent>
    </Card>
  );
}
