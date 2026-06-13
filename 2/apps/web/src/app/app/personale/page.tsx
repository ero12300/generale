import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEuro } from "@ristoprofit/types";

export default function PersonalePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Personale e incidenza costo</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="mb-0">
            <p className="text-xs text-zinc-500">Incasso oggi</p>
            <CardTitle>{formatEuro(243000)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="mb-0">
            <p className="text-xs text-zinc-500">Costo personale stimato</p>
            <CardTitle>{formatEuro(52000)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-amber-500/30">
          <CardHeader className="mb-0">
            <p className="text-xs text-zinc-500">Incidenza su incasso</p>
            <CardTitle className="text-amber-400">35,8%</CardTitle>
            <p className="text-xs text-amber-400/80 mt-1">Attenzione: incidenza elevata</p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
