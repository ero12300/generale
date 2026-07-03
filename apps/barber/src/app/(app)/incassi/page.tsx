"use client";

import { useEffect, useState } from "react";
import { Banknote, CreditCard, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart } from "@/components/ui/bar-chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiGet, apiSend } from "@/lib/client-api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Client, PaymentMethod, RevenueEntry, RevenueSummary, Service } from "@/lib/types";

interface RevenuePayload {
  entries: RevenueEntry[];
  summary: RevenueSummary;
}

const methodMeta: Record<PaymentMethod, { label: string; variant: "success" | "info" | "secondary" }> = {
  contanti: { label: "Contanti", variant: "success" },
  carta: { label: "Carta", variant: "info" },
  altro: { label: "Altro", variant: "secondary" },
};

export default function IncassiPage() {
  const [payload, setPayload] = useState<RevenuePayload | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    const [rev, cat, cl] = await Promise.all([
      apiGet<RevenuePayload>("/api/revenue"),
      apiGet<{ services: Service[] }>("/api/catalog"),
      apiGet<Client[]>("/api/clients"),
    ]);
    setPayload(rev);
    setServices(cat.services);
    setClients(cl);
  }

  useEffect(() => {
    reload()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const summary = payload?.summary;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Incassi</h1>
          <p className="mt-1 text-zinc-400">Registro incassi e report del salone.</p>
        </div>
        <NewRevenueDialog services={services} clients={clients} onCreated={reload} />
      </div>

      {error && (
        <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <span className="text-sm text-zinc-400">Oggi</span>
            <p className="mt-2 font-display text-2xl font-bold">{formatCurrency(summary?.today ?? 0)}</p>
            <p className="mt-1 text-xs text-zinc-500">{summary?.todayCount ?? 0} servizi</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <span className="text-sm text-zinc-400">Ultimi 7 giorni</span>
            <p className="mt-2 font-display text-2xl font-bold">{formatCurrency(summary?.week ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <span className="text-sm text-zinc-400">Mese</span>
            <p className="mt-2 font-display text-2xl font-bold">{formatCurrency(summary?.month ?? 0)}</p>
            <p className="mt-1 text-xs text-zinc-500">
              ticket medio {formatCurrency(summary?.averageTicket ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Andamento ultimi 7 giorni</CardTitle>
        </CardHeader>
        <CardContent>{summary && <BarChart data={summary.last7Days} />}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movimenti recenti</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-40 animate-pulse rounded-xl bg-zinc-800/60" />
          ) : (
            <div className="divide-y divide-zinc-800">
              {payload?.entries.slice(0, 40).map((e) => (
                <div key={e.id} className="flex items-center gap-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9a24b]/10 text-gold-soft">
                    {e.method === "contanti" ? (
                      <Banknote className="h-4 w-4" />
                    ) : e.method === "carta" ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <Wallet className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{e.serviceName ?? "Incasso"}</p>
                    <p className="text-xs text-zinc-500">{formatDateTime(e.date)}</p>
                  </div>
                  <Badge variant={methodMeta[e.method].variant}>{methodMeta[e.method].label}</Badge>
                  <span className="w-24 text-right font-semibold">{formatCurrency(e.amount)}</span>
                </div>
              ))}
              {payload?.entries.length === 0 && (
                <p className="py-6 text-center text-zinc-500">Nessun incasso registrato.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NewRevenueDialog({
  services,
  clients,
  onCreated,
}: {
  services: Service[];
  clients: Client[];
  onCreated: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("contanti");
  const [serviceName, setServiceName] = useState("");
  const [clientId, setClientId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickService(name: string) {
    setServiceName(name);
    const svc = services.find((s) => s.name === name);
    if (svc && !amount) setAmount(String(svc.price));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiSend("/api/revenue", "POST", {
        amount: Number(amount),
        method,
        serviceName: serviceName || undefined,
        clientId: clientId || undefined,
      });
      await onCreated();
      setAmount("");
      setServiceName("");
      setClientId("");
      setError(null);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
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
          <DialogTitle>Registra incasso</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="r-service">Servizio</Label>
            <Select id="r-service" value={serviceName} onChange={(e) => pickService(e.target.value)}>
              <option value="">Generico</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>{s.name} — {s.price}€</option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="r-amount">Importo (€)</Label>
              <Input
                id="r-amount"
                type="number"
                step="0.5"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-method">Metodo</Label>
              <Select id="r-method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                <option value="contanti">Contanti</option>
                <option value="carta">Carta</option>
                <option value="altro">Altro</option>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="r-client">Cliente (opzionale)</Label>
            <Select id="r-client" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Nessuno</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
          {error && (
            <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Salvataggio…" : "Registra"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
