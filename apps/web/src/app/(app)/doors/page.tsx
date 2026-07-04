import { DoorConfigurator } from "@/components/doors/door-configurator";

export default function DoorsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Produzione porte</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Configura modello, quote vano e verso apertura per generare lo schema pronto per officina.
        </p>
      </div>
      <DoorConfigurator />
    </div>
  );
}
