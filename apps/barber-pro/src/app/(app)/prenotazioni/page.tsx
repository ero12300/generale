import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { listBookings, listClients, listServices, listStaff, getShop } from "@/lib/data/repo";
import { BookingsView } from "@/components/bookings/BookingsView";

export default async function PrenotazioniPage() {
  const [bookings, clients, services, staff, shop] = await Promise.all([
    listBookings(),
    listClients(),
    listServices(),
    listStaff(),
    getShop(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl gold-shine">Prenotazioni</h1>
          <p className="text-ink-400 text-sm mt-1">
            Agenda giornaliera del salone. Aggiungi manualmente o condividi il link pubblico.
          </p>
        </div>
        <div className="text-xs text-ink-400">
          Link pubblico:{" "}
          <a
            href={`/book/${shop?.slug ?? "salone-demo"}`}
            className="text-[color:var(--color-gold-400)] hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            /book/{shop?.slug ?? "salone-demo"}
          </a>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agenda</CardTitle>
        </CardHeader>
        <CardBody>
          <BookingsView
            initialBookings={bookings}
            clients={clients}
            services={services}
            staff={staff}
          />
        </CardBody>
      </Card>
    </div>
  );
}
