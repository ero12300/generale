import { demoStore } from "@/lib/demo-store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function MagazzinoPage() {
  const lowStock = demoStore.getCustomerDashboard().low_stock;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Magazzino semplice</h1>
      <Card>
        <CardHeader>
          <CardTitle>Prodotti in esaurimento</CardTitle>
          <ul className="mt-4 space-y-2 text-sm">
            {lowStock.map((i) => (
              <li key={i.name} className="flex justify-between text-amber-400">
                <span>{i.name}</span>
                <span>{i.current} kg (min {i.min})</span>
              </li>
            ))}
          </ul>
        </CardHeader>
      </Card>
      <p className="text-sm text-zinc-500">
        Carichi da fattura, scarichi manuali e lista riordino — prossima fase MVP.
      </p>
    </div>
  );
}
