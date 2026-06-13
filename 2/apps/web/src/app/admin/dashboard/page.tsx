import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const kpis = demoStore.getAdminKpis();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Emotive interno"
        title="Dashboard Admin"
        subtitle="Panoramica MRR, clienti e attività commerciali"
        accent="amber"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="MRR mensile" value={formatEuro(kpis.mrr_cents)} highlight />
        <KpiCard label="Clienti attivi" value={String(kpis.active_clients)} />
        <KpiCard label="Nuovi questo mese" value={String(kpis.new_clients_month)} />
        <KpiCard label="In prova" value={String(kpis.trial_clients)} />
        <KpiCard label="Setup venduti" value={String(kpis.setups_sold_month)} />
        <KpiCard label="Disdette mese" value={String(kpis.churned_month)} />
        <KpiCard label="Conversione demo" value={`${kpis.conversion_rate}%`} />
        <KpiCard label="Modulo top" value={kpis.top_module} />
      </div>
      <Card glow>
        <CardHeader>
          <CardTitle>Clienti da richiamare</CardTitle>
          <ul className="mt-4 text-sm text-zinc-400 space-y-2">
            <li>• Bar Centrale — setup incompleto (3 ricette mancanti)</li>
            <li>• Gelateria Artigianale — abbonamento in scadenza tra 7 giorni</li>
          </ul>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
