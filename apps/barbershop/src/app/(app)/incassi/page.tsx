"use client";

import { useMemo, useState } from "react";
import { Plus, Banknote, CreditCard, Wallet, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { formatCents, eurosToCents } from "@/lib/money";
import {
  revenueToday,
  revenueInLastDays,
  revenueByMethod,
  averageTicket,
} from "@/lib/analytics";
import { methodLabel } from "@/components/shared/status";
import type { PaymentMethod } from "@/lib/types";

export default function IncassiPage() {
  const { data, addPayment } = useStore();
  const payments = useMemo(
    () => [...data.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [data.payments]
  );

  const today = revenueToday(data.payments);
  const last7 = revenueInLastDays(data.payments, 7);
  const last30 = revenueInLastDays(data.payments, 30);
  const avg = averageTicket(data.payments);
  const byMethod = revenueByMethod(data.payments);

  return (
    <div>
      <PageHeader
        title="Gestione Incassi"
        subtitle="Registro dei pagamenti e andamento del fatturato."
        action={<AddPaymentDialog onAdd={addPayment} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Oggi" value={formatCents(today)} icon={Wallet} />
        <StatCard label="Ultimi 7 giorni" value={formatCents(last7)} icon={TrendingUp} />
        <StatCard label="Ultimi 30 giorni" value={formatCents(last30)} icon={TrendingUp} />
        <StatCard label="Scontrino medio" value={formatCents(avg)} icon={CreditCard} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ripartizione per metodo (totale)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["cash", "card", "transfer", "other"] as PaymentMethod[]).map((m) => (
              <div key={m} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-zinc-400">
                  {m === "cash" ? <Banknote className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                  {methodLabel(m)}
                </span>
                <span className="font-semibold">{formatCents(byMethod[m] ?? 0)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Movimenti recenti</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-auto p-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-900/90 text-left text-xs uppercase text-zinc-500 backdrop-blur">
                <tr>
                  <th className="px-4 py-2 font-medium">Data</th>
                  <th className="px-4 py-2 font-medium">Descrizione</th>
                  <th className="px-4 py-2 font-medium">Metodo</th>
                  <th className="px-4 py-2 text-right font-medium">Importo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/40">
                    <td className="whitespace-nowrap px-4 py-2.5 text-zinc-400">
                      {new Date(p.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2.5">{p.description}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={p.method === "cash" ? "neutral" : "info"}>
                        {methodLabel(p.method)}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-emerald-300">
                      {formatCents(p.amountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AddPaymentDialog({ onAdd }: { onAdd: ReturnType<typeof useStore>["addPayment"] }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cents = eurosToCents(amount);
    if (cents <= 0) {
      setError("Inserisci un importo valido.");
      return;
    }
    onAdd({
      amountCents: cents,
      method,
      description: description.trim() || "Incasso cassa",
    });
    setAmount("");
    setDescription("");
    setMethod("cash");
    setError("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Registra incasso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registra un incasso</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pay-amount">Importo (€)</Label>
            <Input
              id="pay-amount"
              inputMode="decimal"
              placeholder="20,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pay-method">Metodo</Label>
            <Select
              id="pay-method"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              <option value="cash">Contanti</option>
              <option value="card">Carta</option>
              <option value="transfer">Bonifico</option>
              <option value="other">Altro</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pay-desc">Descrizione</Label>
            <Input
              id="pay-desc"
              placeholder="Es. Taglio + Barba"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </DialogClose>
            <Button type="submit">Salva incasso</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
