"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface ShellProps {
  children: React.ReactNode;
  brand: string;
  subtitle: string;
  nav: NavItem[];
  accent?: "emerald" | "amber" | "blue";
  demo?: boolean;
}

export function AppShell({
  children,
  subtitle,
  nav,
  accent = "emerald",
  demo = true,
}: ShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const accentMap = {
    emerald: {
      active: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
      icon: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    amber: {
      active: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
      icon: "text-amber-400",
      dot: "bg-amber-400",
    },
    blue: {
      active: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
      icon: "text-blue-400",
      dot: "bg-blue-400",
    },
  };
  const a = accentMap[accent];

  const navLinks = (
    <>
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? a.active
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", active ? a.icon : "")} aria-hidden />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-mesh text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 border-b border-[var(--border-subtle)] glass-panel px-4 h-14 flex items-center justify-between shrink-0">
        <Logo size="sm" href={nav[0]?.href ?? "/"} showText={false} />
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 z-40 bg-black/60"
            aria-label="Chiudi menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-[17rem] glass-panel border-r border-[var(--border-subtle)] flex flex-col pt-4">
            <div className="px-5 pb-4 border-b border-[var(--border-subtle)]">
              <Logo size="sm" href={nav[0]?.href ?? "/"} />
              <p className="text-xs text-zinc-500 truncate mt-3 pl-1">{subtitle}</p>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Navigazione">
              {navLinks}
            </nav>
            {demo && (
              <div className="m-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200/70">
                <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-2", a.dot)} />
                Demo attiva — Pizzeria Messina
              </div>
            )}
          </aside>
        </>
      )}

      {/* Desktop sidebar */}
      <aside className="w-[17rem] border-r border-[var(--border-subtle)] glass-panel hidden md:flex flex-col shrink-0">
        <div className="p-5 border-b border-[var(--border-subtle)]">
          <Logo size="sm" href={nav[0]?.href ?? "/"} />
          <p className="text-xs text-zinc-500 truncate mt-3 pl-1">{subtitle}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Navigazione">
          {navLinks}
        </nav>
        {demo && (
          <div className="m-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200/70">
            <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-2", a.dot)} />
            Demo attiva — Pizzeria Messina
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
