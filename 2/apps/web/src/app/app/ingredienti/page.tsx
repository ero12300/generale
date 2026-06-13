import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IngredientiPage() {
  const ingredients = demoStore.listIngredients();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Ingredienti</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {ingredients.map((ing) => (
          <Card key={ing.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{ing.name}</CardTitle>
                {ing.last_price_change_percent && ing.last_price_change_percent > 5 && (
                  <Badge variant="gold">+{ing.last_price_change_percent}%</Badge>
                )}
              </div>
              <p className="text-sm text-emerald-400 mt-2">
                {formatEuro(ing.unit_price_cents)} / {ing.unit}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Scarto {ing.waste_percent}% · Scorta: {ing.current_stock ?? "—"} {ing.unit}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
