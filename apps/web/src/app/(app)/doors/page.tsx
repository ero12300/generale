import { DoorOpen, Ruler, ShieldCheck } from "lucide-react";
import { DoorConfigurator } from "@/components/doors/door-configurator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function DoorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge variant="default">Configuratore mobile</Badge>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Gestione porte</h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Inserisci il vano muro, scegli modello e accessori, poi genera la scheda porta con
              misure ridotte per produzione, opera morta, verso, maniglia e ferramenta.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-400">
          <DoorOpen className="h-4 w-4 text-amber-400" aria-hidden />
          Output pronto per laboratorio / fornitore
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <InfoCard
          icon={Ruler}
          title="Misura prudente"
          text="Il calcolo usa sempre la larghezza e l'altezza minori tra i punti rilevati."
        />
        <InfoCard
          icon={DoorOpen}
          title="Modelli porta"
          text="Battente, scorrevole esterno muro, scomparsa/scrigno e compasso/libro."
        />
        <InfoCard
          icon={ShieldCheck}
          title="Avvisi produzione"
          text="Display, ovale, vetro e scomparsa generano note da verificare prima dell'ordine."
        />
      </div>

      <DoorConfigurator />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
        <div>
          <p className="text-sm font-medium text-zinc-100">{title}</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
