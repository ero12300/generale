import { demoStore } from "@/lib/demo-store";
import { formatEuro, formatPercent } from "@ristoprofit/types";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";

export default function ReportPage() {
  const report = demoStore.getCustomerDashboard().last_report;
  if (!report) return null;

  return (
    <PageContainer className="max-w-2xl">
      <PageHeader
        eyebrow="Report operativo"
        title="Report giornaliero"
        subtitle={report.report_date}
      />
      <Card glow>
        <CardHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-zinc-400">Incasso</span><span className="font-medium">{formatEuro(report.revenue_cents)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Coperti</span><span>{report.covers}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Scontrino medio</span><span>{formatEuro(report.avg_ticket_cents)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Food cost stimato</span><span>{formatPercent(report.estimated_food_cost_percent)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-400">Costo personale</span><span>{formatEuro(report.estimated_staff_cost_cents)}</span></div>
            <div className="flex justify-between border-t border-[var(--border-subtle)] pt-3">
              <span className="text-zinc-400">Margine lordo stimato</span>
              <span className="text-emerald-700 font-medium">{formatEuro(report.estimated_gross_margin_cents)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <p><span className="text-zinc-500">Più venduto:</span> {report.top_seller}</p>
            <p><span className="text-zinc-500">Più redditizio:</span> {report.most_profitable}</p>
            <p><span className="text-zinc-500">Critico:</span> {report.critical_product}</p>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Azioni consigliate</p>
            <ol className="list-decimal list-inside text-sm text-stone-700 space-y-1.5">
              {report.recommended_actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </div>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
