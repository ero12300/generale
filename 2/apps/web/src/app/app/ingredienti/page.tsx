import { demoStore } from "@/lib/demo-store";
import { formatEuro } from "@ristoprofit/types";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IngredientiPage() {
  const ingredients = demoStore.listIngredients();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Anagrafica"
        title="Ingredienti"
        subtitle={`${ingredients.length} ingredienti monitorati`}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {ingredients.map((ing) => (
          <Card key={ing.id} glow>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{ing.name}</CardTitle>
                {ing.last_price_change_percent && ing.last_price_change_percent > 5 && (
                  <Badge variant="gold">+{ing.last_price_change_percent}%</Badge>
                )}
              </div>
              <p className="text-sm text-emerald-700 mt-2">
                {formatEuro(ing.unit_price_cents)} / {ing.unit}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Scarto {ing.waste_percent}% · Scorta: {ing.current_stock ?? "—"} {ing.unit}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
