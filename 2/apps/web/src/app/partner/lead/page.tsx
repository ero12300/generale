import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, string> = {
  demo_scheduled: "Demo fissata",
  won: "Chiuso vinto",
  new: "Nuovo",
};

export default function PartnerLeadPage() {
  const leads = demoStore.getReferralLeads();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Segnalazioni</h1>
        <Button size="sm">+ Nuovo lead</Button>
      </div>
      <div className="space-y-3">
        {leads.map((l) => (
          <Card key={l.id}>
            <CardHeader className="flex flex-row justify-between items-start mb-0">
              <div>
                <CardTitle className="text-base">{l.client_name}</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">{l.phone} · {l.city}</p>
                {l.plan_tier && (
                  <p className="text-xs text-zinc-400 mt-1">Piano: {l.plan_tier}</p>
                )}
              </div>
              <div className="text-right">
                <Badge>{statusLabels[l.status] ?? l.status}</Badge>
                {l.reward_cents && (
                  <p className="text-xs text-emerald-400 mt-2">{formatEuro(l.reward_cents)}</p>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
