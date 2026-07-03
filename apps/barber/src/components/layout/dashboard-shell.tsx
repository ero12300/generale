"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  LayoutDashboard,
  Megaphone,
  Menu,
  Scissors,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Prenotazioni", icon: Calendar },
  { href: "/dashboard/clients", label: "Clienti", icon: Users },
  { href: "/dashboard/revenue", label: "Incassi", icon: Wallet },
  { href: "/dashboard/campaigns", label: "Campagne", icon: Megaphone },
  { href: "/dashboard/settings", label: "Impostazioni", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-charcoal">
      <aside className="hidden lg:flex w-64 flex-col border-r border-gold/10 bg-charcoal-light/50">
        <div className="flex h-16 items-center gap-2 border-b border-gold/10 px-6">
          <Scissors className="h-5 w-5 text-gold" />
          <span className="font-display text-lg font-semibold">
            Barber<span className="text-gold">Pro</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
                  active
                    ? "bg-gold/15 text-gold border border-gold/20"
                    : "text-cream/60 hover:text-cream hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gold/10">
          <div className="rounded-xl bg-gold/10 border border-gold/20 p-4">
            <p className="text-xs text-gold font-medium mb-1">Piano Pro</p>
            <p className="text-xs text-cream/50 mb-3">Campagne e referral attivi</p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/pricing">Upgrade Elite</Link>
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gold/10 px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden p-2 text-cream/70"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="text-sm text-cream/50 hidden sm:block">Fade Studio — Milano</p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/book/fade-studio" target="_blank">Pagina Prenotazione</Link>
            </Button>
          </div>
        </header>

        {mobileOpen && (
          <nav className="lg:hidden border-b border-gold/10 p-4 space-y-1 bg-charcoal-light">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-cream/70 hover:bg-white/5"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
