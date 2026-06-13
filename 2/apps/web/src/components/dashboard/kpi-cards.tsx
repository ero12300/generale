import { cn } from "@/lib/utils";
import { formatEuro, formatPercent } from "@ristoprofit/types";
import type { FoodCostResult } from "@ristoprofit/types";
import { Card, CardHeader } from "@/components/ui/card";
import { FoodCostBadge } from "@/components/ui/badge";

export function FoodCostTable({ items }: { items: FoodCostResult[] }) {
  return (
    <Card className="overflow-hidden p-0" glow>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-stone-500 text-left text-xs uppercase tracking-wider bg-stone-50/80">
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
              <tr
                key={fc.recipe_id}
                className="border-b border-[var(--border-subtle)] hover:bg-emerald-50/40 transition-colors"
              >
                <td className="p-4 font-medium text-stone-900">{fc.recipe_name}</td>
                <td className="p-4 text-stone-600">{formatEuro(fc.sale_price_cents)}</td>
                <td className="p-4 text-stone-600">{formatEuro(fc.cost_per_portion_cents)}</td>
                <td className="p-4 text-stone-800">{formatPercent(fc.food_cost_percent)}</td>
                <td className="p-4 text-emerald-700 font-medium">{formatEuro(fc.gross_margin_cents)}</td>
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
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        highlight && "border-emerald-300/60 bg-gradient-to-br from-emerald-50 to-white"
      )}
      glow={highlight}
    >
      <CardHeader className="mb-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] text-stone-500 uppercase tracking-wider font-medium">{label}</p>
          {icon}
        </div>
        <p
          className={cn(
            "font-display text-2xl md:text-3xl font-semibold mt-2 tracking-tight",
            highlight ? "text-emerald-700" : "text-stone-900"
          )}
        >
          {value}
        </p>
        {sub && <p className="text-xs text-stone-500 mt-1">{sub}</p>}
      </CardHeader>
    </Card>
  );
}
