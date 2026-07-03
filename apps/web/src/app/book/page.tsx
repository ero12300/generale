import Link from "next/link";
import { ArrowLeft, CalendarHeart } from "lucide-react";
import { barberStudio } from "@/lib/barber-data";
import { Badge } from "@/components/ui/badge";
import { PublicBookingForm } from "@/components/barber/public-booking-form";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-50 md:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Torna alla home
          </Link>
          <Badge className="w-fit">
            <CalendarHeart className="mr-1 h-3.5 w-3.5" aria-hidden />
            Booking pubblico integrato
          </Badge>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Prenota da {barberStudio.name}</h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Pagina pensata per conversione mobile, upsell premium e acquisizione dati cliente.
            </p>
          </div>
        </div>

        <PublicBookingForm />
      </div>
    </main>
  );
}
