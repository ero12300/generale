import Link from "next/link";
import {
  Euro,
  Users,
  Percent,
  HandCoins,
  AlertTriangle,
  TrendingUp,
  PackageMinus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCents, formatRatio, roundCents } from "@/lib/money";
import { computeFoodCost } from "@/lib/food-cost";
import { buildDailyReport } from "@/lib/report";
import {
  DEMO_RECIPES,
  DEMO_UNITS_SOLD,
  DEMO_KPI_TODAY,
  DEMO_PRICE_TRENDS,
  DEMO_LOW_STOCK,
  DEMO_REVENUE_7D,
} from "@/lib/demo-data";

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-400"
      : tone === "warn"
        ? "text-amber-400"
        : "text-zinc-100";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-zinc-400">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
        {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const report = buildDailyReport(
    DEMO_RECIPES,
    DEMO_UNITS_SOLD,
    DEMO_KPI_TODAY,
    DEMO_PRICE_TRENDS,
  );

  const critical = DEMO_RECIPES.map((r) => computeFoodCost(r))
    .filter((r) => r.status === "critico" || r.status === "attenzione")
    .sort((a, b) => b.foodCostRatio - a.foodCostRatio);

  const maxRevenue = Math.max(...DEMO_REVENUE_7D.map((d) => d.revenueCents));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Riepilogo economico di oggi · {report.date}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/food-cost">+ Aggiungi ricetta</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/report">Vedi report</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={Euro}
          label="Incasso oggi"
          value={formatCents(report.revenueCents, 0)}
          hint={`${report.covers} coperti`}
        />
        <Kpi
          icon={HandCoins}
          label="Margine lordo stimato"
          value={formatCents(report.grossMarginCents, 0)}
          tone="good"
          hint="Incasso − food cost − personale"
        />
        <Kpi
          icon={Percent}
          label="Food cost medio"
          value={formatRatio(report.foodCostRatio)}
          tone={report.foodCostRatio > 0.35 ? "warn" : "good"}
        />
        <Kpi
          icon={Users}
          label="Incidenza personale"
          value={formatRatio(report.staffIncidenceRatio)}
          tone={report.staffIncidenceRatio > 0.35 ? "warn" : "default"}
          hint={`Scontrino medio ${formatCents(report.averageTicketCents)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Incasso 7 giorni */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Incasso ultimi 7 giorni</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-44 items-end gap-3">
              {DEMO_REVENUE_7D.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-emerald-500/70"
                      style={{ height: `${(d.revenueCents / maxRevenue) * 100}%` }}
                      title={formatCents(d.revenueCents, 0)}
                    />
                  </div>
                  <span className="text-xs text-zinc-500">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Azioni consigliate */}
        <Card>
          <CardHeader>
            <CardTitle>Azioni consigliate</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-zinc-300">
              {report.actions.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300">
                    {i + 1}
                  </span>
                  {a}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Prodotti critici */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" /> Prodotti critici
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {critical.length === 0 && (
              <p className="text-sm text-zinc-500">Nessun prodotto critico.</p>
            )}
            {critical.map((c) => (
              <div key={c.recipeId} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{c.recipeName}</span>
                <Badge variant={c.status === "critico" ? "critico" : "attenzione"}>
                  {formatRatio(c.foodCostRatio)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ingredienti in aumento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-400" /> Ingredienti in aumento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.risingIngredients.map((t) => (
              <div key={t.ingredient} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{t.ingredient}</span>
                <Badge variant="critico">+{Math.round(t.changeRatio * 100)}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sotto scorta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageMinus className="h-4 w-4 text-amber-400" /> Sotto scorta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DEMO_LOW_STOCK.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{s.name}</span>
                <span className="text-xs text-zinc-500">
                  {s.qty} / min {s.min}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm font-semibold">
              Prodotto più venduto: {report.bestSeller} · Più redditizio:{" "}
              {report.mostProfitable}
            </p>
            <p className="text-xs text-zinc-500">
              Costo personale oggi {formatCents(report.staffCostCents, 0)} ·
              Food cost {formatCents(roundCents(report.revenueCents * report.foodCostRatio), 0)}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/menu">
              Analisi menu <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
