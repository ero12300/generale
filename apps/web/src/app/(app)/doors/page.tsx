import { DoorConfigurator } from "@/components/doors/door-configurator";

export default function DoorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuratore Porte</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Configura il foro muro e genera una scheda porta pronta per produzione.
        </p>
      </div>
      <DoorConfigurator />
    </div>
  );
}
