"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LineChart,
  Menu,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Pipeline Deal", icon: Workflow },
  { href: "/freedom", label: "Libertà Finanziaria", icon: LineChart },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 p-4 space-y-1" aria-label="Navigazione principale">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
              active
                ? "bg-amber-600/15 text-amber-300"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Building2
        className={compact ? "h-5 w-5 text-amber-500" : "h-6 w-6 text-amber-500"}
        aria-hidden
      />
      <div>
        <p
          className={cn(
            "font-semibold tracking-wide",
            compact ? "text-sm" : "text-sm",
          )}
        >
          DEAL DESK
        </p>
        {!compact && (
          <p className="text-xs text-zinc-500">Immobiliare SRL</p>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Chiudi automaticamente il drawer al cambio rotta.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ESC per chiudere + blocco scroll body quando aperto.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar desktop */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Brand />
        </div>
        <NavLinks pathname={pathname} />
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Sparkles className="h-3 w-3" />
            Modalità demo attiva
          </div>
        </div>
      </aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <button
            aria-label="Chiudi menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <Brand />
              <button
                onClick={() => setMobileOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-md p-1"
                aria-label="Chiudi menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Modalità demo attiva
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800 flex items-center px-4 md:px-8 gap-4">
          <button
            className="md:hidden text-zinc-400 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-md p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu di navigazione"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="md:hidden">
            <Brand compact />
          </div>
          <div className="flex-1" />
          <Link
            href="/deals/new"
            className="text-sm bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            + Nuovo deal
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
