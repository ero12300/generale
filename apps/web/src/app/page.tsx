import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  CalendarCheck,
  CreditCard,
  Crown,
  Scissors,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { barberShop, formatCents, saasPlans } from "@/lib/barber-data";

export default function Home() {
  const proPlan = saasPlans.find((plan) => plan.id === "pro");

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.24),_transparent_32%),#09090b] text-zinc-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-8 md:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 focus-visible:rounded-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
              <Scissors className="h-5 w-5 text-amber-300" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-amber-200">ROYAL FADE OS</p>
              <p className="text-xs text-zinc-500">Vercel + Firebase + Stripe ready</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex" aria-label="Navigazione pubblica">
            <Link href="#funzioni" className="hover:text-zinc-100">
              Funzioni
            </Link>
            <Link href="#pricing" className="hover:text-zinc-100">
              Pricing
            </Link>
            <Link href="/booking" className="hover:text-zinc-100">
              Prenota
            </Link>
          </nav>
          <Button asChild>
            <Link href="/dashboard">Apri gestionale</Link>
          </Button>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-200">
              <Sparkles className="mr-1 h-3 w-3" aria-hidden />
              App premium per barber shop scalabili
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Prenotazioni, clienti e incassi in un unico salone digitale.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Un gestionale elegante per barber shop moderni: agenda online, CRM clienti,
                campagne sconto, porta un amico, report incassi e abbonamenti monetizzabili
                con Stripe.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/booking">
                  Prova booking cliente <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Vedi dashboard interna</Link>
              </Button>
            </div>
            <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
              <Metric label="Prenotazioni/mese" value={String(barberShop.bookingsThisMonth)} />
              <Metric label="Retention clienti" value={`${Math.round(barberShop.repeatRate * 100)}%`} />
              <Metric label="MRR SaaS target" value={formatCents(barberShop.subscriptionMrrCents)} />
            </div>
          </div>

          <Card className="relative overflow-hidden border-amber-500/20 bg-zinc-950/70 shadow-2xl shadow-amber-950/20">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Console oggi</CardTitle>
                  <p className="mt-2 text-sm text-zinc-400">{barberShop.name} · {barberShop.city}</p>
                </div>
                <Badge variant="secondary">Live demo</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["09:30", "Taglio premium", "Luca Bianchi", "Pagato"],
                ["10:15", "Taglio + barba", "Andrea Rossi", "In salone"],
                ["15:30", "Taglio + barba", "Simone Verdi", "Referral"],
              ].map(([time, service, customer, status]) => (
                <div key={`${time}-${customer}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-amber-200">{time} · {service}</p>
                      <p className="mt-1 text-sm text-zinc-400">{customer}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-300">{status}</Badge>
                  </div>
                </div>
              ))}
              <div className="grid gap-3 sm:grid-cols-2">
                <MiniFeature icon={WalletCards} title="Incassi" text="Card, cash e abbonamenti tracciati." />
                <MiniFeature icon={BadgePercent} title="Promo" text="Sconti e referral misurabili." />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="funzioni" className="mx-auto grid w-full max-w-7xl gap-4 px-6 pb-16 md:grid-cols-2 md:px-10 lg:grid-cols-4 lg:px-12">
        <Feature icon={CalendarCheck} title="Booking integrato" text="Pagina prenotazione pubblica con servizi, staff, orari e stato conferma." />
        <Feature icon={UsersRound} title="Database clienti" text="Storico visite, valore cliente, tag VIP e codice porta un amico." />
        <Feature icon={WalletCards} title="Gestionale incassi" text="KPI giornalieri, metodi pagamento, mance e ricavi per servizio." />
        <Feature icon={CreditCard} title="Monetizzazione" text="Piani Basic/Pro/Elite con checkout Stripe e portal futuri." />
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 lg:px-12">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">SaaS monetizzabile</p>
            <h2 className="mt-2 text-3xl font-semibold">Parti gratis in demo, vendi il piano Pro.</h2>
          </div>
          {proPlan && <p className="hidden max-w-md text-sm text-zinc-400 md:block">{proPlan.tagline}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {saasPlans.map((plan) => (
            <Card key={plan.id} className={plan.highlighted ? "border-amber-500/50 bg-amber-500/10" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.highlighted && <Crown className="h-5 w-5 text-amber-300" aria-hidden />}
                </div>
                <p className="text-sm text-zinc-400">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-3xl font-semibold">{formatCents(plan.priceCents)}<span className="text-sm text-zinc-500">/mese</span></p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={plan.highlighted ? "default" : "secondary"} className="w-full">
                  <Link href="/billing">Attiva {plan.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="mb-4 h-6 w-6 text-amber-300" aria-hidden />
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
      </CardContent>
    </Card>
  );
}

function MiniFeature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
      <Icon className="mb-3 h-5 w-5 text-amber-300" aria-hidden />
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
    </div>
  );
}
