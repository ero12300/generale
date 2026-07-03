import Link from "next/link";
import {
  CalendarCheck,
  Crown,
  Gift,
  LayoutDashboard,
  Scissors,
  Users,
  Wallet,
} from "lucide-react";
import { getStore, isDemoMode } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import { Badge } from "@/components/ui";

const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/incassi", label: "Incassi", icon: Wallet },
  { href: "/app/prenotazioni", label: "Prenotazioni", icon: CalendarCheck },
  { href: "/app/clienti", label: "Clienti", icon: Users },
  { href: "/app/campagne", label: "Campagne", icon: Gift },
  { href: "/app/abbonamento", label: "Abbonamento", icon: Crown },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getStore();
  const shop = await store.getShop();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-line bg-coal md:block">
        <div className="sticky top-0 p-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold/10">
              <Scissors className="h-4 w-4 text-gold-bright" aria-hidden />
            </span>
            <span className="font-display text-lg tracking-wide text-cream">
              BarberFlow
            </span>
          </Link>
          <div className="mt-4 rounded-xl border border-line bg-panel p-3">
            <p className="truncate text-sm font-medium text-cream">
              {shop.name}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge tone={shop.plan === "pro" ? "gold" : "muted"}>
                Piano {PLANS[shop.plan].name}
              </Badge>
              {isDemoMode() ? <Badge tone="muted">Demo</Badge> : null}
            </div>
          </div>
          <nav className="mt-6 space-y-1" aria-label="Navigazione principale">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-panel hover:text-gold-bright focus:outline-none focus:ring-2 focus:ring-gold/60"
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1">
        {/* Nav mobile */}
        <nav
          className="flex gap-1 overflow-x-auto border-b border-line bg-coal px-4 py-3 md:hidden"
          aria-label="Navigazione mobile"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted hover:text-gold-bright"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-6xl p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
