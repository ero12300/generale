import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/layout/page-header";

const statusLabels: Record<string, string> = {
  demo_scheduled: "Demo fissata",
  won: "Chiuso vinto",
  new: "Nuovo",
};

export default function PartnerLeadPage() {
  const leads = demoStore.getReferralLeads();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Segnalazioni"
        title="I tuoi lead"
        subtitle={`${leads.length} contatti segnalati`}
        actions={<Button size="sm">+ Nuovo lead</Button>}
      />
      <div className="space-y-3">
        {leads.map((l) => (
          <Card key={l.id} glow>
            <CardHeader className="flex flex-row justify-between items-start mb-0">
              <div>
                <CardTitle>{l.client_name}</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">{l.phone} · {l.city}</p>
                {l.plan_tier && (
                  <p className="text-xs text-zinc-400 mt-1">Piano: {l.plan_tier}</p>
                )}
              </div>
              <div className="text-right">
                <Badge>{statusLabels[l.status] ?? l.status}</Badge>
                {l.reward_cents ? (
                  <p className="text-sm text-emerald-700 mt-2 font-medium">
                    {formatEuro(l.reward_cents)}
                  </p>
                ) : null}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
