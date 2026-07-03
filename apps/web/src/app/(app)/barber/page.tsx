import { BarberDashboard } from "@/components/barber/barber-dashboard";

export default function BarberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gestionale Barber Premium</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Booking, incassi, CRM clienti e monetizzazione abbonamenti in un unico pannello.
        </p>
      </div>
      <BarberDashboard />
    </div>
  );
}
