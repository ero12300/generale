import Link from "next/link";
import { Scissors, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/barber/booking-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberRepository } from "@/lib/barber/repository";

export const dynamic = "force-dynamic";

export default async function PublicBookingPage() {
  const repo = await getBarberRepository();
  const services = await repo.listServices();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#3f2b14_0%,#09090b_42%)] text-zinc-100">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-200">
            <Scissors className="h-4 w-4 text-amber-400" />
            Barber Suite
          </Link>
          <Badge>Booking premium</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Prenota il tuo trattamento in meno di un minuto.
            </h1>
            <p className="max-w-xl text-zinc-400">
              Scegli servizio, orario e aggiungi un codice porta un amico. Il salone riceve la richiesta nel gestionale.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              Conferma rapida e storico cliente.
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              Referral e sconti tracciati.
            </div>
          </div>
        </section>

        <Card className="border-amber-500/30 bg-zinc-950/80 shadow-2xl shadow-amber-950/30">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wide">Richiesta sicura</span>
            </div>
            <CardTitle>Richiedi prenotazione</CardTitle>
            <CardDescription>Ti ricontatteremo per confermare disponibilita e dettagli.</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm services={services} compact />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
