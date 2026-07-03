"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Gift,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/prenotazioni", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/clienti", label: "Clienti", icon: Users },
  { href: "/dashboard/incassi", label: "Incassi", icon: Wallet },
  { href: "/dashboard/campagne", label: "Referral", icon: Gift },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 bg-[color:var(--color-ink-950)]/95 backdrop-blur-xl">
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = it.exact
            ? pathname === it.href
            : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[10px]",
                active
                  ? "text-[color:var(--color-gold-300)]"
                  : "text-ink-400"
              )}
            >
              <it.icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
