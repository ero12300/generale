import { Badge, Card, Section, statusTone } from "@/components/ui";
import { ingredientMap, recipesWithCost } from "@/lib/demo-insights";
import { ingredientCostCents } from "@/lib/foodcost";
import { formatEuro, formatPct } from "@/lib/money";

export const metadata = { title: "Ricette" };

export default function RicettePage() {
  const rows = recipesWithCost();

  return (
    <Section
      title="Ricette"
      description="Distinta base con grammature, scarti e costo per ingrediente"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {rows.map(({ recipe, cost }) => (
          <Card key={recipe.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-ink">{recipe.name}</h3>
                <p className="text-xs text-warmgray">
                  {recipe.category} · {recipe.soldLast30} vendite/30gg · IVA {recipe.vatPct}%
                </p>
              </div>
              <Badge tone={statusTone(cost.status)}>{cost.status}</Badge>
            </div>
            <ul className="mt-3 divide-y divide-stone-100 text-sm">
              {recipe.items.map((item) => {
                const ing = ingredientMap.get(item.ingredientId)!;
                return (
                  <li key={item.ingredientId} className="flex justify-between py-1.5">
                    <span>
                      {ing.name}{" "}
                      <span className="text-warmgray">
                        {item.quantity} {ing.unit === "pz" ? "pz" : ing.unit === "l" ? "ml" : "g"}
                        {item.wastePct > 0 ? ` · scarto ${item.wastePct}%` : ""}
                      </span>
                    </span>
                    <span className="tabular-nums">
                      {formatEuro(ingredientCostCents(ing, item.quantity, item.wastePct))}
                    </span>
                  </li>
                );
              })}
              {recipe.packagingCents > 0 ? (
                <li className="flex justify-between py-1.5">
                  <span className="text-warmgray">Packaging</span>
                  <span className="tabular-nums">{formatEuro(recipe.packagingCents)}</span>
                </li>
              ) : null}
            </ul>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-stone-50 p-3 text-sm">
              <div>
                <p className="text-xs text-warmgray">Costo porzione</p>
                <p className="font-semibold tabular-nums">{formatEuro(cost.costPerPortionCents)}</p>
              </div>
              <div>
                <p className="text-xs text-warmgray">Food cost</p>
                <p className="font-semibold tabular-nums">{formatPct(cost.foodCostPct)}</p>
              </div>
              <div>
                <p className="text-xs text-warmgray">Margine</p>
                <p className="font-semibold tabular-nums text-profit">{formatEuro(cost.grossMarginCents)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
