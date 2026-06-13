import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const NAV = [
  { href: "/#come-funziona", label: "Come funziona" },
  { href: "/pacchetti", label: "Pacchetti" },
  { href: "/#per-chi", label: "Per chi è" },
  { href: "/referral", label: "Diventa partner" },
  { href: "/contatti", label: "Contatti" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav aria-label="Navigazione principale" className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="hidden rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface sm:inline-flex"
          >
            Area cliente
          </Link>
          <Link
            href="/contatti?tipo=demo"
            className="rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-strong"
          >
            Richiedi una demo
          </Link>
        </div>
      </div>
    </header>
  );
}
