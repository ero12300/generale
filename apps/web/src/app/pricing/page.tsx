import Link from "next/link";
import { ArrowLeft, Check, Crown, ReceiptEuro } from "lucide-react";
import { barberPlans } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Torna alla home
          </Link>
          <Badge className="w-fit">
            <ReceiptEuro className="mr-1 h-3.5 w-3.5" aria-hidden />
            Monetizzazione Stripe-first
          </Badge>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight">Prezzi pensati per vendere l’app in abbonamento</h1>
            <p className="mt-2 text-zinc-400">
              Struttura semplice da capire, con upgrade naturali verso team, analytics, referral e
              multi-sede.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {barberPlans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.recommended ? "border-amber-500/40 bg-amber-500/10" : "border-white/10 bg-white/5"}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="capitalize">{plan.tier}</CardTitle>
                  {plan.recommended ? <Badge>Più venduto</Badge> : <Badge variant="secondary">Core</Badge>}
                </div>
                <CardDescription>{plan.seats}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-semibold">{formatCurrency(plan.monthly_price)}</p>
                  <p className="text-sm text-zinc-500">oppure {formatCurrency(plan.yearly_price)} annuale</p>
                </div>
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-emerald-400" aria-hidden />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-400">
                  Fee booking Stripe: {plan.booking_fee_percent}%
                </div>
                <Button className="w-full" variant={plan.recommended ? "default" : "secondary"} asChild>
                  <Link href="/dashboard">Apri preview</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-300" aria-hidden />
              Strategia di monetizzazione consigliata
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
              Prezzo basso per entrare, poi upsell su Pro quando servono campagne e team.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
              Commissione ridotta sui pagamenti per chi usa il booking integrato con Stripe.
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
              White-label e multi-store come add-on ad alto margine per barber evoluti.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
