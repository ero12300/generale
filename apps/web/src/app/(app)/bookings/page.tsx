import { CalendarClock, MessageSquareText } from "lucide-react";
import { barberBookings, getServiceById, getStaffById } from "@/lib/barber-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prenotazioni</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Agenda operativa con canale di acquisizione, stato appuntamento e valore stimato.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Agenda di oggi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {barberBookings.map((booking) => {
              const service = getServiceById(booking.service_id);
              const staff = getStaffById(booking.staff_id);
              return (
                <div key={booking.id} className="rounded-2xl border border-zinc-800 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{booking.client_name}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {new Date(booking.start_at).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {service?.name ?? "Servizio"} · {staff?.name ?? "Team"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{booking.channel}</Badge>
                      <Badge variant={booking.status === "pending" ? "warning" : "success"}>
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <p className="text-zinc-400">{booking.notes ?? "Nessuna nota operativa"}</p>
                    <p className="font-medium text-amber-300">{formatCurrency(booking.amount)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-4 w-4 text-amber-300" aria-hidden />
                Politiche di scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <p>Slot premium da 45/60/75 minuti per proteggere la percezione del brand.</p>
              <p>Reminder automatici e whitelist clienti per ridurre no-show e buchi in agenda.</p>
              <p>Canali tracciati per capire se convertono meglio app, Instagram o WhatsApp.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquareText className="h-4 w-4 text-emerald-300" aria-hidden />
                Flussi consigliati
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-300">
              <p>Conferma immediata con link calendario.</p>
              <p>Reminder 24h prima con cross-sell prodotti.</p>
              <p>Messaggio post visita per review e referral.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
