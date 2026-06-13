"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  brand,
  subtitle,
  nav,
  accent = "emerald",
  demo = true,
}: ShellProps) {
  const pathname = usePathname();
  const accentMap = {
    emerald: { active: "bg-emerald-600/15 text-emerald-300", icon: "text-emerald-500" },
    amber: { active: "bg-amber-600/15 text-amber-300", icon: "text-amber-500" },
    blue: { active: "bg-blue-600/15 text-blue-300", icon: "text-blue-500" },
  };
  const a = accentMap[accent];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <p className={cn("font-bold text-sm tracking-wider", a.icon)}>{brand}</p>
          <p className="text-xs text-zinc-500 truncate mt-1">{subtitle}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Navigazione">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? a.active
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        {demo && (
          <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
            Modalità demo — dati pizzeria Messina
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
