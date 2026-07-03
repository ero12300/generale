import { CalendarDays, Clock, Scissors, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  appointments,
  formatCents,
  getCustomer,
  getService,
  getStaffMember,
  staff,
} from "@/lib/barber-data";

export default function AgendaPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge>
          <CalendarDays className="mr-1 h-3 w-3" aria-hidden />
          Agenda operativa
        </Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Prenotazioni di oggi</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Gestisci check-in, servizio, staff e stato pagamento da una vista unica.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Timeline salone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.map((appointment) => {
              const customer = getCustomer(appointment.customerId);
              const service = getService(appointment.serviceId);
              const member = getStaffMember(appointment.staffId);
              return (
                <div key={appointment.id} className="grid gap-4 rounded-2xl border border-zinc-800 p-4 md:grid-cols-[90px_1fr_auto] md:items-center">
                  <div>
                    <p className="text-lg font-semibold text-amber-200">{appointment.time}</p>
                    <p className="text-xs text-zinc-500">{appointment.endTime}</p>
                  </div>
                  <div>
                    <p className="font-medium">{service?.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {customer?.name} · {member?.name} · {service ? formatCents(service.priceCents) : "-"}
                    </p>
                    {appointment.notes && <p className="mt-2 text-xs text-zinc-500">{appointment.notes}</p>}
                  </div>
                  <Badge variant={appointment.status === "completed" ? "success" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {staff.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-zinc-500">{member.role}</p>
                  </div>
                  <UserRound className="h-5 w-5 text-amber-300" aria-hidden />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-zinc-950/70 p-3 text-sm">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <Clock className="h-4 w-4" aria-hidden />
                    Prossimo slot
                  </span>
                  <span className="font-medium text-zinc-100">{member.nextSlot}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-amber-500/20 bg-amber-500/10">
            <CardContent className="p-5">
              <Scissors className="mb-3 h-5 w-5 text-amber-300" aria-hidden />
              <p className="font-medium">Regola anti-overbooking</p>
              <p className="mt-2 text-sm text-zinc-400">
                In produzione Firestore salva slot e staff; lato server si blocca la doppia prenotazione.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
