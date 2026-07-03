import { Gift, Megaphone, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberRepository } from "@/lib/barber/repository";
import { formatCurrencyCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const repo = await getBarberRepository();
  const campaigns = await repo.listCampaigns();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Marketing automatico</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Campagne sconti e porta un amico</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Template pronti per WhatsApp, SMS o email quando collegherai un provider messaggi.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.id}
            className={campaign.active ? "border-amber-500/30 bg-amber-500/5" : undefined}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <Badge variant={campaign.active ? "success" : "secondary"}>
                  {campaign.active ? "attiva" : "pausa"}
                </Badge>
                {campaign.type === "referral" ? (
                  <Gift className="h-5 w-5 text-amber-400" />
                ) : (
                  <Megaphone className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.incentive}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-sm text-zinc-300">
                &quot;{campaign.message}&quot;
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Audience</p>
                  <p className="font-medium">{campaign.audience}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Redemption</p>
                  <p className="font-medium">{campaign.expected_redemptions}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-zinc-500">Obiettivo incassi</p>
                  <p className="font-medium text-amber-300">
                    {formatCurrencyCents(campaign.revenue_target_cents)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800"
              >
                <Send className="h-4 w-4" />
                Prepara invio
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
