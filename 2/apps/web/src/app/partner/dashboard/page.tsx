import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerDashboardPage() {
  const leads = demoStore.getReferralLeads();
  const pending = leads.filter((l) => l.status !== "won").length;
  const totalReward = leads.reduce((s, l) => s + (l.reward_cents ?? 0), 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Portale Referral</h1>
      <p className="text-zinc-400 text-sm">Codice partner: <span className="text-emerald-400">EMOTIVE-MESSINA</span></p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard label="Segnalazioni" value={String(leads.length)} />
        <KpiCard label="In corso" value={String(pending)} />
        <KpiCard label="Premi maturati" value={formatEuro(totalReward)} highlight />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ultimi lead</CardTitle>
          <ul className="mt-4 space-y-2 text-sm">
            {leads.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span>{l.client_name} — {l.city}</span>
                <span className="text-zinc-500">{l.status}</span>
              </li>
            ))}
          </ul>
        </CardHeader>
      </Card>
    </div>
  );
}
