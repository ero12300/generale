"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  Clock,
  Scissors,
  CalendarDays,
  User,
  Tag,
  PartyPopper,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useStore } from "@/lib/store/store-context";
import { eur, applyDiscount } from "@/lib/money";
import { generateSlots } from "@/lib/slots";
import { addDays, toISODate, formatDate, cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3 | 4;

export default function BookingPage() {
  const { state, createBooking, validateCoupon, ready } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [serviceId, setServiceId] = useState<string>("");
  const [barberId, setBarberId] = useState<string>("");
  const [dateISO, setDateISO] = useState<string>(toISODate(new Date()));
  const [slotISO, setSlotISO] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [referral, setReferral] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const activeServices = state.services.filter((s) => s.active);
  const activeBarbers = state.barbers.filter((b) => b.active);
  const service = activeServices.find((s) => s.id === serviceId);

  const dates = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)),
    [],
  );

  const slots = useMemo(() => {
    if (!service || !barberId) return [];
    return generateSlots(state.settings, state.bookings, barberId, dateISO, service.durationMin);
  }, [service, barberId, dateISO, state.settings, state.bookings]);

  const couponResult = useMemo(() => {
    if (!service || !coupon.trim()) return null;
    return validateCoupon(coupon, service.priceCents);
  }, [coupon, service, validateCoupon]);

  const finalPrice = useMemo(() => {
    if (!service) return { finalCents: 0, discountCents: 0 };
    if (couponResult?.ok) {
      return { finalCents: couponResult.finalCents, discountCents: couponResult.discountCents };
    }
    return applyDiscount(service.priceCents, "fisso", 0);
  }, [service, couponResult]);

  function next() {
    setStep((s) => Math.min(4, s + 1) as Step);
  }
  function back() {
    setStep((s) => Math.max(0, s - 1) as Step);
  }

  function handleConfirm() {
    if (!service || !barberId || !slotISO || !name || !phone) return;
    const booking = createBooking({
      clientName: name,
      clientPhone: phone,
      clientEmail: email || undefined,
      serviceId,
      barberId,
      start: slotISO,
      couponCode: couponResult?.ok ? coupon : undefined,
      referralCode: referral || undefined,
      source: "online",
    });
    if (booking) setConfirmed(true);
  }

  const barber = activeBarbers.find((b) => b.id === barberId);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="mx-auto max-w-md px-5 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient text-[#0b0b0f]">
            <PartyPopper size={30} />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Richiesta inviata!</h1>
          <p className="mt-2 text-muted">
            Grazie {name.split(" ")[0]}, abbiamo ricevuto la tua richiesta. La barberia ti
            confermerà l&apos;appuntamento a breve.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-5 text-left">
            <Row label="Servizio" value={service?.name ?? ""} />
            <Row label="Barbiere" value={barber?.name ?? ""} />
            <Row label="Quando" value={`${formatDate(slotISO)} · ${new Date(slotISO).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`} />
            <Row label="Totale" value={eur(finalPrice.finalCents)} />
          </div>
          <Link href="/" className="mt-6 inline-block text-sm text-[var(--gold-soft)] hover:underline">
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="mx-auto max-w-2xl px-5 py-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Prenota da <span className="text-gradient-gold">{state.settings.shopName}</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Scegli servizio, barbiere e orario. Ci vuole meno di un minuto.</p>

        <Stepper step={step} />

        <div className="mt-6">
          {step === 0 && (
            <StepShell title="Scegli il servizio">
              <div className="grid gap-3 sm:grid-cols-2">
                {activeServices.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setServiceId(s.id); next(); }}
                    className={cn(
                      "card-hover flex items-center justify-between rounded-2xl border p-4 text-left",
                      serviceId === s.id ? "border-[var(--gold)] bg-[var(--gold)]/8" : "border-border bg-surface",
                    )}
                  >
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                        <Clock size={12} /> {s.durationMin} min
                      </div>
                    </div>
                    <span className="font-semibold text-[var(--gold-soft)]">{eur(s.priceCents)}</span>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title="Scegli il barbiere">
              <div className="grid gap-3 sm:grid-cols-2">
                {activeBarbers.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setBarberId(b.id); next(); }}
                    className={cn(
                      "card-hover flex items-center gap-3 rounded-2xl border p-4 text-left",
                      barberId === b.id ? "border-[var(--gold)] bg-[var(--gold)]/8" : "border-border bg-surface",
                    )}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-[#0b0b0f]"
                      style={{ background: b.color }}
                    >
                      {b.name[0]}
                    </span>
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted">{b.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Scegli data e ora">
              <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                {dates.map((d) => {
                  const iso = toISODate(d);
                  const isOpen = state.settings.workingDays.includes(d.getDay());
                  return (
                    <button
                      key={iso}
                      disabled={!isOpen}
                      onClick={() => { setDateISO(iso); setSlotISO(""); }}
                      className={cn(
                        "flex min-w-[64px] shrink-0 flex-col items-center rounded-xl border px-3 py-2 text-sm",
                        !isOpen && "opacity-30",
                        dateISO === iso ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-border bg-surface",
                      )}
                    >
                      <span className="text-xs text-muted">{["Dom","Lun","Mar","Mer","Gio","Ven","Sab"][d.getDay()]}</span>
                      <span className="text-lg font-semibold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.length === 0 && (
                  <p className="col-span-full py-6 text-center text-sm text-muted">
                    Nessuno slot disponibile in questa data. Prova un altro giorno.
                  </p>
                )}
                {slots.map((slot) => (
                  <button
                    key={slot.iso}
                    disabled={!slot.available}
                    onClick={() => setSlotISO(slot.iso)}
                    className={cn(
                      "rounded-xl border py-2.5 text-sm font-medium tabular-nums transition",
                      !slot.available && "cursor-not-allowed opacity-30 line-through",
                      slotISO === slot.iso
                        ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                        : "border-border bg-surface hover:border-[var(--gold-deep)]",
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>

              <Button className="mt-6 w-full" disabled={!slotISO} onClick={next}>
                Continua
              </Button>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="I tuoi dati">
              <div className="space-y-4">
                <Field label="Nome e cognome" htmlFor="name">
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mario Rossi" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Telefono" htmlFor="phone">
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 1234567" />
                  </Field>
                  <Field label="Email (opzionale)" htmlFor="email">
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@email.it" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Codice sconto (opzionale)" htmlFor="coupon">
                    <Input id="coupon" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="BENVENUTO20" />
                    {couponResult && (
                      <p className={cn("mt-1 text-xs", couponResult.ok ? "text-[var(--success)]" : "text-[var(--danger)]")}>
                        {couponResult.ok ? `Sconto applicato: -${eur(couponResult.discountCents)}` : couponResult.reason}
                      </p>
                    )}
                  </Field>
                  <Field label="Codice amico (opzionale)" htmlFor="ref">
                    <Input id="ref" value={referral} onChange={(e) => setReferral(e.target.value.toUpperCase())} placeholder="MARI1234" />
                  </Field>
                </div>
                <Button className="w-full" disabled={!name || !phone} onClick={next}>
                  Rivedi e conferma
                </Button>
              </div>
            </StepShell>
          )}

          {step === 4 && service && (
            <StepShell title="Conferma prenotazione">
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <SummaryRow icon={<Scissors size={16} />} label="Servizio" value={`${service.name} · ${service.durationMin} min`} />
                  <SummaryRow icon={<User size={16} />} label="Barbiere" value={barber?.name ?? ""} />
                  <SummaryRow icon={<CalendarDays size={16} />} label="Quando" value={`${formatDate(slotISO)} · ${new Date(slotISO).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`} />
                  {finalPrice.discountCents > 0 && (
                    <SummaryRow icon={<Tag size={16} />} label="Sconto" value={`-${eur(finalPrice.discountCents)}`} />
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted">Totale</span>
                    <span className="text-xl font-bold text-[var(--gold-soft)]">{eur(finalPrice.finalCents)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted">
                  Inviando la richiesta accetti di essere ricontattato dalla barberia per la conferma.
                </p>
                <Button className="w-full" size="lg" onClick={handleConfirm}>
                  <Check size={18} /> Invia richiesta di prenotazione
                </Button>
              </div>
            </StepShell>
          )}
        </div>

        {step > 0 && !confirmed && (
          <button onClick={back} className="mt-5 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
            <ChevronLeft size={16} /> Indietro
          </button>
        )}

        {!ready && <p className="mt-4 text-xs text-muted">Caricamento…</p>}
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3.5">
        <Link href="/"><Logo /></Link>
        <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">Area gestore</Link>
      </div>
    </header>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Servizio", "Barbiere", "Data", "Dati", "Conferma"];
  return (
    <div className="mt-6 flex items-center gap-1.5">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-1 flex-col items-center gap-1.5">
          <div className={cn("h-1.5 w-full rounded-full", i <= step ? "gold-gradient" : "bg-border")} />
          <span className={cn("text-[10px] sm:text-xs", i <= step ? "text-[var(--gold-soft)]" : "text-muted")}>{l}</span>
        </div>
      ))}
    </div>
  );
}

function StepShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="flex items-center gap-2 text-sm text-muted">{icon} {label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
