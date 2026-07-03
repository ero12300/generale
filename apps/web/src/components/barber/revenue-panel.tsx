"use client";

import { useEffect, useMemo, useState } from "react";
import type { BarberPayment } from "@deal-desk/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface PaymentFormState {
  amount: string;
  method: "cash" | "card" | "online" | "bank_transfer";
  status: "pending" | "paid" | "refunded";
}

const initialForm: PaymentFormState = {
  amount: "",
  method: "card",
  status: "paid",
};

export function RevenuePanel() {
  const [payments, setPayments] = useState<BarberPayment[]>([]);
  const [form, setForm] = useState<PaymentFormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPayments() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/barber/payments");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore caricamento incassi");
      setPayments(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Errore caricamento incassi");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPayments();
  }, []);

  const metrics = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === "paid");
    const totalRevenue = paid.reduce((sum, payment) => sum + payment.amount, 0);
    const averageTicket = paid.length > 0 ? totalRevenue / paid.length : 0;
    const methods = {
      card: 0,
      cash: 0,
      online: 0,
      bank_transfer: 0,
    };
    for (const payment of paid) {
      methods[payment.method] += payment.amount;
    }
    return { totalRevenue, averageTicket, methods };
  }, [payments]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/barber/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(form.amount),
          method: form.method,
          status: form.status,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Errore registrazione incasso");
      setPayments((current) => [data, ...current]);
      setForm(initialForm);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Errore registrazione incasso");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard label="Incasso totale" value={formatCurrency(metrics.totalRevenue)} />
        <MetricCard label="Ticket medio" value={formatCurrency(metrics.averageTicket)} />
        <MetricCard
          label="Canale dominante"
          value={
            Object.entries(metrics.methods).sort((a, b) => b[1] - a[1])[0]?.[0].replaceAll("_", " ") ??
            "—"
          }
        />
      </div>

      <div className="grid xl:grid-cols-[1.1fr,1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registra incasso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Importo"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                required
              />
              <select
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                value={form.method}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    method: event.target.value as PaymentFormState["method"],
                  }))
                }
              >
                <option value="card">Carta</option>
                <option value="cash">Contanti</option>
                <option value="online">Online</option>
                <option value="bank_transfer">Bonifico</option>
              </select>
              <select
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as PaymentFormState["status"],
                  }))
                }
              >
                <option value="paid">Pagato</option>
                <option value="pending">In attesa</option>
                <option value="refunded">Rimborsato</option>
              </select>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? "Salvataggio..." : "Registra incasso"}
              </Button>
              {error && <p className="text-xs text-rose-400">{error}</p>}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Flusso cassa</CardTitle>
            <Button variant="outline" size="sm" onClick={() => void loadPayments()} disabled={isLoading}>
              Aggiorna
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading && <p className="text-sm text-zinc-500">Caricamento incassi...</p>}
            {!isLoading &&
              payments.map((payment) => (
                <div key={payment.id} className="rounded-lg border border-zinc-800 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                    <Badge variant="secondary" className="capitalize">
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {payment.method.replaceAll("_", " ")} · {new Date(payment.paid_at).toLocaleString("it-IT")}
                  </p>
                </div>
              ))}
            {!isLoading && payments.length === 0 && (
              <p className="text-sm text-zinc-500">Nessun incasso registrato.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase text-zinc-500 tracking-wide">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
