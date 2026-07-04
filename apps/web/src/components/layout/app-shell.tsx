"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  DoorOpen,
  LayoutDashboard,
  LineChart,
  LogOut,
  Sparkles,
  Workflow,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Pipeline Deal", icon: Workflow },
  { href: "/configurator/doors", label: "Configuratore porte", icon: DoorOpen },
  { href: "/freedom", label: "Libertà Finanziaria", icon: LineChart },
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-500" />
            <div>
              <p className="font-semibold text-sm tracking-wide">DEAL DESK</p>
              <p className="text-xs text-zinc-500 truncate max-w-[160px]">{orgName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Navigazione principale">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
                pathname.startsWith(href)
                  ? "bg-amber-600/15 text-amber-300"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {mode === "demo" ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles className="h-3 w-3" />
              Modalità demo attiva
            </div>
          ) : (
            <>
              {email && <p className="text-xs text-zinc-500 truncate">{email}</p>}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded px-1 py-1"
              >
                <LogOut className="h-3 w-3" aria-hidden />
                Esci
              </button>
            </>
          )}
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800 flex items-center px-4 md:px-8 gap-4">
          <div className="md:hidden flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-sm">Deal Desk</span>
          </div>
          <div className="flex-1" />
          <Link
            href="/deals/new"
            className="text-sm bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          >
            + Nuovo deal
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
