import Link from "next/link";
import { Upload, Plus } from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { formatEuro, formatPercent } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodCostBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardPage() {
  const dash = demoStore.getCustomerDashboard();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 text-sm">{demoStore.locationName} — Piano Pro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/app/fatture"><Upload className="h-4 w-4" /> Carica fattura</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/app/ricette"><Plus className="h-4 w-4" /> Aggiungi ricetta</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Incasso oggi" value={formatEuro(dash.today_revenue_cents)} highlight />
        <KpiCard label="Margine stimato" value={formatEuro(dash.estimated_margin_cents)} />
        <KpiCard label="Food cost medio" value={formatPercent(dash.avg_food_cost_percent)} />
        <KpiCard
          label="Costo personale"
          value={dash.staff_cost_percent ? formatPercent(dash.staff_cost_percent) : "—"}
          sub="su incasso"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prodotti critici</CardTitle>
            <div className="mt-4 space-y-3">
              {dash.critical_products.map((p) => (
                <div key={p.recipe_id} className="flex items-center justify-between text-sm">
                  <span>{p.recipe_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatPercent(p.food_cost_percent)}</span>
                    <FoodCostBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingredienti in aumento</CardTitle>
            <div className="mt-4 space-y-2">
              {dash.price_increases.map((i) => (
                <div key={i.name} className="flex justify-between text-sm">
                  <span>{i.name}</span>
                  <Badge variant="gold">+{i.change_percent}%</Badge>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sotto scorta</CardTitle>
            <div className="mt-4 space-y-2">
              {dash.low_stock.map((i) => (
                <div key={i.name} className="flex justify-between text-sm text-amber-400">
                  <span>{i.name}</span>
                  <span>{i.current} / min {i.min}</span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Azioni consigliate</CardTitle>
            <ol className="mt-4 space-y-2 text-sm text-zinc-300 list-decimal list-inside">
              {dash.recommended_actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
