"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SectionHeading,
  Select,
  Spinner,
} from "@/components/ui";
import { toIsoDate } from "@/lib/logic";
import { formatEuro } from "@/lib/money";
import { useStore } from "@/lib/store/provider";
import type { BookingStatus, PaymentMethod } from "@/lib/types";

export default function AgendaPage() {
  const { state, loading, completeBooking, cancelBooking } = useStore();
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [methodByBooking, setMethodByBooking] = useState<
    Record<string, PaymentMethod>
  >({});

  const bookings = useMemo(() => {
    if (!state) return [];
    return state.bookings
      .filter((b) => b.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [state, date]);

  if (loading || !state) return <Spinner label="Carico l'agenda…" />;

  function handleComplete(id: string) {
    setError(null);
    setFeedback(null);
    const method = methodByBooking[id] ?? "contanti";
    const result = completeBooking(id, method);
    if (!result.ok) setError(result.error);
    else setFeedback("Appuntamento completato: incasso registrato in cassa.");
  }

  function handleCancel(id: string) {
    setError(null);
    setFeedback(null);
    const result = cancelBooking(id);
    if (!result.ok) setError(result.error);
    else setFeedback("Prenotazione annullata.");
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Agenda"
        title="Prenotazioni"
        subtitle="Chiudi gli appuntamenti a fine servizio: l'incasso finisce automaticamente in cassa."
      />

      <div className="max-w-xs">
        <Field label="Giorno" htmlFor="agenda-date">
          <Input
            id="agenda-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
      </div>

      {feedback ? (
        <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {feedback}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <EmptyState
          title="Nessuna prenotazione in questa data"
          hint="Le prenotazioni fatte dai clienti su /prenota appaiono qui."
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-wrap items-center gap-4">
              <div className="w-14 text-center">
                <p className="font-display text-xl text-gold-300">{b.time}</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-cream">
                  {b.customerName}
                  <span className="ml-2 text-xs font-normal text-cream/40">
                    {b.customerPhone}
                  </span>
                </p>
                <p className="text-sm text-cream/60">
                  {b.serviceName} · {b.barberName} ·{" "}
                  <span className="text-gold-300">
                    {formatEuro(b.priceCents - b.discountCents)}
                  </span>
                  {b.discountCents > 0 ? (
                    <span className="text-cream/40">
                      {" "}
                      (sconto {b.campaignCode})
                    </span>
                  ) : null}
                </p>
              </div>
              <StatusBadge status={b.status} />
              {b.status === "confermata" ? (
                <div className="flex items-center gap-2">
                  <Select
                    aria-label={`Metodo di pagamento per ${b.customerName}`}
                    className="w-32"
                    value={methodByBooking[b.id] ?? "contanti"}
                    onChange={(e) =>
                      setMethodByBooking((prev) => ({
                        ...prev,
                        [b.id]: e.target.value as PaymentMethod,
                      }))
                    }
                  >
                    <option value="contanti">Contanti</option>
                    <option value="carta">Carta</option>
                    <option value="satispay">Satispay</option>
                    <option value="altro">Altro</option>
                  </Select>
                  <Button onClick={() => handleComplete(b.id)}>
                    <CheckCircle2 className="h-4 w-4" aria-hidden /> Completa
                  </Button>
                  <Button variant="danger" onClick={() => handleCancel(b.id)}>
                    <XCircle className="h-4 w-4" aria-hidden /> Annulla
                  </Button>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  switch (status) {
    case "confermata":
      return <Badge tone="gold">Confermata</Badge>;
    case "completata":
      return <Badge tone="green">Completata</Badge>;
    case "annullata":
      return <Badge tone="red">Annullata</Badge>;
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
