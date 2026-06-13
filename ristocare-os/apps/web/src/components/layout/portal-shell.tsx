"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  Sparkles,
  Ticket,
  Users,
  Wrench,
} from "lucide-react";
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

export function PortalShell({ children, variant, title, subtitle, mode, email }: PortalShellProps) {
  const pathname = usePathname();
  const nav =
    variant === "admin"
      ? adminNav
      : variant === "technician"
        ? techNav
        : variant === "referral"
          ? referralNav
          : customerNav;

  const accent = variant === "admin" ? "amber" : "emerald";

  return (
    <div className="min-h-screen bg-[#0c0f0e] text-zinc-100 flex">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/40 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Shield className={cn("h-6 w-6", accent === "amber" ? "text-amber-500" : "text-emerald-500")} />
            <div>
              <p className="font-semibold text-sm tracking-wide">{title}</p>
              <p className="text-xs text-zinc-500 truncate max-w-[160px]">{subtitle}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Navigazione portale">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname.startsWith(href)
                  ? accent === "amber"
                    ? "bg-amber-600/15 text-amber-300"
                    : "bg-emerald-600/15 text-emerald-300"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {mode === "demo" && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles className="h-3 w-3" />
              Modalità demo
            </div>
          )}
          {email && <p className="text-xs text-zinc-500 truncate">{email}</p>}
          <Link
            href="/login"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <LogOut className="h-3 w-3" />
            Cambia accesso
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800 flex items-center px-4 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" />
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <div className="flex-1" />
          {variant === "customer" && (
            <Link
              href="/app/tickets/new"
              className="text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg"
            >
              + Apri ticket
            </Link>
          )}
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
