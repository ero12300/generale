import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { DemoBadge } from "@/components/demo-badge";

export const metadata = {
  title: "Gestionale — BarberOS",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">✂️</span>
            <span className="font-display text-xl font-bold tracking-wide">
              Barber<span className="gold-gradient-text">OS</span>
            </span>
            <span className="ml-2 rounded-full border border-gold/40 px-3 py-0.5 text-xs uppercase tracking-widest text-gold">
              Gestionale
            </span>
          </Link>
          <DemoBadge />
        </div>
        <AdminNav />
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
