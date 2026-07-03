import { CheckCircle2, Crown, Server, ShieldCheck } from "lucide-react";
import { barberPlans, platformReadiness } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Piano SaaS</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Vista strategica per rendere il prodotto scalabile, monetizzabile e pronto al deploy.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-300" aria-hidden />
              Stack consigliato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-300">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              Frontend e deploy su <span className="font-medium text-zinc-100">Vercel</span> con Next.js 15.
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              Auth, database e realtime su <span className="font-medium text-zinc-100">Firebase</span>.
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              Billing e monetizzazione ricorrente su <span className="font-medium text-zinc-100">Stripe</span>.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" aria-hidden />
              Readiness ambiente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ReadinessRow
              label="Deploy target"
              value={platformReadiness.deployment}
              ready
            />
            <ReadinessRow
              label="Firebase env"
              value={platformReadiness.firebaseConfigured ? "configurato" : "manca setup env"}
              ready={platformReadiness.firebaseConfigured}
            />
            <ReadinessRow
              label="Stripe env"
              value={platformReadiness.stripeConfigured ? "configurato" : "manca setup env"}
              ready={platformReadiness.stripeConfigured}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-300" aria-hidden />
            Gating funzionale consigliato
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {barberPlans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium capitalize">{plan.tier}</p>
                {plan.recommended ? <Badge>Focus</Badge> : <Badge variant="secondary">Tier</Badge>}
              </div>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(plan.monthly_price)}</p>
              <p className="mt-2 text-sm text-zinc-400">{plan.features.join(" · ")}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ReadinessRow({
  label,
  value,
  ready,
}: {
  label: string;
  value: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div>
        <p className="text-sm font-medium text-zinc-100">{label}</p>
        <p className="text-xs text-zinc-500">{value}</p>
      </div>
      <div className={`flex items-center gap-2 text-sm ${ready ? "text-emerald-300" : "text-amber-300"}`}>
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        {ready ? "ready" : "to do"}
      </div>
    </div>
  );
}
