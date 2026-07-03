"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Gift,
  Wallet,
  Settings,
  Crown,
  Scissors,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { getPlan } from "@/lib/plans";
import { Badge } from "@/components/ui/badge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prenotazioni", label: "Prenotazioni", icon: CalendarClock },
  { href: "/clienti", label: "Clienti", icon: Users },
  { href: "/incassi", label: "Incassi", icon: Wallet },
  { href: "/campagne", label: "Campagne", icon: Gift },
  { href: "/abbonamento", label: "Abbonamento", icon: Crown },
  { href: "/impostazioni", label: "Impostazioni", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data, mode } = useStore();
  const plan = getPlan(data.subscription.plan);

  return (
    <div className="flex min-h-screen bg-premium text-zinc-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/50 md:flex">
        <div className="border-b border-zinc-800/80 p-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-zinc-950">
              <Scissors className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{data.organization.name}</p>
              <p className="text-xs text-zinc-500">Barber Suite</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Navigazione principale">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60",
                  active
                    ? "bg-amber-500/15 font-medium text-amber-300"
                    : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-zinc-800/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Piano attuale</span>
            <Badge variant={plan.id === "pro" ? "default" : "neutral"}>
              {plan.id === "pro" && <Crown className="h-3 w-3" />} {plan.name}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Sparkles className="h-3 w-3" />
            {mode === "demo" ? "Modalità demo attiva" : "Connesso a Firebase"}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-zinc-800/80 bg-zinc-950/40 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <Scissors className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold">BarberSuite</span>
          </div>
          <MobileNav pathname={pathname} />
          <div className="flex-1" />
          <Link
            href="/prenotazioni"
            className="rounded-lg bg-gradient-to-b from-amber-500 to-amber-600 px-3 py-1.5 text-sm font-semibold text-zinc-950 transition hover:from-amber-400 hover:to-amber-500"
          >
            + Prenotazione
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex gap-1 overflow-x-auto md:hidden" aria-label="Navigazione">
      {nav.slice(0, 5).map(({ href, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md p-2",
              active ? "bg-amber-500/15 text-amber-300" : "text-zinc-400"
            )}
          >
            <Icon className="h-4 w-4" />
          </Link>
        );
      })}
    </nav>
  );
}
