import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProduzionePage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Piano Premium"
        title="Produzione giornaliera"
        subtitle="Suggerimenti basati su storico vendite"
      />
      <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent" glow>
        <CardHeader>
          <CardTitle>Suggerimento sabato</CardTitle>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Sabato scorso hai venduto 48 brioche. Per questo sabato produzione consigliata:{" "}
            <span className="text-emerald-700 font-semibold">55 brioche</span>.
          </p>
          <p className="text-xs text-zinc-500 mt-4">
            Basato su storico vendite, giorno settimana e stagionalità.
          </p>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
