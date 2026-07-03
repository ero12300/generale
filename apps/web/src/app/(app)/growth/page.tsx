import type { ComponentType } from "react";
import { Gift, Megaphone, TrendingUp } from "lucide-react";
import { barberCampaigns, getReferralRevenue } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Crescita</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Campaign engine per sconti, retention e porta un amico senza aumentare il lavoro manuale.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={Megaphone} label="Campagne attive" value={String(2)} />
        <SummaryCard icon={Gift} label="Ricavi referral" value={formatCurrency(getReferralRevenue())} />
        <SummaryCard icon={TrendingUp} label="Redemption medio" value="25%" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campagne in corso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {barberCampaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-2xl border border-zinc-800 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium">{campaign.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {campaign.offer} · Audience: {campaign.audience}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{campaign.channel}</Badge>
                  <Badge variant={campaign.status === "active" ? "success" : "warning"}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  Redemption {(campaign.redemption_rate * 100).toFixed(0)}%
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  Ricavi generati {formatCurrency(campaign.revenue_generated)}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-400" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
