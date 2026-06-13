import Link from "next/link";
import { Upload, Plus, TrendingUp, Wallet, Percent, Users } from "lucide-react";
import { demoStore } from "@/lib/demo-store";
import { formatEuro, formatPercent } from "@ristoprofit/types";
import { KpiCard } from "@/components/dashboard/kpi-cards";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodCostBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardPage() {
  const dash = demoStore.getCustomerDashboard();

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400/80 font-medium mb-2">
            Cruscotto economico
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">{demoStore.locationName} · Piano Pro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/app/fatture"><Upload className="h-4 w-4" /> Carica fattura</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/app/ricette"><Plus className="h-4 w-4" /> Nuova ricetta</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Incasso oggi"
          value={formatEuro(dash.today_revenue_cents)}
          highlight
          icon={<Wallet className="h-4 w-4 text-emerald-500/60" />}
        />
        <KpiCard
          label="Margine stimato"
          value={formatEuro(dash.estimated_margin_cents)}
          icon={<TrendingUp className="h-4 w-4 text-zinc-600" />}
        />
        <KpiCard
          label="Food cost medio"
          value={formatPercent(dash.avg_food_cost_percent)}
          icon={<Percent className="h-4 w-4 text-zinc-600" />}
        />
        <KpiCard
          label="Costo personale"
          value={dash.staff_cost_percent ? formatPercent(dash.staff_cost_percent) : "—"}
          sub="su incasso"
          icon={<Users className="h-4 w-4 text-amber-500/60" />}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card glow>
          <CardHeader>
            <CardTitle>Prodotti critici</CardTitle>
            <div className="mt-4 space-y-3">
              {dash.critical_products.map((p) => (
                <div
                  key={p.recipe_id}
                  className="flex items-center justify-between text-sm py-2 border-b border-[var(--border-subtle)] last:border-0"
                >
                  <span className="text-zinc-200">{p.recipe_name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500 text-xs">{formatPercent(p.food_cost_percent)}</span>
                    <FoodCostBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card glow>
          <CardHeader>
            <CardTitle>Ingredienti in aumento</CardTitle>
            <div className="mt-4 space-y-2">
              {dash.price_increases.map((i) => (
                <div key={i.name} className="flex justify-between text-sm py-2">
                  <span className="text-zinc-300">{i.name}</span>
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
                <div key={i.name} className="flex justify-between text-sm text-amber-300/90 py-1">
                  <span>{i.name}</span>
                  <span className="text-xs">{i.current} / min {i.min}</span>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card className="border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <CardHeader>
            <CardTitle>Azioni consigliate oggi</CardTitle>
            <ol className="mt-4 space-y-2.5 text-sm text-zinc-300 list-decimal list-inside leading-relaxed">
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
