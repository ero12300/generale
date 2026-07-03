"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Incassi" },
  { href: "/admin/prenotazioni", label: "Prenotazioni" },
  { href: "/admin/clienti", label: "Clienti" },
  { href: "/admin/campagne", label: "Campagne" },
  { href: "/admin/abbonamento", label: "Abbonamento" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigazione gestionale" className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-gold text-gold"
                  : "border-transparent text-cream-dim hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
