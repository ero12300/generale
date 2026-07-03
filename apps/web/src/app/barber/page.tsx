import Link from "next/link";
import { BarberDashboard } from "@/components/barber/barber-dashboard";
import { Button } from "@/components/ui/button";

export default function BarberPage() {
  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          BarberOS: piattaforma premium per gestione interna e prenotazioni clienti.
        </p>
        <Button asChild variant="secondary">
          <Link href="/book">Apri pagina prenotazione cliente</Link>
        </Button>
      </div>
      <BarberDashboard />
    </div>
  );
}
