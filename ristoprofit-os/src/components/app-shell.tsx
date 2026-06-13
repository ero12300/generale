"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
}

export function AppShell({
  areaLabel,
  subtitle,
  nav,
  children,
}: {
  areaLabel: string;
  subtitle: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navList = (
    <nav aria-label={`Navigazione ${areaLabel}`} className="space-y-1">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href.split("/").length > 2 && pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={clsx(
              "block rounded-lg px-3 py-2 text-sm font-medium outline-offset-2 transition-colors",
              active
                ? "bg-profit-soft text-green-900"
                : "text-stone-300 hover:bg-ink-soft hover:text-white",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden bg-ink p-4 lg:block">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <span className="text-lg font-bold text-white">
            Risto<span className="text-profit">Profit</span> OS
          </span>
        </Link>
        <p className="px-2 pb-4 text-xs uppercase tracking-wide text-stone-400">
          {areaLabel}
        </p>
        {navList}
      </aside>

      {/* header mobile */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <Link href="/" className="text-base font-bold text-white">
          Risto<span className="text-profit">Profit</span> OS
        </Link>
        <button
          type="button"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-white hover:bg-ink-soft"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <div className="bg-ink px-4 pb-4 lg:hidden">{navList}</div>
      ) : null}

      <div>
        <header className="border-b border-stone-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-ink">{areaLabel}</h1>
          <p className="text-sm text-warmgray">{subtitle}</p>
        </header>
        <main className="space-y-8 p-6">{children}</main>
      </div>
    </div>
  );
}
