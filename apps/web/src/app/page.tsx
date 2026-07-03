import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Database,
  Megaphone,
  Scissors,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberRepository } from "@/lib/barber/repository";
import { formatCurrencyCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

const modules = [
  {
    icon: CalendarCheck,
    title: "Prenotazioni integrate",
    text: "Pagina pubblica, richieste online, agenda interna e stato appuntamento.",
  },
  {
    icon: Database,
    title: "Database clienti",
    text: "Schede cliente, spesa totale, visite, segmenti VIP e clienti a rischio.",
  },
  {
    icon: Megaphone,
    title: "Sconti e referral",
    text: "Campagne porta un amico, rientro clienti dormienti e target incassi.",
  },
  {
    icon: CreditCard,
    title: "Monetizzazione SaaS",
    text: "Piani Basic, Pro ed Elite con checkout Stripe per vendere abbonamenti.",
  },
];

export default async function Home() {
  const repo = await getBarberRepository();
  const [metrics, plans] = await Promise.all([repo.getDashboardMetrics(), repo.listPlans()]);
  const proPlan = plans.find((plan) => plan.id === "pro");

  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <section className="relative border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#5b3511_0%,transparent_36%),radial-gradient(circle_at_80%_10%,#1f2937_0%,transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="space-y-8">
            <nav className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
                <Scissors className="h-6 w-6 text-amber-400" />
                Barber Suite
              </Link>
              <Link href="/dashboard" className="text-sm text-zinc-300 hover:text-amber-200">
                Apri demo
              </Link>
            </nav>

            <div className="space-y-5">
              <Badge>Web app Vercel + Firebase ready</Badge>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Il gestionale premium per barbieri che vogliono incassare di piu.
              </h1>
              <p className="max-w-2xl text-lg text-zinc-400">
                Prenotazioni, clienti, incassi, campagne sconto e abbonamenti Stripe in un unico prodotto scalabile.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Entra nel gestionale <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/prenota">Prova prenotazione cliente</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroStat label="Incasso oggi" value={formatCurrencyCents(metrics.today_revenue_cents)} />
              <HeroStat label="Clienti CRM" value={String(metrics.customers_total)} />
              <HeroStat label="Piano Pro" value={proPlan ? `${formatCurrencyCents(proPlan.monthly_price_cents)}/mese` : "-"} />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-amber-500/10 blur-3xl" />
            <Card className="relative border-amber-500/30 bg-zinc-950/80 shadow-2xl shadow-black">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Live dashboard</Badge>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <CardTitle className="text-2xl">Atelier Barber Premium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <PanelMetric label="Mese" value={formatCurrencyCents(metrics.month_revenue_cents)} />
                  <PanelMetric label="Occupazione" value={`${Math.round(metrics.occupancy_rate * 100)}%`} />
                  <PanelMetric label="Referral" value={String(metrics.referral_customers)} />
                  <PanelMetric label="Campagne" value={String(metrics.active_campaigns)} />
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">Prossima crescita</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">
                    Trasforma ogni salone in abbonamento: Basic per partire, Pro per crescere, Elite per catene.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge variant="secondary">Moduli prodotto</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Tutto quello che serve per partire e scalare.</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="bg-zinc-900/60">
              <CardContent className="space-y-4 p-5">
                <Icon className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function PanelMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
