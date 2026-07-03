import Link from "next/link";
import { PublicBookingForm } from "@/components/barber/public-booking";

export default function PublicBookingPage() {
  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      <header className="text-center space-y-2">
        <p className="text-amber-400 uppercase text-xs tracking-widest">BarberOS Booking</p>
        <h1 className="text-3xl font-semibold">Prenotazioni online premium</h1>
        <p className="text-zinc-400">Pagina clienti integrata con il gestionale interno.</p>
        <Link href="/barber" className="text-sm text-amber-400 hover:text-amber-300">
          Torna alla dashboard
        </Link>
      </header>
      <PublicBookingForm />
    </div>
  );
}
