import Link from "next/link";
import { ArrowRight, CalendarDays, Crown, HandCoins, Scissors, Sparkles, Users } from "lucide-react";
import { barberCampaigns, barberPlans, barberServices, barberStudio, getTodayRevenue } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    title: "Agenda premium",
    description: "Booking integrato, slot chiari, gestione no-show e promemoria rapidi.",
    icon: CalendarDays,
  },
  {
    title: "CRM clienti",
    description: "Storico visite, spesa totale, referral e segmentazione per campagne.",
    icon: Users,
  },
  {
    title: "Controllo incassi",
    description: "Cash, POS e Stripe in una sola vista con ticket medio e margine giornaliero.",
    icon: HandCoins,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-8 md:px-10 lg:px-12">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
              <Scissors className="h-5 w-5 text-amber-300" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-zinc-200">ATELIER FADE OS</p>
              <p className="text-xs text-zinc-500">Vercel + Firebase + Stripe ready</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/pricing">Prezzi</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Apri la demo</Link>
            </Button>
          </div>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="w-fit">
                <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden />
                Premium barber SaaS
              </Badge>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
                La web app premium per far crescere un barber shop come un business in abbonamento.
              </h1>
              <p className="max-w-2xl text-lg text-zinc-400">
                Prenotazioni online, database clienti, incassi interni, sconti, porta un amico e piani
                SaaS monetizzabili con Stripe. Pensata per essere scalabile e vendibile in abbonamento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/book">
                  Prova il booking <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/dashboard">Vedi il gestionale</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Ticket medio demo" value={formatCurrency(44)} />
              <StatCard label="Incassi giornalieri" value={formatCurrency(getTodayRevenue())} />
              <StatCard label="Campagne attive" value={String(barberCampaigns.length)} />
            </div>
          </div>

          <Card className="overflow-hidden border-white/10 bg-white/5 shadow-2xl shadow-black/40">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{barberStudio.name}</CardTitle>
                  <CardDescription>{barberStudio.positioning}</CardDescription>
                </div>
                <Badge variant="success">Pro plan live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {pillars.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Icon className="h-5 w-5 text-amber-300" aria-hidden />
                    <p className="mt-3 font-medium">{title}</p>
                    <p className="mt-1 text-sm text-zinc-400">{description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-fuchsia-500/10 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-zinc-300">Offerta upsell più venduta</p>
                    <p className="mt-1 text-2xl font-semibold">Executive Package</p>
                  </div>
                  <p className="text-xl font-semibold text-amber-200">{formatCurrency(68)}</p>
                </div>
                <p className="mt-3 text-sm text-zinc-400">
                  Taglio premium, barba ritual e styling finale: ottimo per aumentare il margine.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {barberServices.map((service) => (
            <Card key={service.id} className="border-white/10 bg-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={service.premium ? "warning" : "secondary"}>
                    {service.category}
                  </Badge>
                  <p className="text-sm text-zinc-500">{service.duration_minutes} min</p>
                </div>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  Pricing progettato per premium feel e upsell ordinati.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-amber-200">{formatCurrency(service.price)}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle>Come lo monetizzi</CardTitle>
              <CardDescription>
                L’app non serve solo al tuo barber shop: nasce per diventare un prodotto vendibile ad
                altri barber.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <MonetizationBlock
                title="Abbonamento mensile"
                description="Starter, Pro, Elite con feature gating e team seats."
              />
              <MonetizationBlock
                title="Commissione booking"
                description="Fee ridotta sui pagamenti Stripe per chi usa il booking integrato."
              />
              <MonetizationBlock
                title="Add-on premium"
                description="Referral avanzato, multi-sede, analytics e white-label come upgrade."
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle>Piani consigliati</CardTitle>
              <CardDescription>Pricing disegnato per conversione e crescita MRR.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {barberPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-4 ${
                    plan.recommended
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">{plan.tier}</p>
                      {plan.recommended ? <Badge>Best seller</Badge> : null}
                    </div>
                    <p className="text-lg font-semibold">{formatCurrency(plan.monthly_price)}</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{plan.features.slice(0, 2).join(" · ")}</p>
                </div>
              ))}
              <Button variant="secondary" asChild className="w-full">
                <Link href="/pricing">Apri il listino completo</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MonetizationBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 text-amber-300" aria-hidden />
        <p className="font-medium">{title}</p>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
