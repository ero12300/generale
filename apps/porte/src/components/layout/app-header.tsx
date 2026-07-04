import { DoorOpen } from "lucide-react";

export function AppHeader() {
  return (
    <header className="no-print safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
          <DoorOpen className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-bold leading-tight text-slate-900">PortaCalc</p>
          <p className="text-xs leading-tight text-slate-500">
            Dal foro muro alla porta pronta per la produzione
          </p>
        </div>
      </div>
    </header>
  );
}
