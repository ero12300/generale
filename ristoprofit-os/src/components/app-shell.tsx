"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calculator,
  ChefHat,
  TrendingUp,
  FileText,
  LineChart,
  Menu as MenuIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DEMO_ORG } from "@/lib/demo-data";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/food-cost", label: "Food Cost", icon: Calculator },
  { href: "/ricette", label: "Ricette", icon: ChefHat },
  { href: "/menu", label: "Menu Engineering", icon: TrendingUp },
  { href: "/report", label: "Report giornaliero", icon: FileText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--background)] text-zinc-100 md:grid md:grid-cols-[260px_1fr]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-zinc-800 bg-zinc-950/95 p-4 transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link href="/" className="flex items-center gap-2 px-2 py-2">
          <LineChart className="h-6 w-6 text-emerald-500" />
          <span className="text-lg font-bold tracking-tight">
            RistoProfit<span className="text-emerald-500"> OS</span>
          </span>
        </Link>

        <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
          <p className="text-xs text-zinc-500">Locale attivo</p>
          <p className="truncate text-sm font-semibold">{DEMO_ORG.name}</p>
          <p className="text-xs text-zinc-500">
            {DEMO_ORG.city} · Piano {DEMO_ORG.planId.toUpperCase()}
          </p>
        </div>

        <nav className="mt-4 flex flex-col gap-1" aria-label="Navigazione principale">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-500">
          Modalità demo · dati di esempio
        </div>
      </aside>

      {open && (
        <button
          aria-label="Chiudi menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-800 bg-zinc-950/70 px-4 py-3 backdrop-blur md:hidden">
          <button
            aria-label="Apri menu"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-zinc-700 p-2"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <span className="font-semibold">RistoProfit OS</span>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
