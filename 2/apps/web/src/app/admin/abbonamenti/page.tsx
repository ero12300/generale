import { PLANS, formatEuro } from "@ristoprofit/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAbbonamentiPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Abbonamenti e piani</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {PLANS.map((p) => (
          <Card key={p.tier}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              {p.monthly_price_cents > 0 && (
                <p className="text-emerald-400 mt-2">
                  {formatEuro(p.monthly_price_cents)}/mese · Setup {formatEuro(p.setup_price_cents)}
                </p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
