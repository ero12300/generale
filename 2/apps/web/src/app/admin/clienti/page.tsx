import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminClientiPage() {
  const clients = [
    { name: "Pizzeria La Lumachina", plan: "Pro", city: "Messina", status: "Attivo" },
    { name: "Gelateria Artigianale", plan: "Premium", city: "Milazzo", status: "Attivo" },
    { name: "Bar Centrale", plan: "Start", city: "Messina", status: "Setup" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Clienti</h1>
      <div className="space-y-3">
        {clients.map((c) => (
          <Card key={c.name}>
            <CardHeader className="flex flex-row items-center justify-between mb-0">
              <div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <p className="text-xs text-zinc-500">{c.city} · {c.plan}</p>
              </div>
              <span className="text-xs text-emerald-400">{c.status}</span>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
