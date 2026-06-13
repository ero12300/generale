import { Badge, Section, Table } from "@/components/ui";
import { demoDashboard } from "@/lib/demo-insights";
import { formatEuro } from "@/lib/money";
import type { MenuCategory } from "@/lib/foodcost";

export const metadata = { title: "Menu Engineering" };

const CATEGORY_TONE: Record<MenuCategory, "good" | "gold" | "warn" | "bad"> = {
  Star: "good",
  Puzzle: "gold",
  "Cavallo da lavoro": "warn",
  Dog: "bad",
};

export default function MenuPage() {
  const { engineering } = demoDashboard();
  const sorted = [...engineering].sort((a, b) => b.soldLast30 - a.soldLast30);

  return (
    <>
      <Section
        title="Menu engineering"
        description="Classificazione dei prodotti per vendite e margine rispetto alla media del menu"
      >
        <Table headers={["Prodotto", "Vendite 30gg", "Margine lordo", "Categoria", "Azione consigliata"]}>
          {sorted.map((r) => (
            <tr key={r.recipeId}>
              <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
              <td className="px-4 py-3 tabular-nums">{r.soldLast30}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(r.grossMarginCents)}</td>
              <td className="px-4 py-3">
                <Badge tone={CATEGORY_TONE[r.category]}>{r.category}</Badge>
              </td>
              <td className="px-4 py-3 text-warmgray">{r.action}</td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Legenda" description="Come leggere le categorie">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Star", "Vende tanto e margina bene → spingere"],
              ["Puzzle", "Margina bene ma vende poco → migliorare descrizione/foto"],
              ["Cavallo da lavoro", "Vende tanto ma margina poco → aumentare prezzo o ridurre costo"],
              ["Dog", "Vende poco e margina poco → eliminare o sostituire"],
            ] as const
          ).map(([cat, desc]) => (
            <div key={cat} className="rounded-xl border border-stone-200 bg-white p-4 text-sm">
              <Badge tone={CATEGORY_TONE[cat as MenuCategory]}>{cat}</Badge>
              <p className="mt-2 text-warmgray">{desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
