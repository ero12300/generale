import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesDashboardPage() {
  const agent = demoStore.getSalesAgent();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Area venditori"
        title={`Ciao, ${agent.name}`}
        subtitle={agent.is_senior ? "Livello Senior · Provvigioni potenziate" : "Livello Base"}
        accent="blue"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Clienti attivi" value={String(agent.active_clients)} />
        <KpiCard label="MRR generato" value={formatEuro(agent.mrr_cents)} highlight />
        <KpiCard label="Provvigioni maturate" value={formatEuro(agent.pending_commission_cents)} />
        <KpiCard label="Livello" value={agent.is_senior ? "Senior" : "Base"} />
      </div>
      <Card glow>
        <CardHeader>
          <CardTitle>Classifica venditori</CardTitle>
          <ol className="mt-4 text-sm space-y-3 text-zinc-300">
            <li className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
              <span>1. Marco Venditore</span>
              <span className="text-emerald-400">645 € MRR</span>
            </li>
            <li className="flex justify-between border-b border-[var(--border-subtle)] pb-2">
              <span>2. Sara Commerciale</span>
              <span className="text-zinc-500">516 € MRR</span>
            </li>
            <li className="flex justify-between">
              <span>3. Luca Agent</span>
              <span className="text-zinc-500">387 € MRR</span>
            </li>
          </ol>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
