"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Wallet,
  Scissors,
  Megaphone,
  Settings,
  LogOut,
  Crown,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/format";
import { useAuth } from "@/lib/auth/AuthProvider";

const NAV = [
  { href: "/dashboard", label: "Panoramica", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Prenotazioni", icon: CalendarClock },
  { href: "/dashboard/clients", label: "Clienti", icon: Users },
  { href: "/dashboard/revenue", label: "Incassi", icon: Wallet },
  { href: "/dashboard/services", label: "Servizi", icon: Scissors },
  { href: "/dashboard/campaigns", label: "Campagne", icon: Megaphone },
  { href: "/dashboard/settings", label: "Impostazioni", icon: Settings },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-5">
        <Link href="/dashboard" onClick={onNavigate}>
          <Logo subtitle="Gestionale" />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-gold/10 text-gold-soft"
                  : "text-cream/60 hover:bg-ink-line/60 hover:text-cream",
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-ink-line p-3">
        <Link
          href="/book"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/60 transition hover:text-gold-soft"
        >
          <ExternalLink className="h-[18px] w-[18px]" /> Pagina prenotazioni
        </Link>
        <Link
          href="/dashboard/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/5 px-3 py-2.5 text-sm font-medium text-gold-soft transition hover:bg-gold/10"
        >
          <Crown className="h-[18px] w-[18px]" /> Piano & abbonamento
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/50 transition hover:bg-ink-line/60 hover:text-cream"
        >
          <LogOut className="h-[18px] w-[18px]" /> Esci
        </button>
      </div>
    </div>
  );
}
