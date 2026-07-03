import Link from "next/link";
import { getStore } from "@/lib/store";
import { Badge, Card, CardTitle } from "@/components/ui";
import { BookingForm } from "@/components/forms/BookingForm";
import { BookingActions } from "@/components/BookingActions";

export const dynamic = "force-dynamic";

export default async function PrenotazioniPage() {
  const store = await getStore();
  const [bookings, services] = await Promise.all([
    store.listBookings(),
    store.listServices(),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter(
    (b) => b.status === "confermata" && b.date >= today
  );
  const past = bookings
    .filter((b) => b.status !== "confermata" || b.date < today)
    .slice(-8)
    .reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream">Prenotazioni</h1>
          <p className="mt-1 text-sm text-muted">
            Agenda del salone. I clienti possono prenotare anche online da{" "}
            <Link href="/prenota" className="text-gold-bright underline">
              /prenota
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardTitle>Nuova prenotazione</CardTitle>
          <BookingForm services={services} variant="interno" />
        </Card>

        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardTitle>In agenda</CardTitle>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted">Nessuna prenotazione futura.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((b) => (
                  <li
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel-2 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-cream">
                        {b.date === today ? "Oggi" : b.date} alle {b.time} —{" "}
                        {b.clientName}
                      </p>
                      <p className="text-xs text-muted">
                        {b.serviceName} · {b.clientPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={b.source === "online" ? "gold" : "muted"}>
                        {b.source}
                      </Badge>
                      <BookingActions bookingId={b.id} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardTitle>Storico recente</CardTitle>
            {past.length === 0 ? (
              <p className="text-sm text-muted">Ancora nessuno storico.</p>
            ) : (
              <ul className="divide-y divide-line">
                {past.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <p className="text-sm text-cream/80">
                      {b.date} {b.time} — {b.clientName}{" "}
                      <span className="text-muted">({b.serviceName})</span>
                    </p>
                    <Badge
                      tone={
                        b.status === "completata"
                          ? "green"
                          : b.status === "annullata"
                            ? "red"
                            : "muted"
                      }
                    >
                      {b.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
