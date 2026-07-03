"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataStore } from "@/lib/data-store";
import type { Transaction } from "@/lib/types";
import { formatEuro } from "@/lib/utils";

export function RevenuePanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    amount: "",
    paymentMethod: "cash" as Transaction["paymentMethod"],
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const shop = await dataStore.getShop();
      const t = await dataStore.getTransactions(shop.id);
      setTransactions(t);
      setLoading(false);
    }
    void load();
  }, []);

  const totalCents = transactions.reduce((s, t) => s + t.amountCents, 0);
  const byMethod = transactions.reduce(
    (acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] ?? 0) + t.amountCents;
      return acc;
    },
    {} as Record<string, number>
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const amountCents = Math.round(parseFloat(form.amount) * 100);
    if (!form.customerName.trim() || isNaN(amountCents) || amountCents <= 0) {
      setError("Compila tutti i campi obbligatori con un importo valido");
      return;
    }

    setSaving(true);
    try {
      const shop = await dataStore.getShop();
      const tx = await dataStore.createTransaction({
        shopId: shop.id,
        customerName: form.customerName.trim(),
        amountCents,
        paymentMethod: form.paymentMethod,
        description: form.description.trim() || "Servizio",
        date: form.date,
      });
      setTransactions((prev) => [tx, ...prev]);
      setForm({
        customerName: "",
        amount: "",
        paymentMethod: "cash",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setShowForm(false);
    } catch {
      setError("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  const methodLabel: Record<Transaction["paymentMethod"], string> = {
    cash: "Contanti",
    card: "Carta",
    transfer: "Bonifico",
    other: "Altro",
  };

  if (loading) {
    return <p className="text-cream/50">Caricamento incassi...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Incassi</h1>
          <p className="text-cream/50">Totale registrato: {formatEuro(totalCents)}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Registra Incasso
        </Button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {(["cash", "card", "transfer", "other"] as const).map((method) => (
          <Card key={method}>
            <CardContent className="p-4">
              <p className="text-xs text-cream/50 mb-1">{methodLabel[method]}</p>
              <p className="text-xl font-bold text-gold">{formatEuro(byMethod[method] ?? 0)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuovo Incasso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)} className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Cliente *</Label>
                <Input
                  id="customerName"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="amount">Importo (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div>
                <Label>Metodo pagamento</Label>
                <Select
                  value={form.paymentMethod}
                  onValueChange={(v) =>
                    setForm({ ...form, paymentMethod: v as Transaction["paymentMethod"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Contanti</SelectItem>
                    <SelectItem value="card">Carta</SelectItem>
                    <SelectItem value="transfer">Bonifico</SelectItem>
                    <SelectItem value="other">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="description">Descrizione</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Taglio + Barba"
                />
              </div>
              {error && <p className="sm:col-span-2 text-red-400 text-sm">{error}</p>}
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvataggio..." : "Registra"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Storico Incassi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10 text-cream/50 text-left">
                  <th className="pb-3 pr-4 font-medium">Data</th>
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Descrizione</th>
                  <th className="pb-3 pr-4 font-medium">Metodo</th>
                  <th className="pb-3 font-medium text-right">Importo</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-gold/5">
                    <td className="py-3 pr-4">{t.date}</td>
                    <td className="py-3 pr-4">{t.customerName}</td>
                    <td className="py-3 pr-4 text-cream/70">{t.description}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="secondary">{methodLabel[t.paymentMethod]}</Badge>
                    </td>
                    <td className="py-3 text-right font-medium text-gold">
                      {formatEuro(t.amountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
