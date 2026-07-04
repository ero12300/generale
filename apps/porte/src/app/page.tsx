import { DoorOpen } from "lucide-react";
import Configurator from "@/components/configurator";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="no-print sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <DoorOpen className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base font-bold leading-tight text-ink">PortaLab</h1>
            <p className="text-xs text-muted">Dal foro muro alla porta pronta per la produzione</p>
          </div>
        </div>
      </header>
      <div className="pt-5">
        <Configurator />
      </div>
    </main>
  );
}
