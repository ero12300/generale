import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FreedomEditor } from "@/components/freedom/freedom-editor";
import { getDataRepository } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default async function FreedomPage() {
  const repo = await getDataRepository();
  const snapshot = await repo.getFreedomSnapshot();
  const coverage = snapshot.coverage_ratio;
  const coverageLabel =
    coverage >= 1 ? "Copertura raggiunta" : coverage >= 0.5 ? "In crescita" : "Da costruire";
  const coverageVariant =
    coverage >= 1 ? "success" : coverage >= 0.5 ? "warning" : "danger";

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

      <FreedomEditor initial={snapshot} />

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
            e salvati per la tua organizzazione.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
