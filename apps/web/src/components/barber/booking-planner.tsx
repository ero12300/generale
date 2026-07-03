"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, LoaderCircle, TicketPercent, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { serviceMenu } from "@/lib/barber-data";
import { bookingRequestSchema } from "@/lib/barber/validations";
import { formatCurrencyFromCents } from "@/lib/utils";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; message: string };

const barbers = ["Michele", "Lorenzo", "Samuele", "Guest Barber"];

export function BookingPlanner() {
  const [formData, setFormData] = useState({
    clientName: "",
    barberName: "Michele",
    serviceId: serviceMenu[0]?.id ?? "",
    bookingDate: "2026-07-04",
    bookingTime: "18:30",
    referralCode: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const selectedService = useMemo(
    () => serviceMenu.find((service) => service.id === formData.serviceId) ?? null,
    [formData.serviceId]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState({ status: "loading" });

    const parsed = bookingRequestSchema.safeParse(formData);
    if (!parsed.success) {
      setSubmitState({
        status: "error",
        message: parsed.error.issues.map((issue) => issue.message).join("; "),
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 900));

    const message = parsed.data.referralCode
      ? `Prenotazione simulata confermata. Codice referral ${parsed.data.referralCode} applicato.`
      : "Prenotazione simulata confermata. Nessun deposito richiesto.";

    setSubmitState({ status: "success", message });
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
            <CalendarClock className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <CardTitle>Widget prenotazione integrato</CardTitle>
            <CardDescription>
              Simula il flusso cliente con validazione, stato loading ed esito finale.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente">
              <Input
                value={formData.clientName}
                onChange={(event) => setFormData((prev) => ({ ...prev, clientName: event.target.value }))}
                placeholder="Nome e cognome"
              />
            </Field>

            <Field label="Barber">
              <select
                value={formData.barberName}
                onChange={(event) => setFormData((prev) => ({ ...prev, barberName: event.target.value }))}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                {barbers.map((barber) => (
                  <option key={barber} value={barber} className="bg-zinc-950">
                    {barber}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Servizio">
              <select
                value={formData.serviceId}
                onChange={(event) => setFormData((prev) => ({ ...prev, serviceId: event.target.value }))}
                className="flex h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              >
                {serviceMenu.map((service) => (
                  <option key={service.id} value={service.id} className="bg-zinc-950">
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Referral / sconto">
              <Input
                value={formData.referralCode}
                onChange={(event) => setFormData((prev) => ({ ...prev, referralCode: event.target.value }))}
                placeholder="GOLD10"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Data">
              <Input
                type="date"
                value={formData.bookingDate}
                onChange={(event) => setFormData((prev) => ({ ...prev, bookingDate: event.target.value }))}
              />
            </Field>

            <Field label="Ora">
              <Input
                type="time"
                value={formData.bookingTime}
                onChange={(event) => setFormData((prev) => ({ ...prev, bookingTime: event.target.value }))}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="min-w-44">
              {submitState.status === "loading" ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                  Verifica disponibilita
                </>
              ) : (
                "Conferma prenotazione"
              )}
            </Button>
            <p className="text-sm text-zinc-400">
              Deposito opzionale e reminder automatici pronti per Firebase + Stripe.
            </p>
          </div>

          {submitState.status === "error" && (
            <StatusBox
              icon={<TriangleAlert className="h-4 w-4 text-rose-300" aria-hidden />}
              className="border-rose-500/30 bg-rose-500/10 text-rose-100"
              text={submitState.message}
            />
          )}

          {submitState.status === "success" && (
            <StatusBox
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden />}
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
              text={submitState.message}
            />
          )}
        </form>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Anteprima esperienza</p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              {selectedService?.name ?? "Seleziona un servizio"}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">{selectedService?.description}</p>
          </div>

          <div className="grid gap-3">
            <MiniStat label="Durata" value={`${selectedService?.duration_minutes ?? 0} min`} />
            <MiniStat label="Prezzo" value={formatCurrencyFromCents(selectedService?.price_cents)} />
            <MiniStat label="Operatore" value={formData.barberName} />
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            <div className="flex items-center gap-2 font-medium">
              <TicketPercent className="h-4 w-4" aria-hidden />
              Automazione consigliata
            </div>
            <p className="mt-2 text-amber-50/80">
              Se il cliente arriva da referral, invia coupon digitale post-visita e richiesta recensione 24h dopo.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm text-zinc-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StatusBox({
  icon,
  text,
  className,
}: {
  icon: React.ReactNode;
  text: string;
  className: string;
}) {
  return (
    <div className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm ${className}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
