"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Check,
  X,
  Wallet,
  Trash2,
  Clock,
  CalendarDays,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/field";
import { useStore } from "@/lib/store/store-context";
import { eur } from "@/lib/money";
import { generateSlots } from "@/lib/slots";
import { STATUS_LABEL, STATUS_TONE, PAYMENT_LABEL } from "@/lib/labels";
import type { Booking, BookingStatus, PaymentMethod } from "@/lib/types";
import { formatTime, formatDate, isSameDay, toISODate, addDays, cn } from "@/lib/utils";

type Filter = "oggi" | "domani" | "richieste" | "tutte";

export default function PrenotazioniPage() {
  const { state, createBooking, updateBookingStatus, cashBooking, deleteBooking } = useStore();
  const [filter, setFilter] = useState<Filter>("oggi");
  const [showNew, setShowNew] = useState(false);
  const [cashing, setCashing] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    const list = [...state.bookings].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    );
    if (filter === "oggi") return list.filter((b) => isSameDay(b.start, new Date()));
    if (filter === "domani") return list.filter((b) => isSameDay(b.start, addDays(new Date(), 1)));
    if (filter === "richieste") return list.filter((b) => b.status === "richiesta");
    return list;
  }, [state.bookings, filter]);

  const filters: { id: Filter; label: string; count?: number }[] = [
    { id: "oggi", label: "Oggi" },
    { id: "domani", label: "Domani" },
    { id: "richieste", label: "Richieste", count: state.bookings.filter((b) => b.status === "richiesta").length },
    { id: "tutte", label: "Tutte" },
  ];

  return (
    <div className="p-5 md:p-8">
      <PageHeader
        title="Prenotazioni"
        subtitle="Gestisci l'agenda, conferma le richieste e registra gli incassi."
        actions={<Button size="sm" onClick={() => setShowNew(true)}><Plus size={16} /> Nuovo appuntamento</Button>}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition",
              filter === f.id
                ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-soft)]"
                : "border-border bg-surface text-muted hover:text-foreground",
            )}
          >
            {f.label}
            {f.count ? <span className="rounded-full bg-[var(--gold)]/20 px-1.5 text-xs text-[var(--gold-soft)]">{f.count}</span> : null}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="py-16 text-center">
          <CalendarDays size={32} className="mx-auto text-muted" />
          <p className="mt-3 text-muted">Nessuna prenotazione in questa vista.</p>
          <Button className="mt-4" size="sm" onClick={() => setShowNew(true)}><Plus size={16} /> Aggiungi appuntamento</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <BookingRow
              key={b.id}
              booking={b}
              onStatus={updateBookingStatus}
              onCash={() => setCashing(b)}
              onDelete={() => deleteBooking(b.id)}
            />
          ))}
        </div>
      )}

      {showNew && <NewBookingModal onClose={() => setShowNew(false)} onCreate={createBooking} />}
      {cashing && (
        <CashModal
          booking={cashing}
          onClose={() => setCashing(null)}
          onConfirm={(method) => {
            cashBooking(cashing.id, method);
            setCashing(null);
          }}
        />
      )}
    </div>
  );
}

