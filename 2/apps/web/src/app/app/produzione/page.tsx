import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProduzionePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Produzione giornaliera</h1>
      <Card className="border-emerald-500/30">
        <CardHeader>
          <CardTitle>Suggerimento sabato</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">
            Sabato scorso hai venduto 48 brioche. Per questo sabato produzione consigliata:{" "}
            <span className="text-emerald-400 font-semibold">55 brioche</span>.
          </p>
          <p className="text-xs text-zinc-500 mt-4">
            Piano Premium — basato su storico vendite, giorno settimana e stagionalità.
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}
