import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function FornitoriPage() {
  const suppliers = [
    { name: "Caseificio Siciliano", email: "ordini@caseificio.it" },
    { name: "Frutta Secca Premium", email: "info@pistacchio.it" },
    { name: "Carni Messina", email: "vendite@carnimessina.it" },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Acquisti"
        title="Fornitori"
        subtitle={`${suppliers.length} fornitori attivi`}
      />
      <div className="grid md:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <Card key={s.name} glow>
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
              <p className="text-sm text-zinc-500 mt-1">{s.email}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
