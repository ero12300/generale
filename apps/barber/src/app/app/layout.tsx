"use client";

import {
  BarChart3,
  CalendarDays,
  CreditCard,
  Gift,
  Receipt,
  Scissors,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Badge } from "@/components/ui";
import { useStore } from "@/lib/store/provider";
import { PLANS } from "@/lib/types";

const NAV = [
  { href: "/app", label: "Panoramica", icon: BarChart3 },
  { href: "/app/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/app/cassa", label: "Cassa", icon: Receipt },
  { href: "/app/clienti", label: "Clienti", icon: Users },
  { href: "/app/campagne", label: "Campagne", icon: Gift },
  { href: "/app/abbonamento", label: "Abbonamento", icon: CreditCard },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, mode } = useStore();
  const plan = state ? PLANS[state.settings.plan] : null;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/5 bg-ink-900/60 p-5 md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Scissors className="h-5 w-5 text-gold-400" aria-hidden />
          <span className="font-display text-lg text-cream">BarberSuite</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1" aria-label="Menu gestionale">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/app" ? pathname === "/app" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-gold-400",
                  active
                    ? "bg-gold-500/15 font-semibold text-gold-300"
                    : "text-cream/60 hover:bg-white/5 hover:text-cream",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 text-xs text-cream/40">
          {plan ? (
            <p>
              Piano attivo:{" "}
              <Badge tone={plan.id === "pro" ? "gold" : "neutral"}>
                {plan.label}
              </Badge>
            </p>
          ) : null}
          <p>
            Dati:{" "}
            <Badge tone={mode === "firebase" ? "green" : "neutral"}>
              {mode === "firebase" ? "Firebase" : "Demo locale"}
            </Badge>
          </p>
        </div>
      </aside>

      <div className="flex-1">
        {/* nav mobile */}
        <nav
          className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-white/5 bg-ink-950/90 px-4 py-3 backdrop-blur md:hidden"
          aria-label="Menu gestionale mobile"
        >
          {NAV.map(({ href, label }) => {
            const active =
              href === "/app" ? pathname === "/app" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs",
                  active
                    ? "bg-gold-500/20 font-semibold text-gold-300"
                    : "text-cream/60",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
