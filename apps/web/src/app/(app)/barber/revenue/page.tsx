import { RevenuePanel } from "@/components/barber/revenue-panel";

export default function BarberRevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Incassi e analytics</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Report operativo giornaliero con ticket medio, canale pagamento e cassa aggiornata.
        </p>
      </div>
      <RevenuePanel />
    </div>
  );
}
