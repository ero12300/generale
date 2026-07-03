"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Scissors,
  MapPin,
  Phone,
  Sparkles,
  Clock,
  CheckCircle2,
  Gift,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { demoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatEuro, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import type { Service } from "@/types";

type Step = "service" | "time" | "info" | "done";

export function BookingClient() {
  const { shop, services, campaigns, clients } = useShopData();
  const params = useSearchParams();
  const referralCode = params.get("ref");
  const [step, setStep] = React.useState<Step>("service");
  const [service, setService] = React.useState<Service | null>(null);
  const [slot, setSlot] = React.useState<Date | null>(null);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [confirmedBooking, setConfirmedBooking] = React.useState<{
    id: string;
    starts: string;
  } | null>(null);

  const activeServices = services.filter((s) => s.active);
  const referralCampaign = campaigns.find((c) => c.type === "referral" && c.active);
  const referredByClient = referralCode
    ? clients.find((c) => c.referralCode === referralCode)
    : undefined;
  const hasReferralDiscount =
    referredByClient && referralCampaign
      ? true
      : false;
  const referralDiscountCents =
    referralCampaign && hasReferralDiscount
      ? referralCampaign.discountKind === "fixed"
        ? referralCampaign.discountValue
        : service
          ? Math.round((service.priceCents * referralCampaign.discountValue) / 100)
          : 0
      : 0;

  function goNext() {
    if (step === "service" && service) setStep("time");
    else if (step === "time" && slot) setStep("info");
  }
  function goBack() {
    if (step === "time") setStep("service");
    else if (step === "info") setStep("time");
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !slot || !name) return;
    const end = new Date(slot.getTime() + service.durationMinutes * 60_000);

    const created = demoStore.createBooking({
      clientName: name,
      clientPhone: phone || undefined,
      clientEmail: email || undefined,
      serviceId: service.id,
      serviceName: service.name,
      priceCents: service.priceCents,
      startsAt: slot.toISOString(),
      endsAt: end.toISOString(),
      notes: notes || undefined,
      status: "pending",
      source: hasReferralDiscount ? "referral" : "public",
      discountCents: referralDiscountCents || undefined,
      discountReason: hasReferralDiscount
        ? `Codice referral ${referredByClient?.referralCode}`
        : undefined,
    });

    // Se referral, incrementa la campagna
    if (hasReferralDiscount && referralCampaign) {
      demoStore.updateCampaign(referralCampaign.id, {
        redemptions: referralCampaign.redemptions + 1,
      });
    }

    setConfirmedBooking({ id: created.id, starts: created.startsAt });
    setStep("done");
    toast({
      title: "Prenotazione ricevuta",
      description: `${service.name} · ${new Intl.DateTimeFormat("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(slot)}`,
      variant: "success",
    });
  }

  return (
    <div className="min-h-dvh grain">
      <header className="border-b border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-gradient-to-br from-[color:var(--color-gold-400)] to-[color:var(--color-gold-500)] text-ink-950">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-2xl text-ink-50 leading-none">
                {shop.name}
              </div>
              <div className="text-xs text-ink-400 mt-1 flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {shop.city}
                </span>
                {shop.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {shop.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs text-ink-400 hover:text-ink-100 hidden sm:inline"
          >
            Powered by BarberPro
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        {step !== "done" && (
          <Steps current={step} />
        )}

        {hasReferralDiscount && step !== "done" && (
          <div className="mb-6 rounded-xl border border-[color:var(--color-gold-500)]/40 bg-[color:var(--color-gold-500)]/10 p-4 flex items-center gap-3 animate-fade-up">
            <Gift className="h-5 w-5 text-[color:var(--color-gold-400)] shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-[color:var(--color-gold-300)]">
                Codice referral applicato: {referralCode}
              </div>
              <div className="text-xs text-ink-300">
                Riceverai uno sconto di{" "}
                <strong className="text-[color:var(--color-gold-200)]">
                  {referralCampaign?.discountKind === "fixed"
                    ? formatEuro(referralCampaign.discountValue)
                    : `${referralCampaign?.discountValue}%`}
                </strong>{" "}
                grazie a {referredByClient?.name}.
              </div>
            </div>
          </div>
        )}

        {step === "service" && (
          <div className="space-y-3 animate-fade-up">
            <h2 className="font-display text-3xl text-ink-50 mb-2">
              Scegli il servizio
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {activeServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setService(s)}
                  className={cn(
                    "text-left rounded-xl p-5 border transition-all relative",
                    service?.id === s.id
                      ? "border-[color:var(--color-gold-500)]/60 bg-[color:var(--color-gold-500)]/10"
                      : "glass hover:border-[color:var(--color-gold-500)]/30"
                  )}
                >
                  {s.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="gold" className="text-[10px]">
                        <Sparkles className="h-2.5 w-2.5" /> Top
                      </Badge>
                    </div>
                  )}
                  <div className="font-medium text-ink-50 mb-1">{s.name}</div>
                  {s.description && (
                    <p className="text-xs text-ink-400 mb-3">{s.description}</p>
                  )}
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-ink-400 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {s.durationMinutes} min
                    </span>
                    <span className="font-display text-xl text-[color:var(--color-gold-300)]">
                      {formatEuro(s.priceCents)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <Button disabled={!service} onClick={goNext} size="lg">
                Continua <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "time" && service && (
          <div className="animate-fade-up">
            <button
              onClick={goBack}
              className="text-sm text-ink-400 hover:text-ink-100 mb-4 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Cambia servizio
            </button>
            <h2 className="font-display text-3xl text-ink-50 mb-4">
              Quando ti aspettiamo?
            </h2>
            <TimePicker
              service={service}
              value={slot}
              onChange={setSlot}
              openingHours={shop.openingHours}
            />
            <div className="pt-6 flex justify-end">
              <Button disabled={!slot} onClick={goNext} size="lg">
                Continua <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "info" && service && slot && (
          <div className="animate-fade-up">
            <button
              onClick={goBack}
              className="text-sm text-ink-400 hover:text-ink-100 mb-4 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Cambia orario
            </button>
            <h2 className="font-display text-3xl text-ink-50 mb-2">I tuoi dati</h2>
            <p className="text-sm text-ink-400 mb-6">
              Riceverai una conferma via email o SMS.
            </p>

            <div className="glass rounded-xl p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-ink-50">{service.name}</div>
                  <div className="text-xs text-ink-400">
                    {new Intl.DateTimeFormat("it-IT", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(slot)}
                  </div>
                </div>
                <div className="text-right">
                  {referralDiscountCents > 0 ? (
                    <>
                      <div className="text-xs text-ink-500 line-through">
                        {formatEuro(service.priceCents)}
                      </div>
                      <div className="font-display text-xl text-[color:var(--color-gold-300)]">
                        {formatEuro(service.priceCents - referralDiscountCents)}
                      </div>
                    </>
                  ) : (
                    <div className="font-display text-xl text-[color:var(--color-gold-300)]">
                      {formatEuro(service.priceCents)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={submitBooking} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="n">Nome e cognome</Label>
                <Input
                  id="n"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Mario Rossi"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="p">Telefono</Label>
                  <Input
                    id="p"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+39 ..."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="e">Email (opzionale)</Label>
                  <Input
                    id="e"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mario@email.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="notes">Note (opzionale)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Prima volta qui? Preferenze particolari?"
                />
              </div>
              <p className="text-[11px] text-ink-500 pt-2">
                Prenotando accetti che questi dati vengano usati per gestire il
                tuo appuntamento. Nessuno spam. Puoi cancellarli in ogni momento.
              </p>
              <Button type="submit" size="lg" className="w-full">
                Prenota adesso
              </Button>
            </form>
          </div>
        )}

        {step === "done" && confirmedBooking && service && (
          <div className="text-center py-8 animate-fade-up">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-400)]">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="font-display text-4xl text-ink-50 mb-3">
              È tutto pronto!
            </h2>
            <p className="text-ink-300 max-w-md mx-auto mb-6">
              Riceverai una conferma appena il barbiere approva la prenotazione.
              Ti aspettiamo il{" "}
              <strong className="text-[color:var(--color-gold-300)]">
                {new Intl.DateTimeFormat("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(confirmedBooking.starts))}
              </strong>
              .
            </p>
            <div className="glass rounded-xl p-4 max-w-sm mx-auto text-left text-sm space-y-1 mb-6">
              <div className="flex justify-between">
                <span className="text-ink-400">Servizio</span>
                <span className="text-ink-100">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">Durata</span>
                <span className="text-ink-100">{service.durationMinutes} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">Totale</span>
                <span className="text-ink-100 font-medium">
                  {formatEuro(service.priceCents - (referralDiscountCents ?? 0))}
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setStep("service");
                setService(null);
                setSlot(null);
                setName("");
                setPhone("");
                setEmail("");
                setNotes("");
                setConfirmedBooking(null);
              }}
            >
              Fai un'altra prenotazione
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function Steps({ current }: { current: Step }) {
  const stepsList: { id: Step; label: string }[] = [
    { id: "service", label: "Servizio" },
    { id: "time", label: "Data e ora" },
    { id: "info", label: "Dati" },
  ];
  const currentIdx = stepsList.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center gap-3 mb-8">
      {stepsList.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-7 w-7 rounded-full grid place-items-center text-xs font-medium border",
                i <= currentIdx
                  ? "bg-[color:var(--color-gold-500)]/20 border-[color:var(--color-gold-500)] text-[color:var(--color-gold-300)]"
                  : "border-white/10 text-ink-500"
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "text-xs uppercase tracking-widest hidden sm:inline",
                i <= currentIdx ? "text-ink-100" : "text-ink-500"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < stepsList.length - 1 && (
            <div className="flex-1 h-px bg-white/10" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TimePicker({
  service,
  value,
  onChange,
  openingHours,
}: {
  service: Service;
  value: Date | null;
  onChange: (d: Date) => void;
  openingHours: Record<number, { open: string; close: string } | null>;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const [selectedDay, setSelectedDay] = React.useState<Date>(
    (() => {
      // Trova il primo giorno con orari aperti
      return days.find((d) => openingHours[d.getDay()]) ?? days[0];
    })()
  );

  const slots = React.useMemo(() => {
    const hours = openingHours[selectedDay.getDay()];
    if (!hours) return [];
    const [oh, om] = hours.open.split(":").map(Number);
    const [ch, cm] = hours.close.split(":").map(Number);
    const step = 30;
    const list: Date[] = [];
    const cursor = new Date(selectedDay);
    cursor.setHours(oh, om, 0, 0);
    const closeAt = new Date(selectedDay);
    closeAt.setHours(ch, cm, 0, 0);
    while (cursor.getTime() + service.durationMinutes * 60_000 <= closeAt.getTime()) {
      list.push(new Date(cursor));
      cursor.setMinutes(cursor.getMinutes() + step);
    }
    // Filtra passati per il giorno corrente
    const now = new Date();
    return list.filter((s) => s > now);
  }, [openingHours, selectedDay, service.durationMinutes]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {days.map((d) => {
          const closed = !openingHours[d.getDay()];
          const isActive = d.toDateString() === selectedDay.toDateString();
          return (
            <button
              key={d.toISOString()}
              disabled={closed}
              onClick={() => setSelectedDay(d)}
              className={cn(
                "flex-shrink-0 rounded-lg px-4 py-3 border text-center min-w-[80px] transition-all",
                closed && "opacity-40 cursor-not-allowed",
                isActive
                  ? "bg-[color:var(--color-gold-500)]/15 border-[color:var(--color-gold-500)]/50 text-[color:var(--color-gold-200)]"
                  : "border-white/10 text-ink-200 hover:border-white/20"
              )}
            >
              <div className="text-[10px] uppercase tracking-widest">
                {new Intl.DateTimeFormat("it-IT", { weekday: "short" }).format(d)}
              </div>
              <div className="font-display text-xl">{d.getDate()}</div>
              <div className="text-[10px] text-ink-400">
                {new Intl.DateTimeFormat("it-IT", { month: "short" }).format(d)}
              </div>
              {closed && (
                <div className="text-[9px] text-ink-500 mt-1">Chiuso</div>
              )}
            </button>
          );
        })}
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-8 text-sm text-ink-500 glass rounded-xl">
          Nessuno slot disponibile per questa giornata.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {slots.map((s) => {
            const isActive = value?.getTime() === s.getTime();
            return (
              <button
                key={s.toISOString()}
                onClick={() => onChange(s)}
                className={cn(
                  "rounded-md py-2.5 text-sm border font-medium tabular-nums transition-all",
                  isActive
                    ? "bg-[color:var(--color-gold-500)]/20 border-[color:var(--color-gold-500)]/50 text-[color:var(--color-gold-200)]"
                    : "border-white/10 text-ink-200 hover:border-[color:var(--color-gold-500)]/30"
                )}
              >
                {new Intl.DateTimeFormat("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(s)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
