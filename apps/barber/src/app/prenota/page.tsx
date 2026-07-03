"use client";

import { ArrowLeft, CalendarCheck, Check, Scissors } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  Spinner,
} from "@/components/ui";
import {
  availableSlots,
  computeDiscount,
  findCampaignByCode,
  findCustomerByReferralCode,
  toIsoDate,
} from "@/lib/logic";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import { PLANS, type Booking } from "@/lib/types";
import { bookingInputSchema } from "@/lib/validation";

type Step = 1 | 2 | 3;

export default function BookingPage() {
  const { state, loading, addBooking } = useStore();
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toIsoDate(d);
  });
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const service = state?.services.find((s) => s.id === serviceId);
  const barber = state?.barbers.find((b) => b.id === barberId);

  const slots = useMemo(() => {
    if (!state || !service || !barberId || !date) return [];
    return availableSlots({
      date,
      openingHour: state.settings.openingHour,
      closingHour: state.settings.closingHour,
      slotMinutes: state.settings.slotMinutes,
      closedWeekdays: state.settings.closedWeekdays,
      service,
      barberId,
      bookings: state.bookings,
    });
  }, [state, service, barberId, date]);

  const promoPreview = useMemo(() => {
    if (!state || !service || !promoCode.trim()) return null;
    const plan = PLANS[state.settings.plan];
    if (!plan.campaigns) return null;
    const campaign = findCampaignByCode(state.campaigns, promoCode);
    if (campaign) {
      return {
        label: campaign.name,
        discountCents: computeDiscount(service.priceCents, campaign),
      };
    }
    if (plan.referralProgram) {
      const referrer = findCustomerByReferralCode(state.customers, promoCode);
      const referralCampaign = state.campaigns.find(
        (c) => c.kind === "referral" && c.active,
      );
      if (referrer && referralCampaign) {
        return {
          label: `Porta un amico — ospite di ${referrer.name}`,
          discountCents: computeDiscount(service.priceCents, referralCampaign),
        };
      }
    }
    return { label: "Codice non riconosciuto", discountCents: 0, invalid: true };
  }, [state, service, promoCode]);

  function handleSubmit() {
    setSubmitError(null);
    const parsed = bookingInputSchema.safeParse({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      serviceId,
      barberId,
      date,
      time,
      promoCode,
      marketingConsent: consent,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const result = addBooking(parsed.data);
    setSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    setConfirmed(result.data);
  }

  if (loading || !state) {
    return (
      <PageShell>
        <Spinner label="Preparo il calendario…" />
      </PageShell>
    );
  }

  if (confirmed) {
    return (
      <PageShell>
        <Card className="mx-auto max-w-lg space-y-5 text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <Check className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="font-display text-3xl text-cream">
            Prenotazione confermata
          </h1>
          <div className="space-y-1 text-sm text-cream/70">
            <p>
              <strong className="text-cream">{confirmed.serviceName}</strong> con{" "}
              {confirmed.barberName}
            </p>
            <p>
              {formatDateIt(confirmed.date)} alle {confirmed.time}
            </p>
            <p className="text-gold-300">
              Totale:{" "}
              {formatEuro(confirmed.priceCents - confirmed.discountCents)}
              {confirmed.discountCents > 0 ? (
                <span className="text-cream/50">
                  {" "}
                  (sconto {formatEuro(confirmed.discountCents)})
                </span>
              ) : null}
            </p>
          </div>
          <p className="text-xs text-cream/40">
            Ti aspettiamo! Riceverai un promemoria dal salone.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/">
              <Button variant="outline">Torna alla home</Button>
            </Link>
            <Button
              onClick={() => {
                setConfirmed(null);
                setStep(1);
                setServiceId("");
                setBarberId("");
                setTime("");
              }}
            >
              Nuova prenotazione
            </Button>
          </div>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <Badge tone="gold">Prenotazione online</Badge>
          <h1 className="font-display mt-3 text-4xl text-cream">
            Riserva la tua poltrona
          </h1>
          <p className="mt-2 text-sm text-cream/50">
            Passo {step} di 3 —{" "}
            {step === 1
              ? "scegli il servizio"
              : step === 2
                ? "scegli barbiere, data e orario"
                : "i tuoi dati"}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid gap-3">
            {state.services
              .filter((s) => s.active)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setServiceId(s.id);
                    setTime("");
                    setStep(2);
                  }}
                  className={`rounded-2xl border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-gold-400 ${
                    serviceId === s.id
                      ? "border-gold-500/60 bg-gold-500/10"
                      : "border-white/10 bg-ink-900/70 hover:border-gold-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg text-cream">{s.name}</p>
                      <p className="mt-0.5 text-xs text-cream/50">
                        {s.description}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-cream/40">
                        {s.durationMinutes} min
                      </p>
                    </div>
                    <p className="font-display text-xl text-gold-400">
                      {formatEuro(s.priceCents)}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        ) : null}

        {step === 2 && service ? (
          <Card className="space-y-5">
            <SummaryRow label="Servizio" value={service.name} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Barbiere" htmlFor="barber">
                <Select
                  id="barber"
                  value={barberId}
                  onChange={(e) => {
                    setBarberId(e.target.value);
                    setTime("");
                  }}
                >
                  <option value="">Scegli…</option>
                  {state.barbers
                    .filter((b) => b.active)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.role}
                      </option>
                    ))}
                </Select>
              </Field>
              <Field label="Data" htmlFor="date">
                <Input
                  id="date"
                  type="date"
                  min={toIsoDate(new Date())}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime("");
                  }}
                />
              </Field>
            </div>

            {barberId ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cream/60">
                  Orari disponibili
                </p>
                {slots.length === 0 ? (
                  <p className="text-sm text-cream/40">
                    Nessuno slot libero in questa data (il salone è chiuso o è
                    tutto prenotato). Prova un altro giorno.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition focus-visible:outline-2 focus-visible:outline-gold-400 ${
                          time === slot
                            ? "border-gold-500 bg-gold-500 text-ink-950"
                            : "border-white/15 text-cream/70 hover:border-gold-500/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Indietro
              </Button>
              <Button disabled={!barberId || !time} onClick={() => setStep(3)}>
                Continua
              </Button>
            </div>
          </Card>
        ) : null}

        {step === 3 && service && barber ? (
          <Card className="space-y-5">
            <div className="space-y-2 rounded-xl bg-ink-800/60 p-4 text-sm">
              <SummaryRow label="Servizio" value={service.name} />
              <SummaryRow label="Barbiere" value={barber.name} />
              <SummaryRow
                label="Quando"
                value={`${formatDateIt(date)} · ${time}`}
              />
              <SummaryRow
                label="Prezzo"
                value={
                  promoPreview && !promoPreview.invalid
                    ? `${formatEuro(service.priceCents - promoPreview.discountCents)} (−${formatEuro(promoPreview.discountCents)})`
                    : formatEuro(service.priceCents)
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome e cognome" htmlFor="name" error={errors.customerName}>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mario Rossi"
                  autoComplete="name"
                />
              </Field>
              <Field label="Telefono" htmlFor="phone" error={errors.customerPhone}>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 333 1234567"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>
            </div>
            <Field
              label="Email (facoltativa)"
              htmlFor="email"
              error={errors.customerEmail}
            >
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario@esempio.it"
                autoComplete="email"
              />
            </Field>
            <Field label="Codice sconto o codice amico" htmlFor="promo">
              <Input
                id="promo"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Es. BENVENUTO10 o il codice di un amico"
              />
              {promoPreview ? (
                <p
                  className={`text-xs ${promoPreview.invalid ? "text-red-400" : "text-emerald-300"}`}
                >
                  {promoPreview.invalid
                    ? "Codice non riconosciuto"
                    : `${promoPreview.label}: −${formatEuro(promoPreview.discountCents)}`}
                </p>
              ) : null}
            </Field>
            <label className="flex items-start gap-2 text-xs text-cream/50">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-gold-500"
              />
              Acconsento a ricevere promozioni e promemoria dal salone
              (facoltativo).
            </label>

            {submitError ? (
              <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
                {submitError}
              </p>
            ) : null}

            <div className="flex justify-between pt-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" aria-hidden /> Indietro
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                <CalendarCheck className="h-4 w-4" aria-hidden />
                {submitting ? "Confermo…" : "Conferma prenotazione"}
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="mx-auto mb-10 flex max-w-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-cream">
          <Scissors className="h-5 w-5 text-gold-400" aria-hidden />
          <span className="font-display text-lg">BarberSuite</span>
        </Link>
        <Link href="/" className="text-sm text-cream/50 hover:text-cream">
          ← Home
        </Link>
      </header>
      {children}
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-widest text-cream/40">
        {label}
      </span>
      <span className="text-sm text-cream">{value}</span>
    </div>
  );
}

function formatDateIt(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
