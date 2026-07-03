"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Clock, Scissors, Sparkles, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { barberShop, formatCents, services, staff } from "@/lib/barber-data";
import { cn } from "@/lib/utils";

const slots = ["09:30", "10:15", "12:00", "15:30", "16:45", "18:00"];

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState(services[2].id);
  const [selectedStaff, setSelectedStaff] = useState(staff[0].id);
  const [selectedSlot, setSelectedSlot] = useState(slots[3]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const service = useMemo(
    () => services.find((item) => item.id === selectedService) ?? services[0],
    [selectedService]
  );
  const barber = useMemo(
    () => staff.find((item) => item.id === selectedStaff) ?? staff[0],
    [selectedStaff]
  );

  function confirmBooking() {
    setStatus("loading");
    window.setTimeout(() => setStatus("success"), 650);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.22),_transparent_32%),#09090b] px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
              <Scissors className="h-5 w-5 text-amber-300" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-amber-200">ROYAL FADE</p>
              <p className="text-xs text-zinc-500">Prenotazione premium</p>
            </div>
          </Link>
          <Button asChild variant="outline">
            <Link href="/dashboard">Area salone</Link>
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div>
              <Badge>
                <Sparkles className="mr-1 h-3 w-3" aria-hidden />
                {barberShop.name} · {barberShop.rating}/5
              </Badge>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Scegli il servizio, il barber e conferma in meno di un minuto.
              </h1>
              <p className="mt-4 max-w-2xl text-zinc-400">
                Demo del servizio di prenotazione integrato: ideale per sito, Instagram bio,
                Google Business Profile e QR code in salone.
              </p>
            </div>

            <BookingSection icon={Scissors} title="1. Servizio">
              <div className="grid gap-3 md:grid-cols-2">
                {services.map((item) => (
                  <ChoiceButton
                    key={item.id}
                    active={item.id === selectedService}
                    onClick={() => setSelectedService(item.id)}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-zinc-500">
                      {item.durationMinutes} min · {formatCents(item.priceCents)}
                    </span>
                  </ChoiceButton>
                ))}
              </div>
            </BookingSection>

            <BookingSection icon={UserRound} title="2. Barber">
              <div className="grid gap-3 md:grid-cols-3">
                {staff.map((member) => (
                  <ChoiceButton
                    key={member.id}
                    active={member.id === selectedStaff}
                    onClick={() => setSelectedStaff(member.id)}
                  >
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-zinc-500">
                      {member.role} · prossimo {member.nextSlot}
                    </span>
                  </ChoiceButton>
                ))}
              </div>
            </BookingSection>

            <BookingSection icon={Clock} title="3. Orario">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
                      slot === selectedSlot
                        ? "border-amber-400 bg-amber-500/15 text-amber-100"
                        : "border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </BookingSection>
          </div>

          <Card className="h-fit border-amber-500/30 bg-zinc-950/80">
            <CardHeader>
              <CardTitle>Riepilogo prenotazione</CardTitle>
              <p className="text-sm text-zinc-400">Stato: {status === "success" ? "confermata" : "pronta"}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <SummaryRow label="Servizio" value={service.name} />
              <SummaryRow label="Barber" value={barber.name} />
              <SummaryRow label="Orario" value={`Oggi alle ${selectedSlot}`} />
              <SummaryRow label="Durata" value={`${service.durationMinutes} minuti`} />
              <SummaryRow label="Prezzo" value={formatCents(service.priceCents)} strong />

              {status === "success" ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                  <div className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Prenotazione confermata
                  </div>
                  <p className="mt-2 text-emerald-100/80">
                    Il cliente riceverebbe conferma, reminder e codice referral automatico.
                  </p>
                </div>
              ) : (
                <Button onClick={confirmBooking} disabled={status === "loading"} className="w-full" size="lg">
                  {status === "loading" ? "Conferma in corso..." : "Conferma prenotazione"}
                  <CalendarCheck className="h-4 w-4" aria-hidden />
                </Button>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function BookingSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-amber-300" aria-hidden />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ChoiceButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-24 flex-col items-start justify-between rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
        active
          ? "border-amber-400 bg-amber-500/15 text-amber-100"
          : "border-zinc-800 bg-zinc-950/70 text-zinc-200 hover:border-zinc-600"
      )}
    >
      {children}
    </button>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className={strong ? "text-lg font-semibold text-amber-200" : "font-medium text-zinc-100"}>
        {value}
      </span>
    </div>
  );
}
