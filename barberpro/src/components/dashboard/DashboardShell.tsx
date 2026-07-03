"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, Crown, Loader2 } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { WorkspaceProvider, useWorkspaceOptional } from "@/lib/store/WorkspaceProvider";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/format";

function PlanBadge() {
  const ws = useWorkspaceOptional();
  const plan = PLANS[ws?.settings.plan ?? "free"];
  return (
    <Link
      href="/dashboard/settings"
      className={cn(
        "badge",
        plan.id === "pro"
          ? "border-gold/40 bg-gold-gradient text-ink"
          : "border-ink-line bg-ink-soft text-cream/70",
      )}
    >
      <Crown className="h-3.5 w-3.5" /> Piano {plan.name}
    </Link>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const ws = useWorkspaceOptional();
  const dataReady = Boolean(ws && ws.ready);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-ink-line bg-ink-soft/60 lg:block">
        <Sidebar />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-ink-line bg-ink-soft">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-cream/50 hover:text-cream"
              aria-label="Chiudi menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-ink-line bg-ink/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-cream/70 hover:bg-ink-line lg:hidden"
            aria-label="Apri menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden text-sm text-cream/50 sm:block">
            Ciao, <span className="text-cream">{user?.displayName ?? "Barbiere"}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <PlanBadge />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {dataReady ? (
            children
          ) : (
            <div className="grid h-[60vh] place-items-center">
              <Loader2 className="h-6 w-6 animate-spin text-gold-soft" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold-soft" />
      </div>
    );
  }

  return (
    <WorkspaceProvider>
      <ShellInner>{children}</ShellInner>
    </WorkspaceProvider>
  );
}
