"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarClock,
  CreditCard,
  Crown,
  Gem,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Scissors,
  Sparkles,
  Users2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Prenotazioni", icon: CalendarClock },
  { href: "/clients", label: "Clienti", icon: Users2 },
  { href: "/campaigns", label: "Campagne", icon: Megaphone },
  { href: "/finance", label: "Incassi", icon: CreditCard },
  { href: "/growth", label: "Growth", icon: Crown },
  { href: "/settings", label: "Setup", icon: Gem },
];

interface AppShellProps {
  children: React.ReactNode;
  mode: "demo" | "supabase";
  orgName: string;
  email: string | null;
}

export function AppShell({ children, mode, orgName, email }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (mode === "demo") return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex">
      <aside className="hidden w-72 flex-col border-r border-white/10 bg-black/40 backdrop-blur md:flex">
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
              <Scissors className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.28em]">ATELIER</p>
              <p className="max-w-[180px] truncate text-xs text-zinc-500">{orgName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Navigazione principale">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
                pathname.startsWith(href)
                  ? "bg-amber-500/15 text-amber-200 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="space-y-3 border-t border-white/10 p-4">
          {mode === "demo" ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2 font-medium text-zinc-200">
                <Sparkles className="h-3 w-3" />
                Demo premium attiva
              </div>
              <p className="mt-2 leading-5 text-zinc-400">
                UI pronta per Firebase Auth, Firestore e Stripe Checkout.
              </p>
            </div>
          ) : (
            <>
              {email && <p className="truncate text-xs text-zinc-500">{email}</p>}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded px-1 py-1 text-xs text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                <LogOut className="h-3 w-3" aria-hidden />
                Esci
              </button>
            </>
          )}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-white/10 bg-black/20 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <Scissors className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold">Atelier</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Barber Premium OS</p>
            <p className="text-xs text-zinc-500">Booking, clienti, incassi e crescita in un unico posto</p>
          </div>
          <div className="flex-1" />
          <Link
            href="/growth"
            className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10 md:inline-flex"
          >
            Monetizzazione SaaS
          </Link>
          <Link
            href="/bookings"
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            + Nuova prenotazione
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
