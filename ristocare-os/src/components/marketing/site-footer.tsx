import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted">
            Il sistema operativo per gestire attrezzature, manutenzioni e assistenza del tuo
            locale food. Brand dedicato di Emotive S.r.l. — Messina e provincia.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Prodotto</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/pacchetti" className="hover:text-foreground">Pacchetti</Link></li>
            <li><Link href="/#come-funziona" className="hover:text-foreground">Come funziona</Link></li>
            <li><Link href="/app" className="hover:text-foreground">Area cliente</Link></li>
            <li><Link href="/admin" className="hover:text-foreground">Centrale operativa</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Contatti</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/contatti" className="hover:text-foreground">Richiedi preventivo</Link></li>
            <li><Link href="/referral" className="hover:text-foreground">Diventa partner</Link></li>
            <li><Link href="/contatti?tipo=tecnico" className="hover:text-foreground">Tecnico partner</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RistoCare OS — Emotive S.r.l. Tutti i diritti riservati.</p>
          <p>Le proposte di intervento sono bozze: non costituiscono consulenza legale.</p>
        </div>
      </div>
    </footer>
  );
}
