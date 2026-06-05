import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoStore } from "@/lib/demo-store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function FreedomPage() {
  const snapshot = demoStore.getFreedomSnapshot();
  const coverage = snapshot.coverage_ratio;
  const coverageLabel =
    coverage >= 1 ? "Copertura raggiunta" : coverage >= 0.5 ? "In crescita" : "Da costruire";
  const coverageVariant =
    coverage >= 1 ? "success" : coverage >= 0.5 ? "warning" : "danger";

  const blocks = [
    {
      title: "Entrate attive",
      value: formatCurrency(snapshot.active_income),
      desc: "Reddito da attività operative / lavoro",
    },
    {
      title: "Entrate passive",
      value: formatCurrency(snapshot.passive_income),
      desc: "Cash flow da immobili in locazione",
    },
    {
      title: "Uscite fisse",
      value: formatCurrency(snapshot.fixed_expenses),
      desc: "Spese holding, SRL e personale collegato",
    },
    {
      title: "Liquidità",
      value: formatCurrency(snapshot.liquidity),
      desc: "Cassa disponibile",
    },
    {
      title: "Riserve",
      value: formatCurrency(snapshot.reserves),
      desc: "Fondo emergenza e opportunità",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Indice di Libertà Finanziaria
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Quanto il reddito passivo copre le tue spese fisse
        </p>
      </div>

      <Card className="border-amber-600/30 bg-gradient-to-br from-amber-600/10 to-zinc-900">
        <CardContent className="p-8 text-center">
          <p className="text-sm text-zinc-400 uppercase tracking-widest mb-2">
            Freedom Coverage Ratio
          </p>
          <p className="text-5xl font-bold text-amber-400 mb-3">
            {formatPercent(coverage)}
          </p>
          <Badge variant={coverageVariant as "success" | "warning" | "danger"}>
            {coverageLabel}
          </Badge>
          <p className="text-sm text-zinc-400 mt-4 max-w-md mx-auto">
            {coverage >= 1
              ? "Il reddito passivo copre le spese fisse. Ogni nuovo deal aumenta il margine di sicurezza."
              : `Mancano circa ${formatCurrency(Math.max(snapshot.fixed_expenses - snapshot.passive_income, 0))} annui di reddito passivo per la copertura completa.`}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <Card key={block.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-zinc-400 font-normal">
                {block.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{block.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{block.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Formula</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400 space-y-2">
          <p>
            <strong className="text-zinc-200">Coverage Ratio</strong> = Entrate passive ÷ Uscite fisse
          </p>
          <p>
            Obiettivo: ≥ 100% per copertura completa delle spese da investimenti immobiliari.
          </p>
          <p className="text-xs pt-2 border-t border-zinc-800">
            Nomenclatura proprietaria — non associata a marchi terzi. I dati sono configurabili
            dalla dashboard patrimoniale della tua holding.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
