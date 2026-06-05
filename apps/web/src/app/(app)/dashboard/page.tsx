import Link from "next/link";
import { ArrowRight, TrendingUp, Wallet, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoStore } from "@/lib/demo-store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const deals = demoStore.listDeals();
  const freedom = demoStore.getFreedomSnapshot();
  const activeDeals = deals.filter((d) => d.stage !== "archived");
  const inAnalysis = deals.filter((d) => d.stage === "analysis").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Panoramica operativa — {demoStore.orgName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Building}
          label="Deal attivi"
          value={String(activeDeals.length)}
          sub={`${inAnalysis} in analisi`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Indice Libertà Finanziaria"
          value={formatPercent(freedom.coverage_ratio)}
          sub="Copertura spese da reddito passivo"
        />
        <KpiCard
          icon={Wallet}
          label="Liquidità"
          value={formatCurrency(freedom.liquidity)}
          sub={`Riserve: ${formatCurrency(freedom.reserves)}`}
        />
        <KpiCard
          icon={Wallet}
          label="Reddito passivo annuo"
          value={formatCurrency(freedom.passive_income)}
          sub={`Spese fisse: ${formatCurrency(freedom.fixed_expenses)}`}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Deal recenti</CardTitle>
          <Link href="/deals" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Vedi pipeline <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {deals.slice(0, 5).map((deal) => {
            const prop = demoStore.getProperty(deal.id);
            return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 hover:border-amber-600/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{deal.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {prop?.city ?? "—"} · {deal.strategy.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  {prop?.price_asked && (
                    <p className="text-sm text-amber-400">{formatCurrency(prop.price_asked)}</p>
                  )}
                  <Badge variant="secondary">{deal.stage}</Badge>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
          </div>
          <Icon className="h-5 w-5 text-amber-500/70" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
