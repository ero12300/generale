import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageContainer, PageHeader } from "@/components/layout/page-header";

export default function SalesLeadPage() {
  const leads = [
    { name: "Ristorante Il Porto", status: "Demo fissata", city: "Messina" },
    { name: "Pasticceria Dolce", status: "Preventivo inviato", city: "Taormina" },
    { name: "Lounge Bar 360", status: "In trattativa", city: "Messina" },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Pipeline commerciale"
        title="Lead assegnati"
        subtitle={`${leads.length} opportunità in lavorazione`}
        accent="blue"
      />
      <div className="space-y-3">
        {leads.map((l) => (
          <Card key={l.name} glow>
            <CardHeader className="flex flex-row justify-between items-center mb-0">
              <div>
                <CardTitle>{l.name}</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">{l.city}</p>
              </div>
              <Badge variant="gold">{l.status}</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
