"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { demoStore, DEMO_ORG_ID } from "@/lib/demo-store";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency, formatDate, formatTime, generateId } from "@/lib/utils";
import type { Booking, Organization, Service } from "@/types";

const SLOT_MINUTES = 30;

function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function generateSlots(
  date: Date,
  openingHours: Organization["openingHours"],
  bookings: Booking[],
  service: Service | null
): { time: string; iso: string; available: boolean }[] {
  const weekday = date.getDay();
  const hours = openingHours.find((h) => h.weekday === weekday);
  if (!hours || hours.closed) return [];
  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const slots: { time: string; iso: string; available: boolean }[] = [];
  const duration = service?.durationMin ?? 30;
  const dayStart = new Date(date);
  dayStart.setHours(openH ?? 9, openM ?? 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(closeH ?? 19, closeM ?? 0, 0, 0);
  const now = new Date();

  const dayBookings = bookings.filter((b) => {
    const s = new Date(b.startAt);
    return s.toDateString() === date.toDateString() && b.status !== "cancelled";
  });

  for (let t = new Date(dayStart); t.getTime() + duration * 60_000 <= dayEnd.getTime(); t = new Date(t.getTime() + SLOT_MINUTES * 60_000)) {
    const slotStart = t.getTime();
    const slotEnd = slotStart + duration * 60_000;
    if (slotStart < now.getTime()) continue;
    const overlap = dayBookings.some((b) => {
      const bs = new Date(b.startAt).getTime();
      const be = new Date(b.endAt).getTime();
      return slotStart < be && slotEnd > bs;
    });
    slots.push({
      time: t.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }),
      iso: new Date(t).toISOString(),
      available: !overlap,
    });
  }
  return slots;
}

