import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  computeMenuEngineering,
  CATEGORY_LABELS,
  type MenuCategory,
} from "@/lib/menu-engineering";
import { formatCents, formatRatio } from "@/lib/money";
import { buildMenuItems } from "@/lib/demo-data";

const CATEGORY_VARIANT: Record<MenuCategory, "ottimo" | "gold" | "attenzione" | "critico"> = {
  star: "ottimo",
  puzzle: "gold",
  cavallo: "attenzione",
  dog: "critico",
};

const CATEGORY_HINT: Record<MenuCategory, string> = {
  star: "Vende tanto e margina bene",
  puzzle: "Margina bene ma vende poco",
  cavallo: "Vende tanto ma margina poco",
  dog: "Vende poco e margina poco",
};

export default function MenuPage() {
  const result = computeMenuEngineering(buildMenuItems());
  const order: MenuCategory[] = ["star", "puzzle", "cavallo", "dog"];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Menu Engineering</h1>
        <p className="text-sm text-zinc-400">
          Quali prodotti spingere, migliorare, aumentare o eliminare.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {order.map((cat) => (
          <Card key={cat}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <Badge variant={CATEGORY_VARIANT[cat]}>{CATEGORY_LABELS[cat]}</Badge>
                <span className="text-2xl font-bold">{result.counts[cat]}</span>
              </div>
              <p className="mt-2 text-xs text-zinc-500">{CATEGORY_HINT[cat]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prodotti del menu</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left text-xs uppercase text-zinc-500">
                <th className="px-4 py-3 font-medium">Prodotto</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Venduti</th>
                <th className="px-4 py-3 font-medium">Margine/u.</th>
                <th className="px-4 py-3 font-medium">Margine tot.</th>
                <th className="px-4 py-3 font-medium">Azione</th>
              </tr>
            </thead>
            <tbody>
              {[...result.items]
                .sort((a, b) => b.totalMarginCents - a.totalMarginCents)
                .map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-800/60 last:border-0 align-top hover:bg-zinc-800/30"
                  >
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={CATEGORY_VARIANT[item.category]}>
                        {CATEGORY_LABELS[item.category]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {item.unitsSold}
                      <span className="ml-1 text-xs text-zinc-500">
                        ({formatRatio(item.popularityShare)})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {formatCents(item.marginCents)}
                    </td>
                    <td className="px-4 py-3 font-medium text-emerald-300">
                      {formatCents(item.totalMarginCents, 0)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{item.action}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
