import { FoodCostCalculator } from "@/components/food-cost-calculator";

export default function FoodCostPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Food Cost</h1>
        <p className="text-sm text-zinc-400">
          Inserisci ingredienti, grammature e prezzi: il costo, il food cost % e
          il prezzo consigliato si aggiornano in tempo reale.
        </p>
      </div>
      <FoodCostCalculator />
    </div>
  );
}
