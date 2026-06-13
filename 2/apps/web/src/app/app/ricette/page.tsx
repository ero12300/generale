import Link from "next/link";
import { demoStore } from "@/lib/demo-store";
import { FoodCostTable } from "@/components/dashboard/kpi-cards";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEuro } from "@ristoprofit/types";

export default function RicettePage() {
  const recipes = demoStore.listRecipes();
  const foodCosts = demoStore.getFoodCosts();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Food cost"
        title="Ricette e margini"
        subtitle={`${recipes.length} ricette · calcolo in tempo reale`}
      />
      <FoodCostTable items={foodCosts} />
      <div className="grid md:grid-cols-2 gap-4">
        {foodCosts.map((fc) => (
          <Card key={fc.recipe_id} glow>
            <CardHeader>
              <CardTitle>
                <Link href={`/app/ricette/${fc.recipe_id}`} className="hover:text-emerald-400 transition-colors">
                  {fc.recipe_name}
                </Link>
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-2">{fc.suggestion}</p>
              <p className="text-sm text-emerald-400 mt-2 font-medium">
                Prezzo ideale: {formatEuro(fc.ideal_recommended_price_cents)}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
