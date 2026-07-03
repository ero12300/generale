"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import type { Appointment, Barber, Service } from "@/lib/types";
import { formatEuro } from "@/lib/money";
import { addDays, longDateLabel, todayISO, weekdayLabel } from "@/lib/dates";
import { cn } from "@/lib/cn";

interface Catalog {
  services: Service[];
  barbers: Barber[];
  shopName: string;
  closedWeekdays: number[];
}

interface BookingResult {
  appointment: Appointment;
  referralCode: string;
  totalCents: number;
}

type Step = 1 | 2 | 3;

export function BookingWizard() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("servizio");

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<string | null>(preselected);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => {
        if (!r.ok) throw new Error("catalog");
        return r.json();
      })
      .then(setCatalog)
      .catch(() => setLoadError("Impossibile caricare i servizi. Riprova."));
  }, []);

  const service = catalog?.services.find((s) => s.id === serviceId) ?? null;
  const barber = catalog?.barbers.find((b) => b.id === barberId) ?? null;

  const days = useMemo(() => {
    if (!catalog) return [];
    const list: string[] = [];
    let d = todayISO();
    while (list.length < 10) {
      const weekday = new Date(`${d}T12:00:00`).getDay();
      if (!catalog.closedWeekdays.includes(weekday)) list.push(d);
      d = addDays(d, 1);
    }
    return list;
  }, [catalog]);

  const loadSlots = useCallback(
    (selectedDate: string, selectedBarber: string, selectedService: string) => {
      setSlots(null);
      setTime(null);
      setSlotsLoading(true);
      const params = new URLSearchParams({
        date: selectedDate,
        barberId: selectedBarber,
        serviceId: selectedService,
      });
      fetch(`/api/availability?${params}`)
        .then((r) => r.json())
        .then((data) => setSlots(data.slots ?? []))
        .catch(() => setSlots([]))
        .finally(() => setSlotsLoading(false));
    },
    [],
  );

  async function submit() {
    if (!service || !barber || !date || !time) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          barberId: barber.id,
          date,
          time,
          clientName,
          clientPhone,
          clientEmail,
          discountCode: discountCode || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Errore durante la prenotazione.");
        return;
      }
      setResult(data);
    } catch {
      setSubmitError("Connessione non riuscita. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <div className="mt-10 flex items-center gap-3 rounded-2xl border border-danger/40 bg-surface p-6 text-danger">
        <CircleAlert className="h-5 w-5" aria-hidden /> {loadError}
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="mt-10 flex items-center gap-3 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Caricamento
        servizi…
      </div>
    );
  }

  if (result) {
    return (
      <div className="mt-10 rounded-2xl border border-gold-dim bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
        <h2 className="font-display mt-4 text-3xl font-bold">
          Prenotazione inviata!
        </h2>
        <p className="mt-2 text-muted">
          Ti aspettiamo <strong className="text-foreground">{longDateLabel(result.appointment.date)}</strong>{" "}
          alle <strong className="text-foreground">{result.appointment.time}</strong> con{" "}
          {result.appointment.barberName}.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-border bg-surface-2 p-5">
          <p className="text-sm text-muted">Totale da pagare in negozio</p>
          <p className="font-display mt-1 text-3xl font-bold text-gold-soft">
            {formatEuro(result.totalCents)}
          </p>
          {result.appointment.discountCents > 0 && (
            <p className="mt-1 text-xs text-success">
              Sconto {result.appointment.discountCode} applicato: −
              {formatEuro(result.appointment.discountCents)}
            </p>
          )}
        </div>
        <div className="mx-auto mt-4 max-w-sm rounded-xl border border-gold-dim/50 bg-surface-2 p-5">
          <p className="text-sm text-muted">Il tuo codice &quot;porta un amico&quot;</p>
          <p className="font-display mt-1 text-2xl font-bold tracking-widest text-gold">
            {result.referralCode}
          </p>
          <p className="mt-1 text-xs text-muted">
            Regala il 15% di sconto a chi lo usa alla prima prenotazione.
          </p>
        </div>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gold px-7 py-3 font-semibold text-background transition-colors hover:bg-gold-soft"
        >
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Stepper */}
      <ol className="flex items-center gap-2" aria-label="Passaggi prenotazione">
        {[
          [1, "Servizio"],
          [2, "Data e ora"],
          [3, "I tuoi dati"],
        ].map(([n, label]) => (
          <li key={n} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                step >= (n as number)
                  ? "border-gold bg-gold text-background"
                  : "border-border text-muted",
              )}
              aria-current={step === n ? "step" : undefined}
            >
              {n}
            </span>
            <span
              className={cn(
                "hidden text-sm sm:block",
                step >= (n as number) ? "text-foreground" : "text-muted",
              )}
            >
              {label}
            </span>
            {(n as number) < 3 && <span className="h-px flex-1 bg-border" />}
          </li>
        ))}
      </ol>

      {/* Step 1: servizio */}
      {step === 1 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {catalog.services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setServiceId(s.id);
                setStep(2);
                if (barberId && date) loadSlots(date, barberId, s.id);
              }}
              className={cn(
                "rounded-2xl border p-5 text-left transition-all hover:border-gold-dim",
                serviceId === s.id
                  ? "border-gold bg-surface"
                  : "border-border bg-surface",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-display text-lg font-semibold">
                  {s.name}
                </span>
                <span className="font-display font-bold text-gold-soft">
                  {formatEuro(s.priceCents)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted">
                {s.durationMin} min
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: barbiere + data + ora */}
      {step === 2 && service && (
        <div className="mt-8 space-y-8">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Scegli il barbiere
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {catalog.barbers.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBarberId(b.id);
                    if (date) loadSlots(date, b.id, service.id);
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors hover:border-gold-dim",
                    barberId === b.id ? "border-gold bg-surface" : "border-border bg-surface",
                  )}
                >
                  <p className="font-display text-lg font-semibold">{b.name}</p>
                  <p className="text-sm text-muted">{b.role}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
              Scegli il giorno
            </h2>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDate(d);
                    if (barberId) loadSlots(d, barberId, service.id);
                  }}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-sm capitalize transition-colors hover:border-gold-dim",
                    date === d ? "border-gold bg-surface text-gold-soft" : "border-border bg-surface",
                  )}
                >
                  {weekdayLabel(d)}
                </button>
              ))}
            </div>
          </div>

          {barberId && date && (
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
                Orari disponibili
              </h2>
              {slotsLoading && (
                <p className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Controllo disponibilità…
                </p>
              )}
              {!slotsLoading && slots && slots.length === 0 && (
                <p className="text-sm text-muted">
                  Nessuno slot libero per questo giorno: prova un altro giorno o
                  un altro barbiere.
                </p>
              )}
              {!slotsLoading && slots && slots.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {slots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTime(t)}
                      className={cn(
                        "rounded-xl border px-4 py-2.5 text-sm tabular-nums transition-colors hover:border-gold-dim",
                        time === t ? "border-gold bg-gold text-background font-bold" : "border-border bg-surface",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:border-gold-dim"
            >
              ← Indietro
            </button>
            <button
              type="button"
              disabled={!barberId || !date || !time}
              onClick={() => setStep(3)}
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continua →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: dati cliente */}
      {step === 3 && service && barber && date && time && (
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="rounded-2xl border border-gold-dim/50 bg-surface p-5">
            <p className="text-sm text-muted">Riepilogo</p>
            <p className="font-display mt-1 text-xl font-semibold">
              {service.name} · {formatEuro(service.priceCents)}
            </p>
            <p className="mt-1 text-sm capitalize text-muted">
              {longDateLabel(date)} alle {time} — con {barber.name}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Nome e cognome *</span>
              <input
                required
                minLength={2}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/60"
                placeholder="Mario Rossi"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Telefono *</span>
              <input
                required
                type="tel"
                minLength={6}
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/60"
                placeholder="333 123 4567"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">Email</span>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/60"
                placeholder="mario@email.it"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">
                Codice sconto o codice amico
              </span>
              <input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/60"
                placeholder="es. BENVENUTO10"
              />
            </label>
          </div>

          {submitError && (
            <p className="flex items-center gap-2 rounded-xl border border-danger/40 bg-surface p-4 text-sm text-danger" role="alert">
              <CircleAlert className="h-4 w-4 shrink-0" aria-hidden />
              {submitError}
            </p>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition-colors hover:border-gold-dim"
            >
              ← Indietro
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-gold px-8 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Conferma prenotazione
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
