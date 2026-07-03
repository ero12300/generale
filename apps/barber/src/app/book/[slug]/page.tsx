"use client";

export const dynamic = "force-dynamic";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "@/components/providers/data-provider";
import { DataProvider } from "@/components/providers/data-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useToast } from "@/components/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { addDays, addMinutes, formatDateIT, formatEUR, formatTimeIT, startOfDay } from "@/lib/utils";
import { computeSlotsForDay, getDayHours } from "@/lib/slots";
import { CalendarClock, Check, Clock, Gift, MapPin, Phone, Scissors, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center text-white/60">Caricamento…</div>}>
      <DataProvider>
        <PublicBookingWidget />
      </DataProvider>
    </Suspense>
  );
}

function PublicBookingWidget() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const store = useStore();
  const toast = useToast();
  const ref = search.get("ref") ?? undefined;

  const shopSlugMatches = store.shop.slug === params.slug;

  const activeServices = useMemo(() => store.shop.services.filter((s) => s.active), [store.shop.services]);
  const [serviceId, setServiceId] = useState<string>("");
  const [date, setDate] = useState<Date>(() => {
    const d = new Date();
    for (let i = 0; i < 14; i++) {
      const day = addDays(d, i);
      if (getDayHours(day, store.shop.hours).open) return startOfDay(day);
    }
    return startOfDay(d);
  });
  const [slot, setSlot] = useState<Date | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<null | { name: string; slot: Date; serviceName: string; priceEur: number }>(null);

  useEffect(() => {
    if (!serviceId && activeServices[0]) setServiceId(activeServices[0].id);
  }, [activeServices, serviceId]);

  const service = activeServices.find((s) => s.id === serviceId);
  const daySlots = useMemo(() => {
    if (!service) return [];
    const dayBookings = store.bookings.filter((b) => new Date(b.startAt).toDateString() === date.toDateString());
    return computeSlotsForDay(date, service, store.shop, dayBookings);
  }, [service, date, store.bookings, store.shop]);

  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i)), []);
  const referralClient = useMemo(
    () => ref ? store.clients.find((c) => c.referralCode === ref) : undefined,
    [ref, store.clients],
  );

  const submit = async () => {
    if (!service || !slot || !name || !phone) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    setSaving(true);
    try {
      await store.createBooking({
        clientName: name,
        clientPhone: phone,
        clientEmail: email || undefined,
        serviceId: service.id,
        serviceName: service.name,
        priceEur: service.priceEur,
        durationMin: service.durationMin,
        startAt: slot.toISOString(),
        endAt: addMinutes(slot, service.durationMin).toISOString(),
        note: note || (referralClient ? `Referral da ${referralClient.firstName} (${referralClient.referralCode})` : undefined),
        status: "confirmed",
        source: "public",
      });
      setOk({ name, slot, serviceName: service.name, priceEur: service.priceEur });
      toast.success("Prenotazione confermata");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl gold-border bg-[color:var(--color-ink-800)]">
              <Scissors className="h-4 w-4 text-[color:var(--color-gold-300)]" />
            </span>
            <div className="font-display text-lg text-white">Rasoio</div>
          </Link>
          <Badge tone="gold"><CalendarClock className="h-3 w-3" /> Prenotazione online</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-[color:var(--color-gold-200)]">Prenota da</div>
          <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">{store.shop.name}</h1>
          {!shopSlugMatches && (
            <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
              Slug richiesto: <code>{params.slug}</code> · slug demo attivo: <code>{store.shop.slug}</code>. In produzione i dati sarebbero letti dal server.
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-white/60">
            {store.shop.address && (
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {store.shop.address}</span>
            )}
            {store.shop.phone && (
              <a href={`tel:${store.shop.phone}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Phone className="h-3.5 w-3.5" /> {store.shop.phone}
              </a>
            )}
          </div>
        </div>

        {ok ? (
          <Card className="gold-border">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Check className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest text-emerald-300">Prenotazione confermata</div>
                <div className="mt-1 font-display text-2xl text-white">
                  {ok.serviceName} · {formatDateIT(ok.slot, { weekday: "long", day: "2-digit", month: "long" })} alle {formatTimeIT(ok.slot)}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  Grazie {ok.name.split(" ")[0]}, riceverai un promemoria. Prezzo: <span className="text-[color:var(--color-gold-200)]">{formatEUR(ok.priceEur)}</span>
                </div>
              </div>
              <Button variant="gold" onClick={() => { setOk(null); setSlot(null); }}>Nuova prenotazione</Button>
            </div>
          </Card>
        ) : (
          <>
            {referralClient && (
              <Card className="mb-6 gold-border">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)]">
                    <Gift className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-display text-lg text-white">Ti ha invitato {referralClient.firstName}!</div>
                    <div className="text-sm text-white/70">Al termine del taglio ricevete entrambi 5€ di sconto sulla prossima visita.</div>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>1. Scegli il servizio</CardTitle>
                    <CardDescription>Prezzi e durata reali dal listino.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {activeServices.map((s) => {
                      const active = serviceId === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setServiceId(s.id); setSlot(null); }}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-3 text-left transition",
                            active
                              ? "border-[color:var(--color-gold-300)]/50 bg-[color:var(--color-gold-500)]/10"
                              : "border-white/10 bg-white/[0.02] hover:bg-white/5",
                          )}
                        >
                          <div>
                            <div className="font-medium text-white">{s.name}</div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
                              <Clock className="h-3 w-3" /> {s.durationMin} min
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[color:var(--color-gold-200)]">{formatEUR(s.priceEur)}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>2. Scegli giorno e ora</CardTitle>
                    <CardDescription>Slot in tempo reale sulla base delle prenotazioni.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="marquee-mask -mx-1 overflow-x-auto">
                    <div className="flex gap-2 px-1 pb-1">
                      {days.map((d) => {
                        const opened = getDayHours(d, store.shop.hours).open;
                        const active = d.toDateString() === date.toDateString();
                        return (
                          <button
                            key={d.toISOString()}
                            disabled={!opened}
                            onClick={() => { setDate(d); setSlot(null); }}
                            className={cn(
                              "flex min-w-[64px] flex-col items-center rounded-xl border px-3 py-2 transition",
                              !opened && "opacity-30",
                              active
                                ? "border-[color:var(--color-gold-300)]/50 bg-[color:var(--color-gold-500)]/15 text-white"
                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                            )}
                          >
                            <span className="text-[10px] uppercase tracking-widest text-white/50">
                              {d.toLocaleDateString("it-IT", { weekday: "short" })}
                            </span>
                            <span className="font-display text-lg">{d.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4">
                    {daySlots.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-white/50">
                        Nessuno slot disponibile in questo giorno.
                      </div>
                    ) : (
                      <div className="grid max-h-56 grid-cols-4 gap-1.5 overflow-y-auto sm:grid-cols-6">
                        {daySlots.map((s) => {
                          const active = slot?.getTime() === s.getTime();
                          return (
                            <button
                              key={s.toISOString()}
                              type="button"
                              onClick={() => setSlot(s)}
                              className={cn(
                                "rounded-lg border px-2 py-1.5 text-xs transition",
                                active
                                  ? "border-[color:var(--color-gold-300)]/60 bg-[color:var(--color-gold-500)]/20 text-white"
                                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                              )}
                            >
                              {formatTimeIT(s)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <div>
                  <CardTitle>3. I tuoi dati</CardTitle>
                  <CardDescription>Ti servono solo per confermare la prenotazione.</CardDescription>
                </div>
                {slot && service && (
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/50">Riepilogo</div>
                    <div className="font-display text-lg text-white">{service.name} · {formatTimeIT(slot)}</div>
                    <div className="text-sm text-[color:var(--color-gold-200)]">{formatEUR(service.priceEur)}</div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Nome *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Marco Bianchi" />
                  </div>
                  <div>
                    <Label>Telefono *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 …" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Email (opzionale)</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="cliente@email.it" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Note (opzionale)</Label>
                    <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Come vuoi il taglio, sfumatura, richieste…" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-white/50">Prenotando accetti l'informativa privacy del barbershop.</div>
                  <Button variant="gold" onClick={submit} disabled={saving || !slot}>
                    {saving ? "Attendi…" : (<><Sparkles className="h-4 w-4" /> Conferma prenotazione</>)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <footer className="mt-14 border-t border-white/5 py-8 text-center text-xs text-white/40">
        Powered by <Link href="/" className="text-[color:var(--color-gold-200)] hover:underline">Rasoio</Link> · barber os
      </footer>
    </div>
  );
}
