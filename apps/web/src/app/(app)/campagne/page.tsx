import { BadgePercent, Gift, Megaphone, Send, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { campaigns, customers, formatCents } from "@/lib/barber-data";

export default function CampagnePage() {
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === "active");
  const revenue = campaigns.reduce((total, campaign) => total + campaign.revenueCents, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge>
            <Megaphone className="mr-1 h-3 w-3" aria-hidden />
            Marketing automation
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Campagne sconti e referral</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Crea offerte per aumentare ritorni, passaparola e abbonamenti Pro.
          </p>
        </div>
        <Button>
          <Send className="h-4 w-4" aria-hidden />
          Nuova campagna
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi icon={BadgePercent} label="Campagne attive" value={String(activeCampaigns.length)} />
        <Kpi icon={UsersRound} label="Clienti target" value={String(customers.length)} />
        <Kpi icon={Gift} label="Ricavi attribuiti" value={formatCents(revenue)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className={campaign.status === "active" ? "border-emerald-500/20" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <p className="mt-2 text-sm text-zinc-500">{campaign.audience}</p>
                </div>
                <Badge variant={campaign.status === "active" ? "success" : "secondary"}>{campaign.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="text-sm font-medium text-amber-100">{campaign.offer}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-zinc-950/70 p-3">
                  <p className="text-zinc-500">Conversione</p>
                  <p className="mt-1 font-semibold">{Math.round(campaign.conversionRate * 100)}%</p>
                </div>
                <div className="rounded-xl bg-zinc-950/70 p-3">
                  <p className="text-zinc-500">Ricavi</p>
                  <p className="mt-1 font-semibold">{formatCents(campaign.revenueCents)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-amber-500/20 bg-amber-500/10">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Idea monetizzazione consigliata</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Offri il piano Basic per agenda e CRM, il piano Pro per automazioni sconti/referral
            e il piano Elite per multi-sede, report avanzati e onboarding concierge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="mb-4 h-5 w-5 text-amber-300" aria-hidden />
        <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
