"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Banknote,
  CreditCard,
  Trash2,
  TrendingUp,
  Landmark,
  Wallet,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { demoStore, DEMO_ORG_ID } from "@/lib/demo-store";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency, formatDate, formatTime, generateId } from "@/lib/utils";
import type { PaymentMethod, Transaction, Service } from "@/types";

type RangeKey = "today" | "week" | "month" | "all";

function rangeFor(key: RangeKey): { start: Date; end: Date } | null {
  const now = new Date();
  if (key === "today") {
    const s = new Date(now); s.setHours(0, 0, 0, 0);
    const e = new Date(s); e.setDate(e.getDate() + 1);
    return { start: s, end: e };
  }
  if (key === "week") {
    const day = now.getDay() || 7;
    const s = new Date(now); s.setHours(0, 0, 0, 0); s.setDate(now.getDate() - (day - 1));
    const e = new Date(s); e.setDate(e.getDate() + 7);
    return { start: s, end: e };
  }
  if (key === "month") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { start: s, end: e };
  }
  return null;
}

export function TransactionsPage() {
  const { push } = useToast();
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [rangeKey, setRangeKey] = useState<RangeKey>("today");
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => { refresh(); }, []);

  function refresh() {
    setTxs(demoStore.listTransactions());
    setServices(demoStore.listServices());
  }

  const filtered = useMemo(() => {
    const range = rangeFor(rangeKey);
    if (!range) return txs;
    return txs.filter((t) => {
      const d = new Date(t.createdAt);
      return d >= range.start && d < range.end;
    });
  }, [txs, rangeKey]);

  const totals = useMemo(() => {
    let gross = 0, cash = 0, card = 0, other = 0, tip = 0, discount = 0;
    for (const t of filtered) {
      const net = t.amount + t.tipAmount - t.discountAmount;
      gross += net;
      tip += t.tipAmount;
      discount += t.discountAmount;
      if (t.method === "cash") cash += net;
      else if (t.method === "card") card += net;
      else other += net;
    }
    return { gross, cash, card, other, tip, discount, count: filtered.length };
  }, [filtered]);

  function handleDelete(id: string) {
    demoStore.deleteTransaction(id);
    push("Movimento eliminato", "info");
    refresh();
  }

  function exportCsv() {
    const header = ["Data", "Cliente", "Servizio", "Importo", "Mancia", "Sconto", "Metodo"];
    const rows = filtered.map((t) => [
      new Date(t.createdAt).toLocaleString("it-IT"),
      t.clientName ?? "",
      t.serviceName,
      t.amount.toFixed(2),
      t.tipAmount.toFixed(2),
      t.discountAmount.toFixed(2),
      t.method,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incassi-${rangeKey}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    push("Export CSV pronto", "success");
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Incassi"
        description="Registro cassa giornaliero con split contanti / POS, mance e sconti."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button onClick={() => setOpenForm(true)}>
              <Plus className="h-4 w-4" /> Nuovo incasso
            </Button>
          </div>
        }
      />

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {(["today", "week", "month", "all"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => setRangeKey(r)}
            className={cn(
              "text-xs px-3 py-2 rounded-lg border transition-colors",
              rangeKey === r
                ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                : "border-white/10 bg-white/5 text-ink-300 hover:bg-white/10"
            )}
          >
            {r === "today" ? "Oggi" : r === "week" ? "Settimana" : r === "month" ? "Mese" : "Tutti"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<TrendingUp />} label="Totale incassato" value={formatCurrency(totals.gross)} highlight />
        <StatCard icon={<Banknote />} label="Contanti" value={formatCurrency(totals.cash)} />
        <StatCard icon={<CreditCard />} label="Carta / POS" value={formatCurrency(totals.card)} />
        <StatCard icon={<Landmark />} label={`${totals.count} movimenti`} value={`Mance ${formatCurrency(totals.tip)}`} />
      </div>

      <div className="surface rounded-2xl overflow-hidden">
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/5">
          <div className="font-display text-xl text-ink-50">Movimenti</div>
          <div className="text-sm text-ink-400">
            Sconti applicati: <span className="text-ink-100">{formatCurrency(totals.discount)}</span>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <Wallet className="h-6 w-6 mx-auto text-gold-300 mb-2 opacity-60" />
            <p className="text-sm">Nessun movimento nel periodo selezionato.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[600px] overflow-auto scrollbar-thin">
            {filtered.map((t) => {
              const net = t.amount + t.tipAmount - t.discountAmount;
              return (
                <div key={t.id} className="flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors group">
                  <div className={cn(
                    "grid h-10 w-10 place-items-center rounded-lg border shrink-0",
                    t.method === "cash" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                    t.method === "card" ? "bg-blue-500/10 border-blue-500/20 text-blue-300" :
                    "bg-white/5 border-white/10 text-ink-300"
                  )}>
                    {t.method === "cash" ? <Banknote className="h-4 w-4" /> : t.method === "card" ? <CreditCard className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-ink-50 font-medium truncate">{t.clientName ?? "Cliente occasionale"}</span>
                      <span className="text-xs text-ink-400">·</span>
                      <span className="text-xs text-ink-300">{t.serviceName}</span>
                      {t.campaignCode && (
                        <Badge variant="gold" className="text-[10px]">codice {t.campaignCode}</Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5">
                      {formatDate(t.createdAt)} · {formatTime(t.createdAt)}
                      {t.tipAmount > 0 && <> · mancia {formatCurrency(t.tipAmount)}</>}
                      {t.discountAmount > 0 && <> · sconto {formatCurrency(t.discountAmount)}</>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg text-ink-50">
                      {formatCurrency(net)}
                    </div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-widest">
                      {t.method === "cash" ? "Contanti" : t.method === "card" ? "POS" : t.method}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TransactionForm open={openForm} onOpenChange={setOpenForm} services={services} onSaved={() => { setOpenForm(false); refresh(); }} />
    </div>
  );
}

function StatCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn("surface rounded-xl p-4 relative overflow-hidden", highlight && "border-gold-400/30 bg-gold-400/[0.03]")}>
      <div className="text-xs uppercase tracking-widest text-ink-400 flex items-center gap-1.5">
        <span className={highlight ? "text-gold-300" : "text-gold-400"}>{icon}</span> {label}
      </div>
      <div className={cn("font-display text-2xl mt-1", highlight ? "gradient-text" : "text-ink-50")}>{value}</div>
      {highlight && (
        <div className="absolute top-3 right-3 text-emerald-400 text-xs flex items-center gap-0.5">
          <ArrowUpRight className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}

function TransactionForm({
  open,
  onOpenChange,
  services,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  services: Service[];
  onSaved: () => void;
}) {
  const { push } = useToast();
  const [serviceId, setServiceId] = useState<string>(services[0]?.id ?? "");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState<string>("0");
  const [tip, setTip] = useState<string>("0");
  const [discount, setDiscount] = useState<string>("0");
  const [method, setMethod] = useState<PaymentMethod>("cash");

  useEffect(() => {
    if (!open) return;
    const s = services[0];
    setServiceId(s?.id ?? "");
    setAmount(s ? s.price.toString() : "0");
    setClientName("");
    setTip("0");
    setDiscount("0");
    setMethod("cash");
  }, [open, services]);

  function handleServiceChange(id: string) {
    setServiceId(id);
    const s = services.find((x) => x.id === id);
    if (s) setAmount(s.price.toString());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const svc = services.find((x) => x.id === serviceId);
    if (!svc) {
      push("Seleziona un servizio", "error");
      return;
    }
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) {
      push("L'importo deve essere positivo", "error");
      return;
    }
    demoStore.addTransaction({
      id: generateId("tx"),
      organizationId: DEMO_ORG_ID,
      serviceName: svc.name,
      clientName: clientName.trim() || undefined,
      amount: amt,
      tipAmount: parseFloat(tip) || 0,
      discountAmount: parseFloat(discount) || 0,
      method,
      createdAt: new Date().toISOString(),
    });
    push(`Incasso registrato: ${formatCurrency(amt)}`, "success");
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo incasso</DialogTitle>
          <DialogDescription>Registra un pagamento manualmente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Servizio</Label>
            <select
              value={serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3.5 text-sm text-ink-50 focus:outline-none focus:border-gold-400/60"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {formatCurrency(s.price)}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Cliente (opzionale)</Label>
            <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nome cliente" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Importo</Label>
              <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <Label>Mancia</Label>
              <Input type="number" step="0.01" min="0" value={tip} onChange={(e) => setTip(e.target.value)} />
            </div>
            <div>
              <Label>Sconto</Label>
              <Input type="number" step="0.01" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Metodo di pagamento</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["cash", "card", "transfer", "other"] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={cn(
                    "rounded-lg py-2.5 border text-sm transition-colors",
                    method === m
                      ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                      : "border-white/10 bg-white/5 text-ink-300 hover:bg-white/10"
                  )}
                >
                  {m === "cash" ? "Contanti" : m === "card" ? "POS" : m === "transfer" ? "Bonifico" : "Altro"}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit">Registra incasso</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