function BookingRow({
  booking,
  onStatus,
  onCash,
  onDelete,
}: {
  booking: Booking;
  onStatus: (id: string, s: BookingStatus) => void;
  onCash: () => void;
  onDelete: () => void;
}) {
  const net = booking.priceCents - booking.discountCents;
  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3 sm:w-48">
        <div className="flex flex-col items-center rounded-xl border border-border bg-surface-2 px-3 py-2 text-center">
          <span className="text-sm font-semibold tabular-nums text-[var(--gold-soft)]">{formatTime(booking.start)}</span>
          <span className="text-[10px] text-muted">{formatDate(booking.start)}</span>
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium">{booking.clientName}</div>
          <div className="truncate text-xs text-muted">{booking.clientPhone}</div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm">{booking.serviceName}</span>
          <span className="text-xs text-muted">· {booking.barberName}</span>
          {booking.source === "online" && <Badge tone="blue">Online</Badge>}
          {booking.discountCents > 0 && <Badge tone="gold">-{eur(booking.discountCents)}</Badge>}
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted">
          <Clock size={12} /> {booking.durationMin} min · {eur(net)}
          {booking.status === "completata" && <span>· {PAYMENT_LABEL[booking.paymentMethod]}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge tone={STATUS_TONE[booking.status]}>{STATUS_LABEL[booking.status]}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {booking.status === "richiesta" && (
          <>
            <Button size="sm" onClick={() => onStatus(booking.id, "confermata")}><Check size={15} /> Conferma</Button>
            <Button size="sm" variant="danger" onClick={() => onStatus(booking.id, "annullata")}><X size={15} /></Button>
          </>
        )}
        {(booking.status === "confermata" || booking.status === "richiesta") && (
          <Button size="sm" variant="outline" onClick={onCash}><Wallet size={15} /> Incassa</Button>
        )}
        {booking.status === "confermata" && (
          <Button size="sm" variant="ghost" onClick={() => onStatus(booking.id, "no_show")}>No show</Button>
        )}
        <button onClick={onDelete} aria-label="Elimina" className="rounded-lg p-2 text-muted hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]">
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}

function CashModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (m: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("contanti");
  const net = booking.priceCents - booking.discountCents;
  const methods: { id: PaymentMethod; label: string }[] = [
    { id: "contanti", label: "Contanti" },
    { id: "carta", label: "Carta" },
    { id: "app", label: "App / Online" },
  ];
  return (
    <Modal open onClose={onClose} title="Registra incasso">
      <p className="text-sm text-muted">
        {booking.clientName} · {booking.serviceName}
      </p>
      <div className="my-4 rounded-xl border border-border bg-surface-2 p-4 text-center">
        <div className="text-sm text-muted">Totale da incassare</div>
        <div className="mt-1 text-3xl font-bold text-[var(--gold-soft)]">{eur(net)}</div>
      </div>
      <p className="mb-2 text-sm font-medium">Metodo di pagamento</p>
      <div className="grid grid-cols-3 gap-2">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "rounded-xl border py-3 text-sm font-medium transition",
              method === m.id ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-soft)]" : "border-border bg-surface",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      <Button className="mt-5 w-full" size="lg" onClick={() => onConfirm(method)}>
        <Check size={18} /> Conferma incasso
      </Button>
    </Modal>
  );
}

function NewBookingModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: ReturnType<typeof useStore>["createBooking"];
}) {
  const { state } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState(state.services[0]?.id ?? "");
  const [barberId, setBarberId] = useState(state.barbers[0]?.id ?? "");
  const [dateISO, setDateISO] = useState(toISODate(new Date()));
  const [slotISO, setSlotISO] = useState("");

  const service = state.services.find((s) => s.id === serviceId);
  const slots = useMemo(() => {
    if (!service) return [];
    return generateSlots(state.settings, state.bookings, barberId, dateISO, service.durationMin);
  }, [service, barberId, dateISO, state.settings, state.bookings]);

  function submit() {
    if (!name || !phone || !slotISO) return;
    const b = onCreate({
      clientName: name,
      clientPhone: phone,
      serviceId,
      barberId,
      start: slotISO,
      source: "interno",
    });
    if (b) onClose();
  }

  return (
    <Modal open onClose={onClose} title="Nuovo appuntamento">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome cliente"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mario Rossi" /></Field>
          <Field label="Telefono"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 1234567" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Servizio">
            <Select value={serviceId} onChange={(e) => { setServiceId(e.target.value); setSlotISO(""); }}>
              {state.services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {eur(s.priceCents)}</option>
              ))}
            </Select>
          </Field>
          <Field label="Barbiere">
            <Select value={barberId} onChange={(e) => { setBarberId(e.target.value); setSlotISO(""); }}>
              {state.barbers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Data">
          <Select value={dateISO} onChange={(e) => { setDateISO(e.target.value); setSlotISO(""); }}>
            {Array.from({ length: 14 }, (_, i) => addDays(new Date(), i)).map((d) => {
              const iso = toISODate(d);
              return <option key={iso} value={iso}>{formatDate(d.toISOString())}</option>;
            })}
          </Select>
        </Field>
        <div>
          <p className="mb-2 text-sm font-medium">Orario</p>
          <div className="grid max-h-40 grid-cols-4 gap-2 overflow-y-auto scrollbar-thin sm:grid-cols-5">
            {slots.length === 0 && <p className="col-span-full text-sm text-muted">Nessuno slot disponibile.</p>}
            {slots.map((s) => (
              <button
                key={s.iso}
                disabled={!s.available}
                onClick={() => setSlotISO(s.iso)}
                className={cn(
                  "rounded-lg border py-2 text-sm tabular-nums transition",
                  !s.available && "opacity-30 line-through",
                  slotISO === s.iso ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold-soft)]" : "border-border bg-surface",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <Button className="w-full" size="lg" disabled={!name || !phone || !slotISO} onClick={submit}>
          <Plus size={18} /> Crea appuntamento
        </Button>
      </div>
    </Modal>
  );
}
