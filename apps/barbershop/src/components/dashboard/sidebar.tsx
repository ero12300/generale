"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wallet,
  Megaphone,
  Settings,
  CreditCard,
  LogOut,
  Scissors,
  Menu,
  X,
  ChevronRight,
  Star,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/bookings", label: "Prenotazioni", icon: Calendar },
  { href: "/dashboard/clients", label: "Clienti", icon: Users },
  { href: "/dashboard/cashier", label: "Cassa", icon: Wallet },
  { href: "/dashboard/campaigns", label: "Campagne", icon: Megaphone },
];

const bottomItems = [
  { href: "/dashboard/subscription", label: "Abbonamento", icon: CreditCard },
  { href: "/dashboard/settings", label: "Impostazioni", icon: Settings },
];

export function Sidebar() {
  const { user, shop, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
            <Scissors className="w-4 h-4 text-black" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-[var(--foreground)] truncate">
              {shop?.name ?? "BarberPro"}
            </p>
            <p className="text-xs text-[var(--muted)] flex items-center gap-1">
              {shop?.plan === "pro" ? (
                <>
                  <Star className="w-2.5 h-2.5 fill-[var(--primary)] text-[var(--primary)]" />
                  <span className="text-gold">Pro</span>
                </>
              ) : (
                "Piano Free"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
              isActive(href)
                ? "sidebar-active text-[var(--primary)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0",
                isActive(href) ? "text-[var(--primary)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
              )}
            />
            {label}
            {isActive(href) && (
              <ChevronRight className="w-3 h-3 ml-auto text-[var(--primary)]" />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-0.5 border-t border-[var(--sidebar-border)]">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              isActive(href)
                ? "sidebar-active text-[var(--primary)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--accent)]"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}

        {/* User */}
        <div className="mt-3 pt-3 border-t border-[var(--sidebar-border)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center text-xs font-bold text-black shrink-0">
              {getInitials(user?.displayName ?? user?.email ?? "U")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--foreground)] truncate">
                {user?.displayName ?? "Utente"}
              </p>
              <p className="text-xs text-[var(--muted)] truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-[var(--muted)] hover:text-red-400 transition-colors p-1 rounded"
              title="Esci"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 bottom-0 z-50 w-56 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
