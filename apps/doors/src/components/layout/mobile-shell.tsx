import { Ruler, ScanLine } from "lucide-react";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,#27272a_0%,#09090b_42%)]">
      <header className="safe-top sticky top-0 z-40 border-b border-zinc-800/80 bg-graphite/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber/30 bg-amber/10">
              <ScanLine className="h-5 w-5 text-amber" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-amber">
                DoorForge
              </p>
              <h1 className="text-base font-semibold text-zinc-50">
                Porte pronte produzione
              </h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-panel px-3 py-2 text-xs text-zinc-300 sm:flex">
            <Ruler className="h-4 w-4 text-amber" aria-hidden="true" />
            Misure in mm
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-5 pb-10 sm:py-8">{children}</main>
    </div>
  );
}
