import { Badge, Section, Table, statusTone } from "@/components/ui";
import { recipesWithCost } from "@/lib/demo-insights";
import { formatEuro, formatPct } from "@/lib/money";
import { FoodCostSimulator } from "./simulator";

export const metadata = { title: "Food Cost" };

export default function FoodCostPage() {
  const rows = recipesWithCost().sort((a, b) => b.cost.foodCostPct - a.cost.foodCostPct);

  return (
    <>
      <Section
        title="Food cost per prodotto"
        description="Costo porzione, food cost %, margine lordo e prezzi consigliati (IVA inclusa)"
      >
        <Table
          headers={[
            "Prodotto",
            "Prezzo vendita",
            "Costo porzione",
            "Food cost",
            "Margine lordo",
            "Prezzo min.",
            "Prezzo ideale",
            "Stato",
          ]}
        >
          {rows.map(({ recipe, cost }) => (
            <tr key={recipe.id}>
              <td className="px-4 py-3 font-medium text-ink">{recipe.name}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(recipe.salePriceCents)}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(cost.costPerPortionCents)}</td>
              <td className="px-4 py-3 tabular-nums">{formatPct(cost.foodCostPct)}</td>
              <td className="px-4 py-3 tabular-nums text-profit">{formatEuro(cost.grossMarginCents)}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(cost.minPriceCents)}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(cost.idealPriceCents)}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(cost.status)}>{cost.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section
        title="Simulatore food cost"
        description="Provi un prezzo o un costo diverso e veda subito margine e food cost"
      >
        <FoodCostSimulator />
      </Section>
    </>
  );
}
