import { demoStore } from "@/lib/demo-store";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
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
    <PageContainer>
      <PageHeader
        eyebrow="Menu engineering"
        title="Analisi menu"
        subtitle="Classificazione prodotti per vendite e margine"
      />
      <div className="space-y-4">
        {engineering.map((item) => (
          <Card key={item.recipe_id} glow>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle>{item.recipe_name}</CardTitle>
                <Badge variant={categoryColors[item.category]}>
                  {categoryLabels[item.category]}
                </Badge>
              </div>
              <div className="flex gap-6 text-sm text-zinc-400 mt-3">
                <span>Vendite: {item.sales_count}</span>
                <span>Food cost: {item.food_cost_percent}%</span>
              </div>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{item.action}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
