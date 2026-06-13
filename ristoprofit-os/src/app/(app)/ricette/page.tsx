import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { computeFoodCost, type FoodCostStatus } from "@/lib/food-cost";
import { formatCents, formatRatio } from "@/lib/money";
import { DEMO_RECIPES, DEMO_UNITS_SOLD } from "@/lib/demo-data";

const STATUS_VARIANT: Record<FoodCostStatus, "ottimo" | "buono" | "attenzione" | "critico"> = {
  ottimo: "ottimo",
  buono: "buono",
  attenzione: "attenzione",
  critico: "critico",
};

export default function RicettePage() {
  const rows = DEMO_RECIPES.map((r) => ({
    recipe: r,
    fc: computeFoodCost(r),
    unitsSold: DEMO_UNITS_SOLD[r.id] ?? 0,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ricette</h1>
          <p className="text-sm text-zinc-400">
            {rows.length} ricette · food cost e margine calcolati automaticamente.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/food-cost">+ Nuova ricetta</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs uppercase text-zinc-500">
                <th className="px-4 py-3 font-medium">Piatto</th>
                <th className="px-4 py-3 font-medium">Costo/porz.</th>
                <th className="px-4 py-3 font-medium">Prezzo</th>
                <th className="px-4 py-3 font-medium">Margine</th>
                <th className="px-4 py-3 font-medium">Venduti</th>
                <th className="px-4 py-3 font-medium">Food cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ recipe, fc, unitsSold }) => (
                <tr
                  key={recipe.id}
                  className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3 font-medium">{recipe.name}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {formatCents(fc.costPerPortionCents)}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">
                    {formatCents(fc.salePriceCents)}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-300">
                    {formatCents(fc.grossMarginCents)}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{unitsSold}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[fc.status]}>
                      {formatRatio(fc.foodCostRatio)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
