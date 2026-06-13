import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SalesLeadPage() {
  const leads = [
    { name: "Ristorante Il Porto", status: "Demo fissata", city: "Messina" },
    { name: "Pasticceria Dolce", status: "Preventivo inviato", city: "Taormina" },
    { name: "Lounge Bar 360", status: "In trattativa", city: "Messina" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Lead assegnati</h1>
      <div className="space-y-3">
        {leads.map((l) => (
          <Card key={l.name}>
            <CardHeader className="flex flex-row justify-between items-center mb-0">
              <div>
                <CardTitle className="text-base">{l.name}</CardTitle>
                <p className="text-xs text-zinc-500">{l.city}</p>
              </div>
              <Badge variant="gold">{l.status}</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
