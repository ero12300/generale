"use client";

import type { AnalysisResult, DealStrategy } from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

const signalVariant = {
  green: "success" as const,
  amber: "warning" as const,
  red: "danger" as const,
};

const signalLabel = {
  green: "Solido",
  amber: "Sensibile",
  red: "Critico",
};

interface ScenarioPanelProps {
  analysis: AnalysisResult;
  strategy?: DealStrategy;
}

function formatDscr(value: number | null | undefined, showRentalMetrics: boolean) {
  if (!showRentalMetrics) return "n/d";
  if (value == null) return "—";
  return value.toFixed(2);
}

function ScenarioCard({
  title,
  scenario,
  showRentalMetrics,
}: {
  title: string;
  scenario: AnalysisResult["base_case"];
  showRentalMetrics: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant={signalVariant[scenario.sensitivity_signal]}>
            {signalLabel[scenario.sensitivity_signal]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-sm">
        <Metric label="Capitale iniziale" value={formatCurrency(scenario.initial_capital_required)} />
        <Metric label="Costo totale" value={formatCurrency(scenario.total_project_cost)} />
        <Metric label="Margine netto" value={formatCurrency(scenario.net_sale_margin)} />
        <Metric label="NPV" value={formatCurrency(scenario.npv)} />
        <Metric label="IRR" value={scenario.irr != null ? formatPercent(scenario.irr) : "—"} />
        <Metric label="LTV" value={scenario.ltv != null ? formatPercent(scenario.ltv) : "—"} />
        <Metric label="DSCR" value={formatDscr(scenario.dscr, showRentalMetrics)} />
        <Metric
          label="Cash flow/mese"
          value={showRentalMetrics ? formatCurrency(scenario.monthly_cash_flow) : "n/d"}
        />
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-zinc-500 text-xs">{label}</p>
      <p className="font-medium text-zinc-100">{value}</p>
    </div>
  );
}

export function ScenarioPanel({ analysis, strategy }: ScenarioPanelProps) {
  const showRentalMetrics =
    strategy === "buy_renovate_rent" || strategy === "buy_hold_sell";

  return (
    <div className="space-y-4">
      <Card className="border-amber-600/30 bg-amber-600/5">
        <CardContent className="p-4 text-sm text-amber-100/90">
          {analysis.sensitivity_summary}
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScenarioCard title="Base case" scenario={analysis.base_case} showRentalMetrics={showRentalMetrics} />
        <ScenarioCard title="Prudent case" scenario={analysis.prudent_case} showRentalMetrics={showRentalMetrics} />
        <ScenarioCard title="Stress case" scenario={analysis.stress_case} showRentalMetrics={showRentalMetrics} />
      </div>
      <p className="text-xs text-zinc-500">
        I calcoli fiscali usano parametri SRL configurabili (IRES/IRAP). Non costituiscono consulenza professionale.
      </p>
    </div>
  );
}
