"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Crown,
  Gift,
  LayoutDashboard,
  LogOut,
  Scissors,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Plan } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/clienti", label: "Clienti", icon: Users },
  { href: "/incassi", label: "Incassi", icon: Wallet },
  { href: "/campagne", label: "Campagne", icon: Gift },
  { href: "/abbonamento", label: "Abbonamento", icon: Crown },
];

interface AppShellProps {
  children: React.ReactNode;
  mode: "demo" | "firebase";
  orgName: string;
  plan: Plan;
  email: string | null;
}

export function AppShell({ children, mode, orgName, plan, email }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-premium text-zinc-100 flex">
      <aside className="w-64 border-r border-zinc-800 bg-[#0e0e10]/80 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-b from-[#e3c680] to-[#c9a24b] text-zinc-950">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base font-semibold tracking-wide gold-gradient-text">
                Lama d&apos;Oro
              </p>
              <p className="text-xs text-zinc-500 truncate max-w-[150px]">{orgName}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Navigazione principale">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
                  active
                    ? "bg-[#c9a24b]/15 text-gold-soft"
                    : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Piano attivo</span>
            <Badge variant={plan === "pro" ? "default" : "secondary"}>
              {plan === "pro" ? "PRO" : "BASE"}
            </Badge>
          </div>
          {mode === "demo" && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles className="h-3 w-3" />
              Modalità demo attiva
            </div>
          )}
          {email && <p className="text-xs text-zinc-500 truncate">{email}</p>}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-1 py-1"
          >
            <LogOut className="h-3 w-3" aria-hidden />
            Esci
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800 flex items-center px-4 md:px-8 gap-4 bg-[#0e0e10]/40 backdrop-blur">
          <div className="md:hidden flex items-center gap-2">
            <Scissors className="h-5 w-5 text-gold" />
            <span className="font-display font-semibold text-sm">Lama d&apos;Oro</span>
          </div>
          <div className="flex-1" />
          <Link
            href="/prenota"
            target="_blank"
            className="text-xs text-zinc-400 hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded px-2 py-1"
          >
            Pagina prenotazioni ↗
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
