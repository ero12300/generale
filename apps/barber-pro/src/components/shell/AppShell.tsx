"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Megaphone,
  Scissors,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prenotazioni", label: "Prenotazioni", icon: Calendar },
  { href: "/clienti", label: "Clienti", icon: Users },
  { href: "/incassi", label: "Incassi", icon: Wallet },
  { href: "/servizi", label: "Servizi", icon: Scissors },
  { href: "/campagne", label: "Campagne", icon: Megaphone },
  { href: "/abbonamento", label: "Abbonamento", icon: CreditCard },
  { href: "/impostazioni", label: "Impostazioni", icon: Settings },
];

export function AppShell({ children, shopName, plan }: { children: ReactNode; shopName: string; plan: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isDemo, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center text-ink-400">
        <div className="animate-pulse text-sm">Caricamento…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-white/5 bg-gradient-to-b from-ink-950/80 to-ink-950 h-screen sticky top-0 p-4">
        <SidebarContent pathname={pathname} shopName={shopName} plan={plan} isDemo={isDemo} onSignOut={signOut} userName={user.displayName ?? "Barbiere"} />
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen ? (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] glass border-r border-white/10 p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <SidebarContent pathname={pathname} shopName={shopName} plan={plan} isDemo={isDemo} onSignOut={signOut} userName={user.displayName ?? "Barbiere"} />
          </aside>
        </div>
      ) : null}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-white/5 bg-ink-950/70 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-ink-300 hover:text-ink-100 p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Apri menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <PathTitle pathname={pathname} />
          </div>
          <div className="flex items-center gap-2">
            {isDemo ? (
              <Badge tone="gold" className="hidden sm:inline-flex">
                <Sparkles className="w-3 h-3" /> Modalità demo
              </Badge>
            ) : null}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] text-ink-950 grid place-items-center text-xs font-semibold">
                {initials(user.displayName ?? user.email ?? "B")}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 px-4 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  shopName,
  plan,
  isDemo,
  onSignOut,
  userName,
}: {
  pathname: string;
  shopName: string;
  plan: string;
  isDemo: boolean;
  onSignOut: () => void;
  userName: string;
}) {
  return (
    <>
      <div className="px-2 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] grid place-items-center text-ink-950">
            <Scissors className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg gold-shine">BarberPro</span>
        </Link>
        <div className="mt-3 px-1">
          <div className="text-xs uppercase tracking-wider text-ink-500">Salone</div>
          <div className="text-sm font-medium text-ink-100 truncate">{shopName}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <Badge tone={plan === "pro" ? "gold" : plan === "business" ? "violet" : "default"}>{plan.toUpperCase()}</Badge>
            {isDemo ? <Badge tone="default">Demo</Badge> : null}
          </div>
        </div>
      </div>

      <div className="hairline mb-3" />

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                active
                  ? "bg-white/[0.07] text-ink-100 border border-white/10"
                  : "text-ink-400 hover:text-ink-100 hover:bg-white/[0.04]",
              )}
            >
              <Icon className={cn("w-4 h-4", active && "text-[color:var(--color-gold-400)]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="hairline my-3" />

      <div className="px-2 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs font-semibold text-ink-200">
            {initials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-ink-100 truncate">{userName}</div>
            <div className="text-[11px] text-ink-500 truncate">Titolare</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-400 hover:text-ink-100 hover:bg-white/[0.05]"
        >
          <LogOut className="w-4 h-4" />
          Esci
        </button>
      </div>
    </>
  );
}

function PathTitle({ pathname }: { pathname: string }) {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/prenotazioni": "Prenotazioni",
    "/clienti": "Clienti",
    "/incassi": "Incassi",
    "/servizi": "Servizi",
    "/campagne": "Campagne",
    "/abbonamento": "Abbonamento",
    "/impostazioni": "Impostazioni",
  };
  const label = Object.keys(map).find((k) => pathname === k || pathname.startsWith(k + "/"));
  return <div className="text-sm font-display gold-shine">{label ? map[label] : "BarberPro"}</div>;
}

export function MobileCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-ink-100" aria-label="Chiudi menu">
      <X className="w-5 h-5" />
    </button>
  );
}
