import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerDashboardPage() {
  const leads = demoStore.getReferralLeads();
  const pending = leads.filter((l) => l.status !== "won").length;
  const totalReward = leads.reduce((s, l) => s + (l.reward_cents ?? 0), 0);

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Programma referral"
        title="Portale Partner"
        subtitle={
          <>
            Codice partner:{" "}
            <span className="text-emerald-700 font-medium">EMOTIVE-MESSINA</span>
          </>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Segnalazioni" value={String(leads.length)} />
        <KpiCard label="In corso" value={String(pending)} />
        <KpiCard label="Premi maturati" value={formatEuro(totalReward)} highlight />
      </div>
      <Card glow>
        <CardHeader>
          <CardTitle>Ultimi lead</CardTitle>
          <ul className="mt-4 space-y-3 text-sm">
            {leads.map((l) => (
              <li key={l.id} className="flex justify-between border-b border-[var(--border-subtle)] pb-2 last:border-0">
                <span className="text-zinc-200">{l.client_name} — {l.city}</span>
                <span className="text-zinc-500 capitalize">{l.status.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
