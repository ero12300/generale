import { Gift, Megaphone, Repeat2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listBarberCampaigns, listBarberClients, listBarberPlans } from "@/lib/barber-demo";
import { formatCurrency } from "@/lib/utils";

export default function GrowthPage() {
  const campaigns = listBarberCampaigns();
  const clients = listBarberClients();
  const plans = listBarberPlans();
  const referralClients = clients.filter((client) => client.referred_by_client_id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Growth & referral</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Campagne sconto, &quot;porta un amico&quot; e differenziazione Basic vs Pro.
          </p>
        </div>
        <Badge variant="default">Monetizzazione pronta</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GrowthStat title="Clienti referral" value={String(referralClients.length)} icon={<Gift className="h-5 w-5 text-amber-400" />} />
        <GrowthStat title="Campagne attive" value={String(campaigns.filter((item) => item.status === "active").length)} icon={<Megaphone className="h-5 w-5 text-amber-400" />} />
        <GrowthStat title="Piani vendibili" value={String(plans.length)} icon={<Sparkles className="h-5 w-5 text-amber-400" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Motore campagne</CardTitle>
          <CardDescription>
            Struttura pronta per automazioni email/WhatsApp o push da Firebase.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{campaign.name}</p>
                <Badge variant={campaign.status === "active" ? "success" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{campaign.description}</p>
              <div className="mt-4 space-y-1 text-sm">
                <p className="text-zinc-300">Reward: {campaign.reward}</p>
                <p className="text-zinc-500">{campaign.conversions} conversioni</p>
                <p className="text-amber-300">{formatCurrency(campaign.revenue_generated)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat2 className="h-5 w-5 text-amber-400" />
              Porta un amico
            </CardTitle>
            <CardDescription>
              Offerta concreta per aumentare la clientela senza abbassare troppo i margini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <p>1. Il cliente condivide il suo codice referral personale.</p>
            <p>2. Il nuovo cliente prenota dal widget o dal banco con il codice.</p>
            <p>3. Entrambi ricevono reward: sconto o trattamento aggiuntivo.</p>
            <p>4. Il gestionale misura revenue, visite di ritorno e barbiere associato.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funnel Basic to Pro</CardTitle>
            <CardDescription>
              Come monetizzare il software vendendolo in abbonamento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-amber-300">{formatCurrency(plan.monthly_price)}/mese</p>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{plan.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GrowthStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
