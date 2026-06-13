import { demoStore } from "@/lib/demo-store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categoryColors: Record<string, "default" | "gold" | "muted"> = {
  star: "default",
  puzzle: "gold",
  workhorse: "muted",
  dog: "muted",
};

const categoryLabels: Record<string, string> = {
  star: "Star — spingere",
  puzzle: "Puzzle — migliorare visibilità",
  workhorse: "Cavallo da lavoro — aumentare prezzo",
  dog: "Dog — eliminare",
};

export default function MenuPage() {
  const engineering = demoStore.getMenuEngineering();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Menu Engineering</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Classificazione prodotti per vendite e margine
        </p>
      </div>
      <div className="space-y-4">
        {engineering.map((item) => (
          <Card key={item.recipe_id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base">{item.recipe_name}</CardTitle>
                <Badge variant={categoryColors[item.category]}>
                  {categoryLabels[item.category]}
                </Badge>
              </div>
              <div className="flex gap-6 text-sm text-zinc-400 mt-3">
                <span>Vendite: {item.sales_count}</span>
                <span>Food cost: {item.food_cost_percent}%</span>
              </div>
              <p className="text-sm text-zinc-300 mt-2">{item.action}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
