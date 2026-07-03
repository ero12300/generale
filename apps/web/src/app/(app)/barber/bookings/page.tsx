import { BookingsManager } from "@/components/barber/bookings-manager";

export default function BarberBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prenotazioni integrate</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Agenda live con cliente, servizio, stato appuntamento e gestione acconti.
        </p>
      </div>
      <BookingsManager />
    </div>
  );
}
