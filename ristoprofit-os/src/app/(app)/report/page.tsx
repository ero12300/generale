import { Mail, MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCents, formatRatio, roundCents } from "@/lib/money";
import { buildDailyReport } from "@/lib/report";
import {
  DEMO_RECIPES,
  DEMO_UNITS_SOLD,
  DEMO_KPI_TODAY,
  DEMO_PRICE_TRENDS,
} from "@/lib/demo-data";

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800/60 py-2 last:border-0">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function ReportPage() {
  const report = buildDailyReport(
    DEMO_RECIPES,
    DEMO_UNITS_SOLD,
    DEMO_KPI_TODAY,
    DEMO_PRICE_TRENDS,
  );
  const foodCostCents = roundCents(report.revenueCents * report.foodCostRatio);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report giornaliero</h1>
          <p className="text-sm text-zinc-400">{report.date}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <Mail className="h-4 w-4" /> Email
          </Button>
          <Button variant="secondary" size="sm">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="secondary" size="sm">
            <Send className="h-4 w-4" /> Telegram
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>REPORT GIORNALIERO — RistoProfit OS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <Line label="Incasso" value={formatCents(report.revenueCents, 0)} />
            <Line label="Coperti" value={String(report.covers)} />
            <Line label="Scontrino medio" value={formatCents(report.averageTicketCents)} />
            <Line label="Food cost stimato" value={`${formatRatio(report.foodCostRatio)} (${formatCents(foodCostCents, 0)})`} />
            <Line label="Costo personale stimato" value={formatCents(report.staffCostCents, 0)} />
            <Line label="Incidenza personale" value={formatRatio(report.staffIncidenceRatio)} />
            <Line label="Margine lordo stimato" value={formatCents(report.grossMarginCents, 0)} />
            <Line label="Prodotto più venduto" value={report.bestSeller} />
            <Line label="Prodotto più redditizio" value={report.mostProfitable} />
            <Line label="Prodotto critico" value={report.criticalProduct ?? "Nessuno"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ingredienti in aumento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {report.risingIngredients.map((t) => (
            <Badge key={t.ingredient} variant="critico">
              {t.ingredient} +{Math.round(t.changeRatio * 100)}%
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Azioni consigliate</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-zinc-300">
            {report.actions.map((a, i) => (
              <li key={i} className="flex gap-3">
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
  );
}
