"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Users, Wallet, Gift, Settings, CreditCard, Scissors, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/plans";
import { useStore } from "@/components/providers/data-provider";

const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/prenotazioni", label: "Prenotazioni", icon: CalendarClock },
  { href: "/app/clienti", label: "Clienti", icon: Users },
  { href: "/app/incassi", label: "Incassi", icon: Wallet },
  { href: "/app/campagne", label: "Campagne", icon: Gift },
  { href: "/app/impostazioni", label: "Impostazioni", icon: Settings },
  { href: "/app/abbonamento", label: "Abbonamento", icon: CreditCard },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const store = useStore();
  const plan = user?.plan ?? "free";

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-[color:var(--color-ink-950)]/70 px-4 py-5 backdrop-blur">
      <Link href="/app" onClick={onNavigate} className="flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
          <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
        </span>
        <div className="leading-tight">
          <div className="font-display text-lg text-white">Rasoio</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40">barber os</div>
        </div>
      </Link>

      <nav className="mt-8 flex-1 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition",
                active
                  ? "gold-border bg-[color:var(--color-ink-800)] text-white"
                  : "hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-3 rounded-2xl border border-white/5 bg-[color:var(--color-ink-900)]/70 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-white/40">Piano attivo</div>
          <Badge tone={plan === "pro" ? "gold" : plan === "base" ? "success" : "muted"}>
            {PLANS[plan].name}
          </Badge>
        </div>
        <div className="text-xs text-white/60">
          {plan === "pro" ? "Tutte le funzioni sbloccate." : "Passa a Pro per referral e multi-postazione."}
        </div>
        <Link
          href="/app/abbonamento"
          onClick={onNavigate}
          className="block rounded-lg bg-white/5 px-3 py-2 text-center text-xs font-medium text-white hover:bg-white/10"
        >
          Gestisci piano
        </Link>
      </div>

      <div className="mt-3 border-t border-white/5 pt-3">
        <Link
          href={`/book/${store.shop.slug}`}
          target="_blank"
          className="mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Pagina pubblica
        </Link>
        <div className="flex items-center justify-between px-2 py-2">
          <div className="min-w-0">
            <div className="truncate text-sm text-white">{user?.displayName ?? "—"}</div>
            <div className="truncate text-xs text-white/40">{user?.email}</div>
          </div>
          <button onClick={() => signOut()} className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white" aria-label="Esci">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
