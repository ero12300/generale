import { Check, CreditCard, TrendingUp } from "lucide-react";
import { StripeCheckoutButton } from "@/components/barber/stripe-checkout-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberRepository } from "@/lib/barber/repository";
import { estimateMonthlySubscriptionRevenue } from "@/lib/barber/metrics";
import { formatCurrencyCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const repo = await getBarberRepository();
  const plans = await repo.listPlans();
  const proPlan = plans.find((plan) => plan.id === "pro");
  const revenueAt25 = proPlan ? estimateMonthlySubscriptionRevenue(proPlan.monthly_price_cents, 25) : 0;

  return (
    <div className="space-y-6">
      <div>
        <Badge>Monetizzazione SaaS</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Piani abbonamento e Stripe</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Vendi il gestionale ad altri barber shop con funzioni base, pro e multi-sede.
        </p>
      </div>

      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Scenario ricavi ricorrenti</p>
              <p className="text-sm text-zinc-400">
                25 saloni sul piano Pro generano {formatCurrencyCents(revenueAt25)} / mese.
              </p>
            </div>
          </div>
          <Badge variant="success">MRR scalabile</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={plan.highlighted ? "border-amber-500/50 bg-amber-500/10" : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant={plan.highlighted ? "default" : "secondary"}>
                  {plan.highlighted ? "consigliato" : plan.id}
                </Badge>
                <CreditCard className="h-5 w-5 text-amber-400" />
              </div>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.tagline}</CardDescription>
              <p className="pt-3 text-3xl font-semibold">
                {formatCurrencyCents(plan.monthly_price_cents)}
                <span className="text-sm font-normal text-zinc-500"> / mese</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-500">
                {plan.limits.monthly_bookings
                  ? `${plan.limits.monthly_bookings} prenotazioni/mese`
                  : "Prenotazioni illimitate"}{" "}
                - {plan.limits.seats} seat - {plan.limits.automations} automazioni
              </div>
              <StripeCheckoutButton planId={plan.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
