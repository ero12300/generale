import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/layout/page-header";

export default function AdminClientiPage() {
  const clients = [
    { name: "Pizzeria La Lumachina", plan: "Pro", city: "Messina", status: "Attivo" },
    { name: "Gelateria Artigianale", plan: "Premium", city: "Milazzo", status: "Attivo" },
    { name: "Bar Centrale", plan: "Start", city: "Messina", status: "Setup" },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Gestione clienti"
        title="Clienti"
        subtitle={`${clients.length} locali in piattaforma`}
        accent="amber"
      />
      <div className="space-y-3">
        {clients.map((c) => (
          <Card key={c.name} glow>
            <CardHeader className="flex flex-row items-center justify-between mb-0">
              <div>
                <CardTitle>{c.name}</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">{c.city} · {c.plan}</p>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                {c.status}
              </span>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
