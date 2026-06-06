import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoStore } from "@/lib/demo-store";
import { formatCurrency, formatPercent } from "@/lib/utils";

// Ipotesi MVP: ogni nuovo deal in stage "rental" porta ~14.400€/anno netti
// (cifra che corrisponde alla logica in demoStore.getFreedomSnapshot).
const PASSIVE_INCOME_PER_DEAL = 14_400;

export default function FreedomPage() {
  const snapshot = demoStore.getFreedomSnapshot();
  const coverage = snapshot.coverage_ratio;
  const coverageLabel =
    coverage >= 1 ? "Copertura raggiunta" : coverage >= 0.5 ? "In crescita" : "Da costruire";
  const coverageVariant =
    coverage >= 1 ? "success" : coverage >= 0.5 ? "warning" : "danger";

  const gap = Math.max(snapshot.fixed_expenses - snapshot.passive_income, 0);
  const dealsNeeded = gap > 0 ? Math.ceil(gap / PASSIVE_INCOME_PER_DEAL) : 0;

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
          <div
            className="mx-auto mt-5 h-2 max-w-md overflow-hidden rounded-full bg-zinc-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(Math.min(coverage, 1) * 100)}
            aria-label="Percentuale di copertura"
          >
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${Math.min(coverage, 1) * 100}%` }}
            />
          </div>
          <p className="text-sm text-zinc-400 mt-4 max-w-md mx-auto">
            {coverage >= 1
              ? "Il reddito passivo copre le spese fisse. Ogni nuovo deal aumenta il margine di sicurezza."
              : `Mancano circa ${formatCurrency(gap)} annui di reddito passivo per la copertura completa${
                  dealsNeeded > 0
                    ? ` (~${dealsNeeded} deal in locazione da ${formatCurrency(PASSIVE_INCOME_PER_DEAL)}/anno)`
                    : ""
                }.`}
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
