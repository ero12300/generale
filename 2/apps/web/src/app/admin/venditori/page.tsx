import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminVenditoriPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Team commerciale"
        title="Venditori e provvigioni"
        subtitle="Performance agenti e compensi in sospeso"
        accent="amber"
      />
      <Card glow>
        <CardHeader>
          <CardTitle>Marco Venditore</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">5 clienti attivi · MRR generato 645 €</p>
          <p className="text-sm text-amber-400 mt-2 font-medium">Provvigioni in sospeso: 285 €</p>
        </CardHeader>
      </Card>
    </PageContainer>
  );
}
