import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { demoStore } from "@/lib/demo-store";

export default function ImpostazioniPage() {
  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Impostazioni</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizzazione</CardTitle>
          <p className="text-sm text-zinc-400 mt-2">{demoStore.orgName}</p>
          <p className="text-sm text-zinc-500">{demoStore.locationName}</p>
          <p className="text-sm text-emerald-400 mt-2">Piano {demoStore.planTier.toUpperCase()}</p>
        </CardHeader>
      </Card>
    </div>
  );
}
