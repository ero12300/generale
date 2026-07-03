"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { ArrowRight, CalendarCheck, Loader2, Sparkles } from "lucide-react";
import { z } from "zod";
import { saveBookingLead } from "@/lib/barber/repository";
import { bookingLeadSchema, type BarberPlanId, type BookingLeadInput } from "@/lib/barber/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const serviceLabels: Record<BookingLeadInput["service"], string> = {
  "taglio-premium": "Taglio premium",
  "barba-rituale": "Barba rituale",
  "combo-signature": "Combo signature",
  "colore-style": "Colore & style",
};

type FieldErrors = Partial<Record<keyof BookingLeadInput, string>>;

function getFormValue(formData: FormData, key: keyof BookingLeadInput) {
  return String(formData.get(key) ?? "");
}

export function BarberBookingForm() {
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [checkoutStatus, setCheckoutStatus] = useState<BarberPlanId | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingStatus("loading");
    setErrors({});
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const parsed = bookingLeadSchema.safeParse({
      customerName: getFormValue(formData, "customerName"),
      phone: getFormValue(formData, "phone"),
      email: getFormValue(formData, "email"),
      service: getFormValue(formData, "service"),
      preferredDate: getFormValue(formData, "preferredDate"),
      preferredTime: getFormValue(formData, "preferredTime"),
      referralCode: getFormValue(formData, "referralCode"),
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof BookingLeadInput | undefined;
        if (field) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      setMessage("Controlla i campi evidenziati.");
      setBookingStatus("error");
      return;
    }

    try {
      const result = await saveBookingLead(parsed.data);
      setBookingStatus("success");
      setMessage(
        result.mode === "firebase"
          ? "Prenotazione salvata su Firebase. Ti ricontatteremo per conferma."
          : "Prenotazione salvata in modalita demo locale. Collega Firebase per il database reale."
      );
      event.currentTarget.reset();
    } catch (error) {
      const fallback =
        error instanceof z.ZodError ? "Dati non validi." : "Non riesco a salvare la richiesta.";
      setBookingStatus("error");
      setMessage(fallback);
    }
  }

  async function startCheckout(planId: BarberPlanId) {
    setCheckoutStatus(planId);
    setMessage("");

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Checkout non disponibile.");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout non disponibile.");
      setBookingStatus("error");
    } finally {
      setCheckoutStatus(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        onSubmit={handleBooking}
        className="rounded-[2rem] border border-amber-400/20 bg-zinc-950/80 p-6 shadow-2xl shadow-amber-950/20 backdrop-blur"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-amber-400/15 p-3 text-amber-300">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">Booking live</p>
            <h2 className="text-2xl font-semibold text-white">Prenota il tuo slot</h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome cliente" error={errors.customerName}>
            <Input name="customerName" placeholder="Mario Rossi" autoComplete="name" />
          </Field>
          <Field label="Telefono" error={errors.phone}>
            <Input name="phone" placeholder="+39 333 000 0000" autoComplete="tel" />
          </Field>
          <Field label="Email" error={errors.email}>
            <Input name="email" type="email" placeholder="cliente@email.it" autoComplete="email" />
          </Field>
          <Field label="Servizio" error={errors.service}>
            <select
              name="service"
              defaultValue="combo-signature"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            >
              {Object.entries(serviceLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Data" error={errors.preferredDate}>
            <Input name="preferredDate" type="date" min={minDate} />
          </Field>
          <Field label="Ora" error={errors.preferredTime}>
            <Input name="preferredTime" type="time" min="09:00" max="20:00" />
          </Field>
          <Field label="Codice porta un amico" error={errors.referralCode}>
            <Input name="referralCode" placeholder="FRIEND20" />
          </Field>
        </div>

        <Button className="mt-6 w-full rounded-full" size="lg" disabled={bookingStatus === "loading"}>
          {bookingStatus === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Richiedi appuntamento
        </Button>

        {message ? (
          <p
            className={cn(
              "mt-4 rounded-2xl border px-4 py-3 text-sm",
              bookingStatus === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : "border-amber-400/30 bg-amber-400/10 text-amber-100"
            )}
            role="status"
          >
            {message}
          </p>
        ) : null}
      </form>

      <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/70 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200/70">SaaS pronto</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Monetizza con abbonamenti</h2>
        <div className="mt-6 grid gap-4">
          <PlanCard
            name="Basic"
            price="49 euro/mese"
            description="Agenda, clienti, incassi base e campagne sconto."
            cta="Attiva Basic"
            loading={checkoutStatus === "basic"}
            onClick={() => startCheckout("basic")}
          />
          <PlanCard
            name="Pro"
            price="129 euro/mese"
            description="Multi-operatore, referral, KPI avanzati e automazioni marketing."
            cta="Scala con Pro"
            highlighted
            loading={checkoutStatus === "pro"}
            onClick={() => startCheckout("pro")}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-amber-300">{error}</p> : null}
    </div>
  );
}

function PlanCard({
  name,
  price,
  description,
  cta,
  highlighted,
  loading,
  onClick,
}: {
  name: string;
  price: string;
  description: string;
  cta: string;
  highlighted?: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-3xl border p-5",
        highlighted
          ? "border-amber-300/60 bg-amber-300/10 shadow-xl shadow-amber-950/20"
          : "border-zinc-800 bg-zinc-900/70"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{name}</p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">{price}</p>
          <p className="mt-2 text-sm text-zinc-400">{description}</p>
        </div>
        {highlighted ? (
          <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-zinc-950">
            Consigliato
          </span>
        ) : null}
      </div>
      <Button
        type="button"
        variant={highlighted ? "default" : "secondary"}
        className="mt-5 w-full rounded-full"
        onClick={onClick}
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {cta}
      </Button>
    </article>
  );
}
