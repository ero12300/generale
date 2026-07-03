"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChartNoAxesCombined,
  CreditCard,
  Lock,
  Megaphone,
  Users,
} from "lucide-react";
import type { PlanId } from "@/lib/types";
import { planHasCapability } from "@/lib/plans";
import { cn } from "@/lib/cn";

interface AdminNavProps {
  plan: PlanId;
  horizontal?: boolean;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: ChartNoAxesCombined },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/clienti", label: "Clienti", icon: Users },
  { href: "/admin/campagne", label: "Campagne", icon: Megaphone, requiresPro: true },
  { href: "/admin/abbonamento", label: "Abbonamento", icon: CreditCard },
] as const;

export function AdminNav({ plan, horizontal }: AdminNavProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigazione gestionale"
      className={cn(
        horizontal
          ? "flex gap-1 overflow-x-auto px-3 py-2"
          : "flex flex-col gap-1 p-3",
      )}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon, ...rest }) => {
        const active =
          pathname === href || (href !== "/admin" && pathname.startsWith(href));
        const locked =
          "requiresPro" in rest && rest.requiresPro === true
            ? !planHasCapability(plan, "campagne")
            : false;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
              active
                ? "bg-gold text-background"
                : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
            {locked && (
              <Lock
                className={cn("ml-auto h-3.5 w-3.5", active ? "" : "text-gold")}
                aria-label="Richiede piano Pro"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
