import { Card, Section } from "@/components/ui";
import { demoDashboard, suggestedActions } from "@/lib/demo-insights";
import { todaySales } from "@/lib/demo-data";
import { formatEuro, formatPct } from "@/lib/money";

export const metadata = { title: "Report giornaliero" };

export default function ReportPage() {
  const d = demoDashboard();
  const actions = suggestedActions();

  return (
    <Section
      title="Report giornaliero"
      description="Inviato ogni sera via email; WhatsApp e Telegram in roadmap (piano Premium)"
    >
      <Card className="max-w-2xl">
        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-ink">
{`REPORT GIORNALIERO — RistoProfit OS
${todaySales.date} · Trattoria del Porto, Messina

Incasso: ${formatEuro(todaySales.revenueCents)}
Coperti: ${todaySales.covers}
Scontrino medio: ${formatEuro(d.avgTicketCents)}

Food cost stimato: ${formatPct(d.avgFoodCostPct)}
Costo personale stimato: ${formatEuro(d.labor.laborCostCents)} (${formatPct(d.labor.laborPct)})
Margine lordo stimato: ${formatEuro(d.estGrossMarginCents)}

Prodotto più venduto: ${d.bestSeller.recipe.name}
Prodotto più redditizio: ${d.mostProfitable.recipe.name}
${d.critical.length > 0 ? `Prodotto critico: ${d.critical[0].recipe.name}, food cost ${formatPct(d.critical[0].cost.foodCostPct)}` : "Nessun prodotto critico"}

Ingredienti in aumento:
${d.risingIngredients.map((r) => `- ${r.ingredient.name} +${r.variationPct.toFixed(0)}%`).join("\n")}

Azioni consigliate:
${actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`}
        </pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft">
            Scarica PDF
          </button>
          <button type="button" className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-ink hover:bg-stone-50">
            Invia via email
          </button>
        </div>
      </Card>
    </Section>
  );
}
