import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { FoodCostTable } from "@/components/dashboard/kpi-cards";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEuro } from "@ristoprofit/types";

export default function RicettePage() {
  const recipes = demoStore.listRecipes();
  const foodCosts = demoStore.getFoodCosts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ricette e Food Cost</h1>
        <p className="text-zinc-400 text-sm mt-1">
          {recipes.length} ricette · margine e food cost calcolati in tempo reale
        </p>
      </div>
      <FoodCostTable items={foodCosts} />
      <div className="grid md:grid-cols-2 gap-4">
        {foodCosts.map((fc) => (
          <Card key={fc.recipe_id}>
            <CardHeader>
              <CardTitle className="text-base">
                <Link href={`/app/ricette/${fc.recipe_id}`} className="hover:text-emerald-400">
                  {fc.recipe_name}
                </Link>
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-2">{fc.suggestion}</p>
              <p className="text-sm text-emerald-400 mt-2">
                Prezzo ideale: {formatEuro(fc.ideal_recommended_price_cents)}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
