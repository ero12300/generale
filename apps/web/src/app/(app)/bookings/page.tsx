import { CalendarDays, Clock } from "lucide-react";
import { BookingForm } from "@/components/barber/booking-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBarberRepository } from "@/lib/barber/repository";
import { formatCurrencyCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const repo = await getBarberRepository();
  const [services, bookings] = await Promise.all([repo.listServices(), repo.listBookings()]);

  return (
    <div className="space-y-6">
      <div>
        <Badge>Prenotazione integrata</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Agenda e richieste clienti</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Crea richieste, applica codici porta un amico e prepara conferma manuale o automatica.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Nuova richiesta</CardTitle>
            <CardDescription>Stati loading, errore e successo gia gestiti dal form.</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm services={services} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agenda prossimi appuntamenti</CardTitle>
              <CardDescription>Ordine cronologico da Firestore o demo store</CardDescription>
            </div>
            <CalendarDays className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{booking.customer_name}</p>
                    <p className="mt-1 text-sm text-zinc-400">{booking.service_name}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-amber-300">{formatCurrencyCents(booking.price_cents)}</p>
                    <Badge variant={booking.status === "requested" ? "warning" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Intl.DateTimeFormat("it-IT", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(booking.starts_at))}
                  </span>
                  <span>{booking.duration_minutes} min</span>
                  {booking.referral_code && <span>Referral: {booking.referral_code}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
