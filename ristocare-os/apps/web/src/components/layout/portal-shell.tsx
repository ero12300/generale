"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Sparkles,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const customerNav: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/equipment", label: "Attrezzature", icon: Package },
  { href: "/app/tickets", label: "Ticket", icon: Ticket },
];

const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tickets", label: "Ticket", icon: Ticket },
  { href: "/admin/technicians", label: "Tecnici", icon: Wrench },
  { href: "/admin/organizations", label: "Clienti", icon: Building2 },
];

const techNav: NavItem[] = [
  { href: "/tech/tickets", label: "I miei ticket", icon: ClipboardList },
];

const referralNav: NavItem[] = [
  { href: "/referral/dashboard", label: "I miei lead", icon: Users },
];

interface PortalShellProps {
  children: React.ReactNode;
  variant: "customer" | "admin" | "technician" | "referral";
  title: string;
  subtitle: string;
  mode: "demo" | "supabase";
  email?: string | null;
}

export function PortalShell({ children, variant, subtitle, mode, email }: PortalShellProps) {
  const pathname = usePathname();
  const nav =
    variant === "admin"
      ? adminNav
      : variant === "technician"
        ? techNav
        : variant === "referral"
          ? referralNav
          : customerNav;

  const isAdmin = variant === "admin";

  return (
    <div className="min-h-screen text-zinc-100 flex bg-[#080a09]">
      <aside className="w-[17rem] border-r border-white/5 bg-[#060807]/90 hidden md:flex flex-col">
        <div className="p-5 border-b border-white/5">
          <Link href={isAdmin ? "/admin/dashboard" : "/app/dashboard"}>
            <Logo size="sm" variant={isAdmin ? "admin" : "default"} />
          </Link>
          <p className="mt-4 text-xs text-zinc-500 truncate">{subtitle}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1" aria-label="Navigazione portale">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? isAdmin
                      ? "bg-amber-500/10 text-amber-200 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          {mode === "demo" && (
            <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/15">
              <Sparkles className="h-3.5 w-3.5" />
              Modalità demo
            </div>
          )}
          {email && <p className="text-xs text-zinc-500 truncate px-1">{email}</p>}
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 px-1 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Cambia accesso
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 flex items-center px-4 md:px-8 bg-[#080a09]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="md:hidden">
            <Logo size="sm" showWordmark={false} />
          </div>
          <div className="flex-1" />
          {variant === "customer" && (
            <Link
              href="/app/tickets/new"
              className="inline-flex items-center gap-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-950/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Apri ticket
            </Link>
          )}
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
