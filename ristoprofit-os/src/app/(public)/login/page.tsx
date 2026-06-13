import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building2, Handshake, Store } from "lucide-react";

export const metadata: Metadata = { title: "Login" };

const AREAS = [
  {
    href: "/app",
    icon: Store,
    title: "Area cliente",
    desc: "Dashboard, food cost, ricette, fatture, magazzino, report — Trattoria del Porto (demo)",
  },
  {
    href: "/admin",
    icon: Building2,
    title: "Area admin Emotive",
    desc: "MRR, clienti attivi, setup, abbonamenti, alert clienti critici",
  },
  {
    href: "/venditori",
    icon: Briefcase,
    title: "Area venditori",
    desc: "Lead, trattative, provvigioni maturate e classifica",
  },
  {
    href: "/partner",
    icon: Handshake,
    title: "Portale referral",
    desc: "Segnalazioni, stato lead, premi maturati e pagati",
  },
];

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-ink">Accesso</h1>
        <p className="text-warmgray">
          Modalità demo attiva: senza configurazione Supabase l&apos;app usa
          dati dimostrativi. Scelga l&apos;area da esplorare.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {AREAS.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-colors hover:border-profit focus:outline-none focus:ring-2 focus:ring-profit"
          >
            <Icon className="text-profit" size={24} aria-hidden />
            <h2 className="mt-3 font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-warmgray">{desc}</p>
          </Link>
        ))}
      </div>
      <p className="text-center text-xs text-warmgray">
        In produzione l&apos;accesso avviene con Supabase Auth, ruoli e Row Level
        Security multi-tenant.
      </p>
    </div>
  );
}
