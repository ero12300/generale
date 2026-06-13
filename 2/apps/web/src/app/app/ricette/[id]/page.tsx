import { notFound } from "next/navigation";
import { demoStore } from "@/lib/demo-store";
import { calculateFoodCost } from "@/lib/food-cost/engine";
import { formatEuro, formatPercent } from "@ristoprofit/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodCostBadge } from "@/components/ui/badge";

export default async function RicettaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = demoStore.getRecipe(id);
  if (!recipe) notFound();

  const items = demoStore.getRecipeItems(id);
  const fc = calculateFoodCost(recipe, items);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <p className="text-zinc-400 text-sm">{recipe.category}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardHeader className="mb-0"><p className="text-xs text-zinc-500">Prezzo vendita</p><CardTitle>{formatEuro(fc.sale_price_cents)}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="mb-0"><p className="text-xs text-zinc-500">Costo porzione</p><CardTitle>{formatEuro(fc.cost_per_portion_cents)}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="mb-0"><p className="text-xs text-zinc-500">Food cost</p><CardTitle>{formatPercent(fc.food_cost_percent)}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="mb-0"><p className="text-xs text-zinc-500">Stato</p><div className="mt-2"><FoodCostBadge status={fc.status} /></div></CardHeader></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingredienti</CardTitle>
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="text-zinc-500 text-left border-b border-zinc-800">
                <th className="pb-2">Ingrediente</th>
                <th className="pb-2">Quantità</th>
                <th className="pb-2">Prezzo unit.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-800/50">
                  <td className="py-2">{item.ingredient_name}</td>
                  <td className="py-2">{item.quantity} {item.unit}</td>
                  <td className="py-2">{formatEuro(item.unit_price_cents ?? 0)}/{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardHeader>
      </Card>

      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardHeader>
          <CardTitle>Suggerimento</CardTitle>
          <p className="text-sm text-zinc-300 mt-2">{fc.suggestion}</p>
          <p className="text-sm text-emerald-400 mt-2">
            Prezzo minimo consigliato: {formatEuro(fc.min_recommended_price_cents)} ·
            Ideale: {formatEuro(fc.ideal_recommended_price_cents)}
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
