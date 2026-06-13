import { Wallet, Users, AlertTriangle } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { formatEuro } from "@ristoprofit/types";

export default function PersonalePage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Costo lavoro"
        title="Personale"
        subtitle="Incidenza del personale sull'incasso giornaliero"
      />
      <div className="grid md:grid-cols-3 gap-4">
        <KpiCard
          label="Incasso oggi"
          value={formatEuro(243000)}
          icon={<Wallet className="h-4 w-4 text-emerald-500/60" />}
        />
        <KpiCard
          label="Costo personale stimato"
          value={formatEuro(52000)}
          icon={<Users className="h-4 w-4 text-zinc-600" />}
        />
        <KpiCard
          label="Incidenza su incasso"
          value="35,8%"
          sub="Attenzione: incidenza elevata"
          highlight
          icon={<AlertTriangle className="h-4 w-4 text-amber-500/60" />}
        />
      </div>
    </PageContainer>
  );
}
