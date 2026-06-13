import { Badge, Card, Section, Table } from "@/components/ui";
import { ingredients, suppliers } from "@/lib/demo-data";
import { formatEuro } from "@/lib/money";

export const metadata = { title: "Magazzino" };

export default function MagazzinoPage() {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));
  const toReorder = ingredients.filter((i) => i.stockQty < i.minStockQty);

  return (
    <>
      <Section title="Magazzino semplice" description="Scorte attuali, scorte minime e prodotti da riordinare">
        <Table headers={["Prodotto", "Scorta", "Scorta minima", "Stato", "Fornitore"]}>
          {ingredients.map((i) => {
            const low = i.stockQty < i.minStockQty;
            return (
              <tr key={i.id}>
                <td className="px-4 py-3 font-medium text-ink">{i.name}</td>
                <td className="px-4 py-3 tabular-nums">{i.stockQty} {i.unit}</td>
                <td className="px-4 py-3 tabular-nums">{i.minStockQty} {i.unit}</td>
                <td className="px-4 py-3">
                  {low ? <Badge tone="warn">in esaurimento</Badge> : <Badge tone="good">ok</Badge>}
                </td>
                <td className="px-4 py-3 text-warmgray">{supplierMap.get(i.supplierId)}</td>
              </tr>
            );
          })}
        </Table>
      </Section>

      <Section title="Lista riordino" description="Generata automaticamente dai prodotti sotto scorta minima">
        <Card>
          {toReorder.length === 0 ? (
            <p className="text-sm text-warmgray">Nessun prodotto da riordinare.</p>
          ) : (
            <>
              <ul className="divide-y divide-stone-100 text-sm">
                {toReorder.map((i) => (
                  <li key={i.id} className="flex items-center justify-between py-2">
                    <span className="font-medium text-ink">{i.name}</span>
                    <span className="text-warmgray">
                      ordina ~{Math.max(i.minStockQty * 2 - i.stockQty, 0).toFixed(0)} {i.unit} ·{" "}
                      {supplierMap.get(i.supplierId)} · ultimo prezzo {formatEuro(i.priceCents)}/{i.unit}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 rounded-lg bg-profit px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Invia ordine ai fornitori
              </button>
            </>
          )}
        </Card>
      </Section>
    </>
  );
}
