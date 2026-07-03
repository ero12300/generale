"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Client, Payment, PaymentMethod, Service } from "@/lib/types";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatEUR, formatDate, formatDateTime, startOfDay, startOfMonth } from "@/lib/utils";
import { Plus, Wallet, Download, Banknote, CreditCard, Send, HelpCircle } from "lucide-react";

const methodLabel: Record<PaymentMethod, string> = {
  cash: "Contanti",
  card: "POS",
  transfer: "Bonifico",
  other: "Altro",
};
const methodIcon: Record<PaymentMethod, React.ComponentType<{ className?: string }>> = {
  cash: Banknote,
  card: CreditCard,
  transfer: Send,
  other: HelpCircle,
};

interface Props {
  initialPayments: Payment[];
  bookings: Booking[];
  clients: Client[];
  services: Service[];
}

export function PaymentsView({ initialPayments, bookings, clients, services }: Props) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const todayCents = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    return payments
      .filter((p) => new Date(p.createdAt).getTime() >= today)
      .reduce((s, p) => s + p.amountCents, 0);
  }, [payments]);
  const monthCents = useMemo(() => {
    const m = startOfMonth(new Date()).getTime();
    return payments
      .filter((p) => new Date(p.createdAt).getTime() >= m)
      .reduce((s, p) => s + p.amountCents, 0);
  }, [payments]);
  const byMethod = useMemo(() => {
    const m = startOfMonth(new Date()).getTime();
    const out: Record<PaymentMethod, number> = { cash: 0, card: 0, transfer: 0, other: 0 };
    for (const p of payments) {
      if (new Date(p.createdAt).getTime() >= m) out[p.method] += p.amountCents;
    }
    return out;
  }, [payments]);

  async function refresh() {
    const res = await fetch("/api/payments", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { payments: Payment[] };
      setPayments(data.payments);
    }
    router.refresh();
  }

  function exportCsv() {
    const rows = ["Data,Cliente,Servizio,Metodo,Importo EUR"];
    for (const p of payments) {
      const cli = clients.find((c) => c.id === p.clientId)?.name ?? "";
      const bk = bookings.find((b) => b.id === p.bookingId);
      const svc = bk ? services.find((s) => s.id === bk.serviceId)?.name ?? "" : "";
      rows.push(
        [
          formatDateTime(p.createdAt),
          cli.replace(/,/g, " "),
          svc.replace(/,/g, " "),
          methodLabel[p.method],
          (p.amountCents / 100).toFixed(2).replace(".", ","),
        ].join(","),
      );
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incassi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Oggi" value={formatEUR(todayCents / 100)} tone="gold" />
        <StatCard label="Mese corrente" value={formatEUR(monthCents / 100)} tone="emerald" />
        <StatCard label="Contanti (mese)" value={formatEUR(byMethod.cash / 100)} tone="default" />
        <StatCard label="POS (mese)" value={formatEUR(byMethod.card / 100)} tone="violet" />
      </div>

      <div className="flex items-center justify-between mt-6 mb-3">
        <div className="text-sm text-ink-400">Ultimi incassi</div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download className="w-4 h-4" />
            Esporta CSV
          </Button>
          <Button onClick={() => setOpen(true)} size="sm">
            <Plus className="w-4 h-4" />
            Registra incasso
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          {payments.length === 0 ? (
            <EmptyState
              icon={<Wallet className="w-6 h-6" />}
              title="Nessun incasso registrato"
              description="Chiudi una prenotazione come completata oppure registra un incasso manuale."
              cta={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" />Registra incasso</Button>}
            />
          ) : (
            <div className="divide-y divide-white/5">
              {payments.map((p) => {
                const Icon = methodIcon[p.method];
                const cli = clients.find((c) => c.id === p.clientId);
                const bk = bookings.find((b) => b.id === p.bookingId);
                const svc = bk ? services.find((s) => s.id === bk.serviceId) : undefined;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="w-9 h-9 rounded-lg glass grid place-items-center text-[color:var(--color-gold-400)]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink-100 truncate">
                        {cli?.name ?? "Cliente al banco"}
                        {svc ? <span className="text-ink-400"> · {svc.name}</span> : null}
                      </div>
                      <div className="text-xs text-ink-500">{formatDateTime(p.createdAt)}</div>
                    </div>
                    <Badge>{methodLabel[p.method]}</Badge>
                    <div className="text-sm font-medium">{formatEUR(p.amountCents / 100)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <NewPaymentModal
        open={open}
        onClose={() => setOpen(false)}
        clients={clients}
        bookings={bookings}
        services={services}
        onCreated={async () => {
          setOpen(false);
          await refresh();
        }}
      />
    </>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: "gold" | "emerald" | "violet" | "default" }) {
  const dot = {
    gold: "bg-[color:var(--color-gold-400)]",
    emerald: "bg-emerald-400",
    violet: "bg-violet-400",
    default: "bg-ink-400",
  }[tone];
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      </div>
      <div className="font-display text-2xl mt-2">{value}</div>
    </div>
  );
}

function NewPaymentModal({
  open,
  onClose,
  clients,
  bookings,
  services,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  bookings: Booking[];
  services: Service[];
  onCreated: () => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [clientId, setClientId] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cents = Math.round(parseFloat(amount.replace(",", ".")) * 100);
      if (!Number.isFinite(cents) || cents <= 0) throw new Error("Importo non valido");
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amountCents: cents,
          method,
          clientId: clientId || undefined,
          bookingId: bookingId || undefined,
          note: note || undefined,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      push({ kind: "success", title: "Incasso registrato" });
      await onCreated();
      setAmount("");
      setNote("");
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Registra incasso">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Importo (€)">
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25,00"
              inputMode="decimal"
              required
            />
          </Field>
          <Field label="Metodo">
            <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
              <option value="cash">Contanti</option>
              <option value="card">POS</option>
              <option value="transfer">Bonifico</option>
              <option value="other">Altro</option>
            </Select>
          </Field>
        </div>
        <Field label="Cliente (opzionale)">
          <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">— Cliente al banco —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Collega a prenotazione (opzionale)">
          <Select value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
            <option value="">— Nessuna —</option>
            {bookings.map((b) => {
              const cli = clients.find((c) => c.id === b.clientId);
              const svc = services.find((s) => s.id === b.serviceId);
              return (
                <option key={b.id} value={b.id}>
                  {formatDate(b.startAt)} · {cli?.name ?? "—"} · {svc?.name ?? "—"}
                </option>
              );
            })}
          </Select>
        </Field>
        <Field label="Nota">
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Facoltativa" />
        </Field>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
          <Button type="submit" loading={loading}>Registra</Button>
        </div>
      </form>
    </Modal>
  );
}
