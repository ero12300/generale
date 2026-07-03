import Link from "next/link";
import { Scissors } from "lucide-react";
import { getStore, isFirebaseConfigured } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { AdminNav } from "./admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await getStore();
  const settings = await store.getSettings();
  const demoMode = !isFirebaseConfigured();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <Scissors className="h-5 w-5 text-gold" aria-hidden />
          <Link href="/" className="font-display text-lg font-bold">
            Barber<span className="text-gold">OS</span>
          </Link>
        </div>
        <AdminNav plan={settings.plan} />
        <div className="mt-auto space-y-2 border-t border-border p-4 text-xs text-muted">
          <p>
            Piano attivo:{" "}
            <span className="font-bold uppercase text-gold-soft">
              {PLANS[settings.plan].name}
            </span>
          </p>
          {demoMode && (
            <p className="rounded-lg border border-gold-dim/40 bg-surface-2 p-2">
              Modalità demo: dati in-memory. Configura Firebase per dati reali.
            </p>
          )}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-border px-6 py-4 md:hidden">
          <Link href="/" className="font-display text-lg font-bold">
            Barber<span className="text-gold">OS</span>
          </Link>
          <span className="text-xs uppercase text-gold-soft">
            {PLANS[settings.plan].name}
          </span>
        </header>
        <div className="md:hidden border-b border-border">
          <AdminNav plan={settings.plan} horizontal />
        </div>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
