import { CalendarClock, Clock3, Sparkles } from "lucide-react";
import { AppointmentForm } from "@/components/barber/appointment-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listBarberAppointments,
  listBarberClients,
  listBarberServices,
} from "@/lib/barber-demo";
import { formatCurrency } from "@/lib/utils";

export default function AgendaPage() {
  const services = listBarberServices();
  const clients = listBarberClients();
  const todayAppointments = listBarberAppointments().filter((appointment) => {
    const date = new Date(appointment.starts_at);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda & booking</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Vista giornaliera pensata per prendere prenotazioni dal salone, da Instagram o da widget online.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Walk-in support</Badge>
          <Badge variant="default">Reminder ready</Badge>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-amber-400" />
              Timeline di oggi
            </CardTitle>
            <CardDescription>
              Ordine operativo degli appuntamenti con stato e valore stimato.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayAppointments.map((appointment) => {
              const client = clients.find((item) => item.id === appointment.client_id);
              return (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2">
                      <Clock3 className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium">{client?.full_name ?? "Cliente demo"}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {new Date(appointment.starts_at).toLocaleTimeString("it-IT", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        - {appointment.barber_name} - {appointment.duration_minutes} min
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        Canale: {appointment.channel.replace("_", " ")}
                        {appointment.referral_code_used
                          ? ` - referral ${appointment.referral_code_used}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        appointment.status === "completed"
                          ? "success"
                          : appointment.status === "pending"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {appointment.status.replace(/_/g, " ")}
                    </Badge>
                    <p className="font-medium text-amber-300">{formatCurrency(appointment.total_price)}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <AppointmentForm services={services} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Servizi premium da spingere
          </CardTitle>
          <CardDescription>
            Selezione ottimizzata per aumentare lo scontrino medio.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {services
            .filter((service) => service.featured)
            .map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
              >
                <p className="font-medium">{service.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {service.duration_minutes} min - {formatCurrency(service.price)}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
