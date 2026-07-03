"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { DataProvider } from "@/components/providers/data-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { Scissors } from "lucide-react";
import { DrawerCtx } from "./nav-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (status === "guest") router.replace("/login?next=/app");
  }, [status, router]);

  if (status === "loading" || status === "guest") {
    return (
      <div className="grid min-h-dvh place-items-center text-white/60">
        <div className="flex flex-col items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl gold-border animate-pulse">
            <Scissors className="h-5 w-5 text-[color:var(--color-gold-300)]" />
          </span>
          <div className="text-sm">Caricamento…</div>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <div className="flex min-h-dvh">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {drawer && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
            <div className="absolute inset-y-0 left-0 h-full">
              <Sidebar onNavigate={() => setDrawer(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
            <DrawerCtx.Provider value={() => setDrawer(true)}>{children}</DrawerCtx.Provider>
          </div>
        </main>
      </div>
    </DataProvider>
  );
}
