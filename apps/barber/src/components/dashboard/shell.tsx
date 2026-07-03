"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Crown, Store } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { NAV_ITEMS } from "./sidebar-nav";
import { useStore } from "@/lib/store/store-context";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const isPro = state.subscription.plan === "pro";

  const nav = (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--gold)]/12 text-[var(--gold-soft)]"
                : "text-muted hover:bg-white/5 hover:text-foreground",
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden border-r border-border bg-surface/50 lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen">
        <div className="p-5">
          <Link href="/"><Logo /></Link>
        </div>
        <div className="flex-1 px-3">{nav}</div>
        <div className="p-4">
          <PlanCard isPro={isPro} shopName={state.settings.shopName} />
        </div>
      </aside>

      {/* Topbar mobile */}
      <div className="flex items-center justify-between border-b border-border bg-surface/50 px-4 py-3 lg:hidden">
        <Link href="/"><Logo /></Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Apri menu"
          className="rounded-lg p-2 text-muted hover:bg-white/5"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-surface p-5">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Chiudi menu" className="rounded-lg p-1.5 text-muted hover:bg-white/5">
                <X size={20} />
              </button>
            </div>
            {nav}
            <div className="mt-6"><PlanCard isPro={isPro} shopName={state.settings.shopName} /></div>
          </div>
        </div>
      )}

      <main className="min-w-0">{children}</main>
    </div>
  );
}

function PlanCard({ isPro, shopName }: { isPro: boolean; shopName: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-sm">
        <Store size={16} className="text-muted" />
        <span className="truncate font-medium">{shopName}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted">Piano attuale</span>
        {isPro ? (
          <Badge tone="gold"><Crown size={11} /> Pro</Badge>
        ) : (
          <Badge tone="gray">Start</Badge>
        )}
      </div>
      {!isPro && (
        <Link
          href="/dashboard/abbonamento"
          className="mt-3 block rounded-lg gold-gradient px-3 py-2 text-center text-xs font-semibold text-[#0b0b0f]"
        >
          Passa a Pro
        </Link>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
