"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Scissors,
  Gift,
  Sparkles,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useShopData } from "@/hooks/use-shop-data";

const nav = [
  { href: "/dashboard", label: "Panoramica", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/prenotazioni", label: "Prenotazioni", icon: CalendarDays },
  { href: "/dashboard/clienti", label: "Clienti", icon: Users },
  { href: "/dashboard/incassi", label: "Incassi", icon: Wallet },
  { href: "/dashboard/servizi", label: "Servizi", icon: Sparkles },
  { href: "/dashboard/campagne", label: "Campagne", icon: Gift },
  { href: "/dashboard/abbonamento", label: "Abbonamento", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { shop, isDemo } = useShopData();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/5 bg-[color:var(--color-ink-950)]/60 backdrop-blur-xl">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-[color:var(--color-gold-400)] to-[color:var(--color-gold-500)] text-ink-950">
            <Scissors className="h-4 w-4" />
          </span>
          <span className="font-display text-xl text-ink-50">BarberPro</span>
        </Link>
      </div>

      <div className="px-3 mb-4">
        <div className="glass rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">
            Attivo
          </div>
          <div className="text-sm font-medium text-ink-50 truncate">
            {shop.name}
          </div>
          <div className="text-xs text-ink-400 truncate">{shop.city}</div>
          <div className="flex items-center justify-between mt-2">
            <Badge variant={shop.plan === "free" ? "default" : "gold"} className="text-[10px]">
              {shop.plan === "free" ? "Starter" : shop.plan === "pro" ? "Pro" : "Business"}
            </Badge>
            <Link
              href={`/b/${shop.slug}`}
              target="_blank"
              className="text-[10px] text-[color:var(--color-gold-300)] hover:underline inline-flex items-center gap-0.5"
              aria-label="Apri pagina pubblica"
            >
              Pagina pubblica <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-300)] border border-[color:var(--color-gold-500)]/25"
                  : "text-ink-300 hover:bg-white/5 hover:text-ink-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {isDemo && (
        <div className="p-3">
          <div className="glass rounded-lg p-3 text-xs">
            <div className="font-medium text-[color:var(--color-gold-300)] mb-1">
              Modalità demo
            </div>
            <p className="text-ink-500 leading-relaxed">
              I dati sono di esempio, salvati sul tuo browser. Configura
              Firebase per iniziare davvero.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
