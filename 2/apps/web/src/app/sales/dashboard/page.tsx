import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function SalesDashboardPage() {
  const agent = demoStore.getSalesAgent();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ciao, {agent.name}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Clienti attivi" value={String(agent.active_clients)} />
        <KpiCard label="MRR generato" value={formatEuro(agent.mrr_cents)} highlight />
        <KpiCard label="Provvigioni maturate" value={formatEuro(agent.pending_commission_cents)} />
        <KpiCard label="Livello" value={agent.is_senior ? "Senior" : "Base"} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Classifica venditori</CardTitle>
          <ol className="mt-4 text-sm space-y-2 text-zinc-300">
            <li>1. Marco Venditore — 645 € MRR</li>
            <li>2. Sara Commerciale — 516 € MRR</li>
            <li>3. Luca Agent — 387 € MRR</li>
          </ol>
        </CardHeader>
      </Card>
    </div>
  );
}
