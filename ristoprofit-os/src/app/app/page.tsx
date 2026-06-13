import Link from "next/link";
import { Badge, Card, Kpi, Section, statusTone } from "@/components/ui";
import { demoDashboard, suggestedActions } from "@/lib/demo-insights";
import { todaySales } from "@/lib/demo-data";
import { formatEuro, formatPct } from "@/lib/money";

export const metadata = { title: "Dashboard" };

export default function CustomerDashboard() {
  const d = demoDashboard();
  const actions = suggestedActions();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Incasso di oggi" value={formatEuro(todaySales.revenueCents)} hint={`${todaySales.covers} coperti · scontrino medio ${formatEuro(d.avgTicketCents)}`} tone="good" />
        <Kpi label="Margine stimato" value={formatEuro(d.estGrossMarginCents)} hint="al netto di food cost e personale" tone="gold" />
        <Kpi label="Food cost medio" value={formatPct(d.avgFoodCostPct)} hint="ponderato sulle vendite 30 gg" tone={d.avgFoodCostPct > 33 ? "warn" : "good"} />
        <Kpi label="Costo personale oggi" value={formatEuro(d.labor.laborCostCents)} hint={`incidenza ${formatPct(d.labor.laborPct)}`} tone={d.labor.status === "ok" ? "good" : d.labor.status === "attenzione" ? "warn" : "bad"} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/fatture" className="rounded-lg bg-profit px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
          + Carica fattura
        </Link>
        <Link href="/app/ricette" className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-stone-50">
          + Aggiungi ricetta
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Prodotti critici" description="Food cost sopra soglia: intervenire su prezzo o ricetta">
          <Card>
            <ul className="divide-y divide-stone-100">
              {d.critical.map(({ recipe, cost }) => (
                <li key={recipe.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-ink">{recipe.name}</p>
                    <p className="text-xs text-warmgray">
                      Food cost {formatPct(cost.foodCostPct)} · prezzo minimo {formatEuro(cost.minPriceCents)}
                    </p>
                  </div>
                  <Badge tone={statusTone(cost.status)}>{cost.status}</Badge>
                </li>
              ))}
              {d.critical.length === 0 ? (
                <li className="py-3 text-sm text-warmgray">Nessun prodotto critico.</li>
              ) : null}
            </ul>
          </Card>
        </Section>

        <Section title="Ingredienti in aumento" description="Variazione rispetto all'ultimo acquisto">
          <Card>
            <ul className="divide-y divide-stone-100">
              {d.risingIngredients.map(({ ingredient, variationPct }) => (
                <li key={ingredient.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-ink">{ingredient.name}</p>
                    <p className="text-xs text-warmgray">
                      {formatEuro(ingredient.priceCents)}/{ingredient.unit}
                    </p>
                  </div>
                  <Badge tone="bad">+{variationPct.toFixed(1).replace(".", ",")}%</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Sotto scorta" description="Prodotti da riordinare">
          <Card>
            <ul className="divide-y divide-stone-100">
              {d.lowStock.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <p className="font-medium text-ink">{i.name}</p>
                  <p className="text-sm text-warmgray">
                    {i.stockQty} / min {i.minStockQty} {i.unit}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </Section>

        <Section title="Azioni consigliate" description="Cosa correggere questa settimana">
          <Card>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink">
              {actions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <Link href="/app/report" className="mt-4 inline-block text-sm font-semibold text-profit hover:underline">
              Vedi report giornaliero →
            </Link>
          </Card>
        </Section>
      </div>
    </>
  );
}
