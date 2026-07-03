import { Crown, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents, saasPlans } from "@/lib/barber-data";
import { CheckoutButton } from "./checkout-button";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge>
          <Sparkles className="mr-1 h-3 w-3" aria-hidden />
          Monetizzazione SaaS
        </Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Piani e abbonamenti</h1>
        <p className="mt-1 max-w-3xl text-sm text-zinc-400">
          Modello consigliato: Basic per agenda e CRM, Pro per crescita e automazioni,
          Elite per multi-sede e barber shop premium.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
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
              <p className="text-3xl font-semibold">
                {formatCents(plan.priceCents)}
                <span className="text-sm text-zinc-500">/mese</span>
              </p>
              <ul className="space-y-2 text-sm text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <CheckoutButton planId={plan.id} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-300" aria-hidden />
            Stack produzione consigliato
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <StackItem title="Vercel" text="Deploy Next.js, preview automatiche, variabili env e dominio custom." />
          <StackItem title="Firebase" text="Auth, Firestore clienti/prenotazioni e Cloud Messaging per reminder." />
          <StackItem title="Stripe" text="Checkout abbonamenti, customer portal, fatture e webhook rinnovi." />
        </CardContent>
      </Card>
    </div>
  );
}

function StackItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}
