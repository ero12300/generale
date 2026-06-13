import { Badge, Card, Section, Table, statusTone } from "@/components/ui";
import { invoices, suppliers } from "@/lib/demo-data";
import { ingredientMap } from "@/lib/demo-insights";
import { formatEuro } from "@/lib/money";

export const metadata = { title: "Fatture fornitori" };

export default function FatturePage() {
  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));

  return (
    <>
      <Section
        title="Fatture fornitori"
        description="Caricamento manuale in questa fase; lettura automatica con AI nella fase 3 della roadmap"
        actions={
          <button
            type="button"
            className="rounded-lg bg-profit px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            + Carica fattura (PDF o foto)
          </button>
        }
      >
        <Table headers={["Numero", "Fornitore", "Data", "Totale", "Stato"]}>
          {invoices.map((f) => (
            <tr key={f.id}>
              <td className="px-4 py-3 font-medium text-ink">{f.id}</td>
              <td className="px-4 py-3">{supplierMap.get(f.supplierId)}</td>
              <td className="px-4 py-3 text-warmgray">{f.date}</td>
              <td className="px-4 py-3 tabular-nums">{formatEuro(f.totalCents)}</td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(f.status)}>{f.status.replace("_", " ")}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Section>

      <Section title="Righe ultima fattura" description={`${invoices[0].id} — ${supplierMap.get(invoices[0].supplierId)}`}>
        <Card>
          <ul className="divide-y divide-stone-100 text-sm">
            {invoices[0].items.map((item) => {
              const ing = ingredientMap.get(item.ingredientId)!;
              return (
                <li key={item.ingredientId} className="flex justify-between py-2">
                  <span>
                    {ing.name}{" "}
                    <span className="text-warmgray">× {item.quantity} {ing.unit}</span>
                  </span>
                  <span className="tabular-nums">{formatEuro(item.unitPriceCents)}/{ing.unit}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Il prezzo della mozzarella è aumentato del 9% rispetto all&apos;ultima
            fattura. Il margine della Pizza Bufala si è ridotto.
          </p>
        </Card>
      </Section>
    </>
  );
}
