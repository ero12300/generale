"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Scissors,
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, initials } from "@/lib/utils";
import { TIER_LIMITS } from "@/types";
import { demoStore } from "@/lib/demo-store";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prenotazioni", label: "Prenotazioni", icon: CalendarDays },
  { href: "/clienti", label: "Clienti", icon: Users },
  { href: "/incassi", label: "Incassi", icon: Wallet },
  { href: "/campagne", label: "Campagne", icon: Megaphone },
  { href: "/impostazioni", label: "Impostazioni", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut, signInDemo } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tier, setTier] = useState<keyof typeof TIER_LIMITS>("pro");
  const [orgName, setOrgName] = useState("Filo Barber Studio");
  const [orgSlug, setOrgSlug] = useState("filo-barber-studio");

  useEffect(() => {
    if (!loading && !user) {
      signInDemo().catch(() => router.push("/login"));
    }
  }, [loading, user, signInDemo, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const org = demoStore.getOrganization();
    setTier(org.tier);
    setOrgName(org.name);
    setOrgSlug(org.slug);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const displayName = user?.displayName ?? "Antonio Demo";

  return (
    <div className="min-h-screen flex bg-ink-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-ink-900/95 border-r border-white/5 backdrop-blur-xl transform transition-transform lg:relative lg:translate-x-0 flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950">
              <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <div>
              <div className="font-display text-lg text-ink-50 tracking-tight leading-none">
                Filo<span className="text-gold-300">.</span>
              </div>
              <div className="text-[10px] text-ink-400 uppercase tracking-widest mt-0.5">
                Barber Suite
              </div>
            </div>
          </Link>
          <button
            className="lg:hidden text-ink-300 hover:text-ink-50"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 py-4 border-b border-white/5">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <div className="text-xs text-ink-400 uppercase tracking-widest">Salone</div>
            <div className="text-sm text-ink-50 font-medium mt-0.5 truncate">{orgName}</div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="gold" className="text-[10px]">
                {tier === "elite" ? <Crown className="h-2.5 w-2.5" /> : tier === "pro" ? <Sparkles className="h-2.5 w-2.5" /> : null}
                {TIER_LIMITS[tier].label}
              </Badge>
              <Link
                href={`/book/${orgSlug}`}
                target="_blank"
                className="text-[11px] text-gold-300 hover:text-gold-200 inline-flex items-center gap-1"
              >
                Pagina pubblica <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors relative",
                  active
                    ? "bg-gold-400/10 text-gold-100 border border-gold-400/20"
                    : "text-ink-300 hover:bg-white/5 hover:text-ink-50"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-gold-300")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gold-400/30 to-gold-600/30 border border-gold-400/40 text-gold-100 text-sm font-medium">
              {initials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm text-ink-50 truncate font-medium">{displayName}</div>
              <div className="text-xs text-ink-400 truncate">{user?.email ?? "demo@filo.app"}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              title="Esci"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-ink-950/80 backdrop-blur-xl px-4 h-14">
          <button
            className="text-ink-200 hover:text-ink-50 p-2 -ml-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950">
              <Scissors className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base text-ink-50">Filo<span className="text-gold-300">.</span></span>
          </div>
          <div className="w-9" />
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
