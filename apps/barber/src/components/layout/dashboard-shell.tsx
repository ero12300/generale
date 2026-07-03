"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  LayoutDashboard,
  Megaphone,
  Scissors,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Agenda", icon: Calendar },
  { href: "/dashboard/revenue", label: "Incassi", icon: Wallet },
  { href: "/dashboard/clients", label: "Clienti", icon: Users },
  { href: "/dashboard/settings", label: "Orari", icon: Settings },
];

const secondaryNav = [
  { href: "/dashboard/campaigns", label: "Campagne", icon: Megaphone },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[100dvh] bg-charcoal">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-gold/10 bg-charcoal-light/50 shrink-0">
        <div className="flex h-14 items-center gap-2 border-b border-gold/10 px-5">
          <Scissors className="h-5 w-5 text-gold" />
          <span className="font-display text-lg font-semibold">
            Barber<span className="text-gold">Pro</span>
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[...navItems, ...secondaryNav].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all min-h-[44px]",
                  active
                    ? "bg-gold/15 text-gold border border-gold/20"
                    : "text-cream/60 hover:text-cream hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gold/10">
          <Link
            href="/book/fade-studio"
            target="_blank"
            className="flex items-center justify-center rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold min-h-[44px]"
          >
            Pagina prenotazione
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gold/10 bg-charcoal/95 backdrop-blur-lg px-4 lg:px-8 safe-top">
          <div className="lg:hidden flex items-center gap-2">
            <Scissors className="h-5 w-5 text-gold" />
            <span className="font-display text-base font-semibold truncate">
              Fade Studio
            </span>
          </div>
          <p className="text-sm text-cream/50 hidden lg:block">Fade Studio — Milano</p>
          <Link
            href="/book/fade-studio"
            target="_blank"
            className="text-xs text-gold border border-gold/30 rounded-lg px-3 py-2 min-h-[40px] flex items-center lg:hidden"
          >
            Prenota
          </Link>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gold/10 bg-charcoal-light/95 backdrop-blur-xl safe-bottom"
          aria-label="Navigazione principale"
        >
          <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 text-[10px] min-h-[64px] touch-manipulation",
                    active ? "text-gold" : "text-cream/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", active && "scale-110")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