export function PublicBookingPage({ slug: _slug }: { slug: string }) {
  const { push } = useToast();
  const [org, setOrg] = useState<Organization | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date>(startOfDay(new Date()));
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setOrg(demoStore.getOrganization());
    setServices(demoStore.listServices().filter((s) => s.active));
    setBookings(demoStore.listBookings());
  }, []);

  const slots = useMemo(() => {
    if (!org) return [];
    return generateSlots(date, org.openingHours, bookings, service);
  }, [org, date, bookings, service]);

  function handleConfirm() {
    if (!service || !slotIso || !clientName.trim()) {
      push("Compila tutti i campi", "error");
      return;
    }
    const start = new Date(slotIso);
    const end = new Date(start.getTime() + service.durationMin * 60_000);
    const booking: Booking = {
      id: generateId("bkg"),
      organizationId: DEMO_ORG_ID,
      clientName: clientName.trim(),
      clientPhone,
      serviceId: service.id,
      serviceName: service.name,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      price: service.price,
      status: "pending",
      notes,
      source: "public",
      createdAt: new Date().toISOString(),
    };
    demoStore.upsertBooking(booking);
    setConfirmedBooking(booking);
    setStep(4);
    push("Prenotazione inviata!", "success");
  }

  if (!org) return null;

  return (
    <div className="min-h-screen grain relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gold-500/5 blur-[120px]" />
      </div>

      <header className="border-b border-white/5">
        <div className="mx-auto max-w-3xl px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950">
              <Scissors className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg text-ink-50 tracking-tight">
              {org.name}
            </span>
          </Link>
          <Badge variant="gold">
            <Sparkles className="h-3 w-3" /> Prenotazione online
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-ink-50 tracking-tight">
            Prenota il tuo <span className="gradient-text italic">appuntamento</span>
          </h1>
          <p className="mt-3 text-ink-300">Scegli servizio, data e orario. Ci vogliono 20 secondi.</p>
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-ink-400 flex-wrap">
            {org.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold-400" /> {org.address}
              </span>
            )}
            {org.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gold-400" /> {org.phone}
              </span>
            )}
          </div>
        </div>

        {/* Stepper */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-xs font-medium border transition-colors",
                  step >= s ? "bg-gold-400/20 border-gold-400/50 text-gold-100" : "bg-white/5 border-white/10 text-ink-400"
                )}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && <div className={cn("h-px w-10 mx-1", step > s ? "bg-gold-400/40" : "bg-white/10")} />}
              </div>
            ))}
          </div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <h2 className="font-display text-2xl text-ink-50 mb-3">Scegli il servizio</h2>
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => { setService(s); setStep(2); }}
                className={cn(
                  "w-full rounded-xl border p-5 flex items-center justify-between text-left transition-all group",
                  service?.id === s.id ? "border-gold-400/50 bg-gold-400/10" : "border-white/10 bg-white/[0.02] hover:border-gold-400/30 hover:bg-white/[0.04]"
                )}
              >
                <div>
                  <div className="font-display text-xl text-ink-50">{s.name}</div>
                  <div className="text-sm text-ink-400 mt-1 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> {s.durationMin} minuti
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl gradient-text">{formatCurrency(s.price)}</div>
                  <ArrowRight className="h-4 w-4 text-gold-300 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && service && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-ink-50">Scegli data e ora</h2>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" /> Servizio
              </Button>
            </div>
            <div className="surface rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-thin">
                {Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i)).map((d) => {
                  const selected = d.toDateString() === date.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => { setDate(d); setSlotIso(null); }}
                      className={cn(
                        "shrink-0 rounded-xl border p-3 min-w-[64px] text-center transition-colors",
                        selected ? "border-gold-400/50 bg-gold-400/10 text-gold-100" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-ink-200"
                      )}
                    >
                      <div className="text-[10px] uppercase tracking-widest opacity-70">
                        {d.toLocaleDateString("it-IT", { weekday: "short" })}
                      </div>
                      <div className="font-display text-xl mt-0.5">{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="surface rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-ink-200">
                <CalendarDays className="h-4 w-4 text-gold-300" />
                <span className="font-medium">{formatDate(date, { weekday: "long", day: "numeric", month: "long" })}</span>
              </div>
              {slots.length === 0 ? (
                <div className="text-center py-8 text-ink-400 text-sm">
                  Chiuso in questa data o nessuno slot disponibile.
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.iso}
                      disabled={!s.available}
                      onClick={() => setSlotIso(s.iso)}
                      className={cn(
                        "rounded-lg border py-2.5 text-sm transition-colors",
                        !s.available && "opacity-30 line-through cursor-not-allowed",
                        slotIso === s.iso ? "border-gold-400/50 bg-gold-400/10 text-gold-100" :
                        s.available ? "border-white/10 bg-white/5 text-ink-100 hover:bg-white/10 hover:border-white/20" :
                        "border-white/5 bg-white/[0.02] text-ink-500"
                      )}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={!slotIso} onClick={() => setStep(3)}>
                Continua <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && service && slotIso && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-ink-50">I tuoi dati</h2>
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" /> Data
              </Button>
            </div>
            <div className="surface rounded-xl p-6">
              <div className="rounded-lg border border-gold-400/20 bg-gold-400/5 p-3 mb-5 text-sm">
                <div className="text-gold-200 font-medium">{service.name}</div>
                <div className="text-xs text-ink-300 mt-1">
                  {formatDate(new Date(slotIso), { weekday: "long", day: "numeric", month: "long" })} · {formatTime(slotIso)} · {formatCurrency(service.price)}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome</Label>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)} required placeholder="Mario Rossi" />
                </div>
                <div>
                  <Label>Telefono</Label>
                  <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="+39 ..." required />
                </div>
                <div className="md:col-span-2">
                  <Label>Email (per il promemoria)</Label>
                  <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="opzionale" />
                </div>
                <div className="md:col-span-2">
                  <Label>Note (opzionale)</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, richieste speciali..." />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button disabled={!clientName || !clientPhone} onClick={handleConfirm} size="lg">
                Conferma prenotazione <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && confirmedBooking && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="font-display text-3xl text-ink-50 tracking-tight">Prenotazione confermata!</h2>
            <p className="mt-2 text-ink-300">Ti aspettiamo il giorno concordato.</p>
            <div className="mt-8 surface rounded-2xl p-6 max-w-md mx-auto text-left space-y-3">
              <Row label="Servizio" value={confirmedBooking.serviceName} />
              <Row label="Data" value={formatDate(confirmedBooking.startAt, { weekday: "long", day: "numeric", month: "long" })} />
              <Row label="Ora" value={formatTime(confirmedBooking.startAt)} />
              <Row label="Cliente" value={confirmedBooking.clientName} />
              <Row label="Importo" value={formatCurrency(confirmedBooking.price)} />
              <div className="pt-2 border-t border-white/5 text-xs text-ink-400">
                Riceverai un promemoria via SMS il giorno prima. Se devi disdire, contatta il salone.
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="secondary" onClick={() => {
                setStep(1);
                setService(null);
                setSlotIso(null);
                setClientName("");
                setClientPhone("");
                setClientEmail("");
                setNotes("");
                setConfirmedBooking(null);
                setBookings(demoStore.listBookings());
              }}>
                Nuova prenotazione
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="py-8 border-t border-white/5 mt-10">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-ink-500">
          Powered by <span className="text-gold-300">Filo</span> · La suite premium per barber shop
        </div>
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs uppercase tracking-widest text-ink-400">{label}</span>
      <span className="text-sm text-ink-100 font-medium">{value}</span>
    </div>
  );
}
