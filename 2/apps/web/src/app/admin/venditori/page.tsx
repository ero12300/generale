import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminVenditoriPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Venditori e provvigioni</h1>
      <Card>
        <CardHeader>
          <CardTitle>Marco Venditore</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">5 clienti attivi · MRR generato 645 €</p>
          <p className="text-sm text-amber-400 mt-1">Provvigioni in sospeso: 285 €</p>
        </CardHeader>
      </Card>
    </div>
  );
}
