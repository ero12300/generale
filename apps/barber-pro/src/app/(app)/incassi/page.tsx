import { listBookings, listClients, listPayments, listServices } from "@/lib/data/repo";
import { PaymentsView } from "@/components/payments/PaymentsView";

export default async function IncassiPage() {
  const [payments, bookings, clients, services] = await Promise.all([
    listPayments(),
    listBookings(),
    listClients(),
    listServices(),
  ]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl gold-shine">Incassi</h1>
        <p className="text-ink-400 text-sm mt-1">
          Registra ogni incasso e monitora l'andamento giornaliero e mensile.
        </p>
      </div>
      <PaymentsView
        initialPayments={payments}
        bookings={bookings}
        clients={clients}
        services={services}
      />
    </div>
  );
}
