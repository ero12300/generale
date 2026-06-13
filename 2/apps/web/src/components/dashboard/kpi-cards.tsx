import { formatEuro, formatPercent } from "@ristoprofit/types";
import type { FoodCostResult } from "@ristoprofit/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodCostBadge } from "@/components/ui/badge";

export function FoodCostTable({ items }: { items: FoodCostResult[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400 text-left">
              <th className="p-4 font-medium">Prodotto</th>
              <th className="p-4 font-medium">Prezzo</th>
              <th className="p-4 font-medium">Costo</th>
              <th className="p-4 font-medium">Food cost</th>
              <th className="p-4 font-medium">Margine</th>
              <th className="p-4 font-medium">Stato</th>
            </tr>
          </thead>
          <tbody>
            {items.map((fc) => (
              <tr key={fc.recipe_id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                <td className="p-4 font-medium">{fc.recipe_name}</td>
                <td className="p-4">{formatEuro(fc.sale_price_cents)}</td>
                <td className="p-4">{formatEuro(fc.cost_per_portion_cents)}</td>
                <td className="p-4">{formatPercent(fc.food_cost_percent)}</td>
                <td className="p-4 text-emerald-400">{formatEuro(fc.gross_margin_cents)}</td>
                <td className="p-4"><FoodCostBadge status={fc.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function KpiCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="mb-0">
        <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
        <CardTitle className={highlight ? "text-emerald-400" : ""}>{value}</CardTitle>
        {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
      </CardHeader>
    </Card>
  );
}
