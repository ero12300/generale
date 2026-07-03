"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/app/topbar";
import { useOpenNav } from "@/app/app/nav-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/app/stat-card";
import { useStore } from "@/components/providers/data-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { addDays, endOfDay, formatDateIT, formatEUR, formatTimeIT, isSameDay, startOfDay, startOfWeek } from "@/lib/utils";
import { Banknote, CreditCard, Download, Landmark, MoreHorizontal, Plus, Receipt, Wallet } from "lucide-react";
import type { PaymentMethod } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { hasFeature } from "@/lib/plans";
import Link from "next/link";

const METHODS: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  cash: { label: "Contanti", icon: <Banknote className="h-3 w-3" /> },
  card: { label: "Carta", icon: <CreditCard className="h-3 w-3" /> },
  transfer: { label: "Bonifico", icon: <Landmark className="h-3 w-3" /> },
  other: { label: "Altro", icon: <MoreHorizontal className="h-3 w-3" /> },
};

type RangeKey = "today" | "week" | "month" | "all";

export default function IncassiPage() {
  const store = useStore();
  const openNav = useOpenNav();
  const toast = useToast();
  const { user } = useAuth();
  const canReports = hasFeature(user?.plan, "revenue.reports");
  const [range, setRange] = useState<RangeKey>("today");
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState<{
    amountEur: string;
    tipEur: string;
    method: PaymentMethod;
    serviceName: string;
    clientId?: string;
    note: string;
  }>({ amountEur: "22", tipEur: "0", method: "cash", serviceName: "Taglio uomo", note: "" });

  const filtered = useMemo(() => {
    const now = new Date();
    const min: Date | null = (() => {
      switch (range) {
        case "today": return startOfDay(now);
        case "week": return startOfWeek(now);
        case "month": return new Date(now.getFullYear(), now.getMonth(), 1);
        default: return null;
      }
    })();
    return store.revenues
      .filter((r) => !min || new Date(r.createdAt) >= min)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [store.revenues, range]);

  const totals = useMemo(() => {
    const net = filtered.reduce((s, r) => s + r.amountEur + r.tipEur - r.discountAmountEur, 0);
    const tips = filtered.reduce((s, r) => s + r.tipEur, 0);
    const count = filtered.length;
    const avg = count > 0 ? net / count : 0;
    const byMethod: Record<PaymentMethod, number> = { cash: 0, card: 0, transfer: 0, other: 0 };
    for (const r of filtered) byMethod[r.method] += r.amountEur + r.tipEur - r.discountAmountEur;
    return { net, tips, count, avg, byMethod };
  }, [filtered]);

  const submit = async () => {
    const amount = Number(form.amountEur.replace(",", "."));
    const tip = Number(form.tipEur.replace(",", ".")) || 0;
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Importo non valido");
      return;
    }
    await store.createRevenue({
      amountEur: amount,
      tipEur: tip,
      method: form.method,
      serviceName: form.serviceName || undefined,
      clientId: form.clientId,
      clientName: form.clientId ? store.clients.find((c) => c.id === form.clientId)?.firstName : undefined,
      discountAmountEur: 0,
      note: form.note || undefined,
    });
    toast.success("Incasso registrato", formatEUR(amount + tip));
    setDialog(false);
  };

  const exportCsv = () => {
    const rows = [
      ["Data", "Ora", "Cliente", "Servizio", "Importo", "Mancia", "Sconto", "Netto", "Metodo", "Note"].join(","),
      ...filtered.map((r) => {
        const d = new Date(r.createdAt);
        return [
          formatDateIT(d),
          formatTimeIT(d),
          r.clientName ?? "",
          r.serviceName ?? "",
          r.amountEur.toFixed(2),
          r.tipEur.toFixed(2),
          r.discountAmountEur.toFixed(2),
          (r.amountEur + r.tipEur - r.discountAmountEur).toFixed(2),
          METHODS[r.method].label,
          r.note ?? "",
        ].map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",");
      }),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incassi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV scaricato");
  };

  const RANGES: { id: RangeKey; label: string }[] = [
    { id: "today", label: "Oggi" },
    { id: "week", label: "Settimana" },
    { id: "month", label: "Mese" },
    { id: "all", label: "Tutto" },
  ];

  return (
    <>
      <Topbar
        title="Incassi"
        subtitle="Registro cassa, mance, metodo di pagamento."
        onOpenNav={openNav}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv} disabled={!canReports} title={!canReports ? "Disponibile dal piano Base" : ""}>
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="gold" onClick={() => setDialog(true)}>
              <Plus className="h-4 w-4" /> Nuovo incasso
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              range === r.id
                ? "border-[color:var(--color-gold-300)]/50 bg-[color:var(--color-gold-500)]/15 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Netto periodo" value={formatEUR(totals.net)} icon={<Wallet className="h-4 w-4" />} accent="gold" hint={`${totals.count} operazioni`} />
        <StatCard label="Mance" value={formatEUR(totals.tips)} icon={<Receipt className="h-4 w-4" />} accent="emerald" />
        <StatCard label="Scontrino medio" value={formatEUR(totals.avg)} icon={<Receipt className="h-4 w-4" />} />
        <StatCard label="Cassa contanti" value={formatEUR(totals.byMethod.cash)} icon={<Banknote className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Per metodo pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(Object.keys(METHODS) as PaymentMethod[]).map((m) => {
                const value = totals.byMethod[m];
                const max = Math.max(1, ...Object.values(totals.byMethod));
                const pct = Math.round((value / max) * 100);
                return (
                  <li key={m}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-white/80">{METHODS[m].icon} {METHODS[m].label}</div>
                      <div className="text-white/60">{formatEUR(value)}</div>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-gold-300)] to-[color:var(--color-gold-500)]" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Movimenti</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <EmptyState
                icon={<Wallet className="h-6 w-6" />}
                title="Nessun incasso in questo periodo"
                description="Completa una prenotazione o registra un incasso manuale."
                action={<Button variant="gold" onClick={() => setDialog(true)}><Plus className="h-4 w-4" /> Registra incasso</Button>}
              />
            ) : (
              <div className="max-h-[520px] overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-[color:var(--color-ink-800)]/95 backdrop-blur text-left text-xs uppercase tracking-widest text-white/40">
                    <tr>
                      <th className="py-2 pr-4">Data</th>
                      <th className="py-2 pr-4">Cliente</th>
                      <th className="py-2 pr-4">Servizio</th>
                      <th className="py-2 pr-4">Metodo</th>
                      <th className="py-2 pr-4 text-right">Importo</th>
                      <th className="py-2 pr-4 text-right">Mancia</th>
                      <th className="py-2 text-right">Netto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 pr-4 text-white/70">
                          <div>{formatDateIT(r.createdAt, { day: "2-digit", month: "short" })}</div>
                          <div className="text-xs text-white/40">{formatTimeIT(r.createdAt)}</div>
                        </td>
                        <td className="py-2 pr-4">{r.clientName ?? "—"}</td>
                        <td className="py-2 pr-4">{r.serviceName ?? "—"}</td>
                        <td className="py-2 pr-4">
                          <Badge tone="muted">
                            {METHODS[r.method].icon}
                            {METHODS[r.method].label}
                          </Badge>
                        </td>
                        <td className="py-2 pr-4 text-right">{formatEUR(r.amountEur)}</td>
                        <td className="py-2 pr-4 text-right text-white/60">{r.tipEur > 0 ? formatEUR(r.tipEur) : "—"}</td>
                        <td className="py-2 text-right text-[color:var(--color-gold-200)]">
                          {formatEUR(r.amountEur + r.tipEur - r.discountAmountEur)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!canReports && (
        <p className="mt-3 text-xs text-white/40">
          Export CSV disponibile dal piano Base. <Link className="text-[color:var(--color-gold-200)] underline underline-offset-4" href="/app/abbonamento">Aggiorna piano</Link>
        </p>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registra incasso</DialogTitle>
            <DialogDescription>Aggiungi un incasso manuale (walk-in o extra).</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Importo €</Label>
                <Input value={form.amountEur} onChange={(e) => setForm((f) => ({ ...f, amountEur: e.target.value }))} inputMode="decimal" />
              </div>
              <div>
                <Label>Mancia €</Label>
                <Input value={form.tipEur} onChange={(e) => setForm((f) => ({ ...f, tipEur: e.target.value }))} inputMode="decimal" />
              </div>
            </div>
            <div>
              <Label>Metodo</Label>
              <Select value={form.method} onValueChange={(v) => setForm((f) => ({ ...f, method: v as PaymentMethod }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(METHODS) as PaymentMethod[]).map((m) => (
                    <SelectItem key={m} value={m}>{METHODS[m].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Servizio</Label>
              <Select value={form.serviceName} onValueChange={(v) => setForm((f) => ({ ...f, serviceName: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {store.shop.services.filter((s) => s.active).map((s) => (
                    <SelectItem key={s.id} value={s.name}>{s.name} · €{s.priceEur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cliente (opzionale)</Label>
              <Select value={form.clientId ?? "__none"} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v === "__none" ? undefined : v }))}>
                <SelectTrigger><SelectValue placeholder="Nessuno" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Nessuno / walk-in</SelectItem>
                  {store.clients.slice(0, 30).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName ?? ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)}>Annulla</Button>
            <Button variant="gold" onClick={submit}>Registra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

void addDays;
void endOfDay;
void isSameDay;
