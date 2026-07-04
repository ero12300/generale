import { AppHeader } from "@/components/layout/app-header";
import { Configurator } from "@/components/configurator/configurator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AppHeader />
      <Configurator />
    </main>
  );
}
