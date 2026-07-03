import Link from "next/link";
import { ArrowRight, CalendarClock, Crown, Sparkles, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { barberStudio, subscriptionTiers } from "@/lib/barber-data";
import { formatCurrencyFromCents } from "@/lib/utils";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#2f1f0d_0%,#120f0b_35%,#050505_100%)] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <Badge className="border-white/10 bg-white/10 text-white">
              Premium barber OS · Vercel + Firebase + Stripe
            </Badge>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                Gestionale barber premium con prenotazioni, clienti, incassi e abbonamento SaaS.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Ho trasformato il progetto in una base moderna per un barber shop evoluto: agenda
                online, CRM clienti, campagne referral, controllo incassi e monetizzazione pronta
                per essere rivenduta ad altri saloni.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/dashboard">
                  Apri la suite
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
                <Link href="/growth">Vedi piani Basic / Pro</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <FeaturePill icon={CalendarClock} title="Booking integrato" text="Slot, reminder e depositi." />
              <FeaturePill icon={Wallet} title="Incassi chiari" text="Cash, card, online e margini." />
              <FeaturePill icon={Crown} title="CRM premium" text="VIP, referral e reactivation." />
            </div>
          </div>

          <Card className="overflow-hidden border-white/10 bg-white/5 shadow-2xl shadow-amber-950/30 backdrop-blur">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Concept studio</p>
                  <h2 className="mt-2 text-2xl font-semibold">{barberStudio.name}</h2>
                </div>
                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
                  Piano {barberStudio.plan.toUpperCase()}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {subscriptionTiers.map((tier) => (
                  <div key={tier.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="text-sm text-zinc-400">{tier.name}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">
                      {formatCurrencyFromCents(tier.monthly_price_cents)}
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">{tier.target}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-100">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Strategia monetizzazione consigliata
                </div>
                <p className="mt-3 text-sm leading-7 text-amber-50/85">
                  Avvia con piano Basic per singolo salone, fai upgrade a Pro per automazioni e no-show
                  protection, poi rivendi il format a catene o barber indipendenti con piano multi-location.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function FeaturePill({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <Icon className="h-5 w-5 text-amber-300" aria-hidden />
      <p className="mt-3 text-sm font-medium text-white">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{text}</p>
    </div>
  );
}
