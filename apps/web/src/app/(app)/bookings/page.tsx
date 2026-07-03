import { CalendarDays, Clock3, ShieldCheck, UserRoundCheck } from "lucide-react";
import { BookingPlanner } from "@/components/barber/booking-planner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments, getClient, getServiceName } from "@/lib/barber-data";

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge className="border-white/10 bg-white/10 text-white">Booking OS</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Prenotazioni integrate</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Agenda premium con reminder, depositi, no-show protection e raccolta referral già
            pronta per Firebase e Stripe.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard icon={CalendarDays} title="Agenda centralizzata" text="Slot live per team e postazioni." />
        <InfoCard icon={UserRoundCheck} title="CRM contestuale" text="Ogni booking apre storico e preferenze." />
        <InfoCard icon={ShieldCheck} title="Depositi opzionali" text="Checkout Stripe per ridurre no-show." />
      </div>

      <BookingPlanner />

      <Card className="border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle>Coda di oggi</CardTitle>
          <CardDescription>Prenotazioni attive e priorita operative.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {appointments.map((appointment) => {
            const client = getClient(appointment.client_id);

            return (
              <div
                key={appointment.id}
                className="grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 lg:grid-cols-[1.2fr_0.8fr_0.6fr_0.6fr]"
              >
                <div>
                  <p className="text-sm font-medium text-white">{client?.full_name ?? "Cliente"}</p>
                  <p className="mt-1 text-sm text-zinc-400">{getServiceName(appointment.service_id)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Clock3 className="h-4 w-4 text-amber-300" aria-hidden />
                  {new Date(appointment.starts_at).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(appointment.ends_at).toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <p className="text-sm text-zinc-400">{appointment.barber_name}</p>
                <div className="flex justify-start lg:justify-end">
                  <Badge variant={appointment.status === "pending" ? "warning" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-amber-300" aria-hidden />
        <p className="mt-4 text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-400">{text}</p>
      </CardContent>
    </Card>
  );
}
