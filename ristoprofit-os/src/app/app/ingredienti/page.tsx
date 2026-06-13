import { Badge, Section, Table } from "@/components/ui";
import { ingredients, suppliers } from "@/lib/demo-data";
import { priceVariationPct } from "@/lib/foodcost";
import { formatEuro } from "@/lib/money";

export const metadata = { title: "Ingredienti" };

export default function IngredientiPage() {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));

  return (
    <Section
      title="Ingredienti"
      description="Prezzi aggiornati dalle fatture fornitori, con variazione rispetto all'ultimo acquisto"
    >
      <Table headers={["Ingrediente", "Fornitore", "Prezzo", "Variazione", "Scorta", "Scorta minima"]}>
        {ingredients.map((i) => {
          const variation = priceVariationPct(i);
          const low = i.stockQty < i.minStockQty;
          return (
            <tr key={i.id}>
              <td className="px-4 py-3 font-medium text-ink">{i.name}</td>
              <td className="px-4 py-3 text-warmgray">{supplierMap.get(i.supplierId)}</td>
              <td className="px-4 py-3 tabular-nums">
                {formatEuro(i.priceCents)}/{i.unit}
              </td>
              <td className="px-4 py-3">
                {variation > 1 ? (
                  <Badge tone="bad">+{variation.toFixed(1).replace(".", ",")}%</Badge>
                ) : variation < -1 ? (
                  <Badge tone="good">{variation.toFixed(1).replace(".", ",")}%</Badge>
                ) : (
                  <Badge tone="neutral">stabile</Badge>
                )}
              </td>
              <td className="px-4 py-3 tabular-nums">
                {i.stockQty} {i.unit}
              </td>
              <td className="px-4 py-3">
                {low ? <Badge tone="warn">sotto scorta ({i.minStockQty})</Badge> : `${i.minStockQty} ${i.unit}`}
              </td>
            </tr>
          );
        })}
      </Table>
    </Section>
  );
}
