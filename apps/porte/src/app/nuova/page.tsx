import { ConfiguratorPorta } from "@/components/porta/configurator";

export const metadata = {
  title: "Nuova porta · PortePro",
};

export default function NuovaPortaPage() {
  return (
    <div>
      <div className="mb-4 no-print">
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">Nuova porta</h1>
        <p className="mt-1 text-sm text-slate-400">
          Compila i campi: l&apos;anteprima e i calcoli si aggiornano in tempo reale.
        </p>
      </div>
      <ConfiguratorPorta />
    </div>
  );
}
