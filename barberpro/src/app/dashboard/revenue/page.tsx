"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Wallet, Receipt, TrendingUp, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import {
  revenueToday,
  revenueThisMonth,
  revenueLastMonth,
  dailyRevenue,
  revenueByService,
  averageTicket,
  percentChange,
} from "@/lib/analytics";
import { formatCents, formatDate, parseEuroToCents } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Contanti",
  card: "Carta",
  transfer: "Bonifico",
  other: "Altro",
};

export default function RevenuePage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const analytics = ws.hasFeature("analytics");

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [discount, setDiscount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [clientId, setClientId] = useState("");

  const today = revenueToday(ws.payments);
  const thisMonth = revenueThisMonth(ws.payments);
  const lastMonth = revenueLastMonth(ws.payments);
  const avg = averageTicket(ws.payments);
  const daily = useMemo(() => dailyRevenue(ws.payments, 30), [ws.payments]);
  const byService = useMemo(() => revenueByService(ws.payments), [ws.payments]);
  const maxService = byService[0]?.net ?? 1;

  const recent = useMemo(
    () => [...ws.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 40),
    [ws.payments],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = parseEuroToCents(amount);
    if (amountCents <= 0) return toast("Inserisci un importo valido", "error");
    if (!description.trim()) return toast("Inserisci una descrizione", "error");
    const client = ws.clients.find((c) => c.id === clientId);
    ws.addPayment({
      description: description.trim(),
      amountCents,
      discountCents: parseEuroToCents(discount),
      method,
      clientId: client?.id,
      clientName: client ? `${client.firstName} ${client.lastName}` : undefined,
      date: new Date().toISOString(),
    });
    toast("Incasso registrato", "success");
    setDescription(""); setAmount(""); setDiscount(""); setMethod("cash"); setClientId("");
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Incassi"
        subtitle="Il gestionale economico del salone"
        action={
          <button className="btn-gold" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Registra incasso
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Oggi" value={formatCents(today)} icon={Wallet} />
        <StatCard label="Questo mese" value={formatCents(thisMonth)} icon={Receipt} change={percentChange(thisMonth, lastMonth)} />
        <StatCard label="Mese scorso" value={formatCents(lastMonth)} icon={TrendingUp} />
        <StatCard label="Ticket medio" value={formatCents(avg)} icon={BarChart3} hint={`${ws.payments.length} incassi totali`} />
      </div>

      {analytics ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="mb-4 font-display text-xl text-cream">Andamento (30 giorni)</h2>
            <RevenueChart data={daily} />
          </div>
          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl text-cream">Per servizio</h2>
            <ul className="space-y-3">
              {byService.map((s) => (
                <li key={s.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-cream/80">{s.name}</span>
                    <span className="text-gold-soft">{formatCents(s.net)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-line">
                    <div className="h-full bg-gold-gradient" style={{ width: `${Math.max(6, (s.net / maxService) * 100)}%` }} />
                  </div>
                </li>
              ))}
              {byService.length === 0 ? <li className="text-sm text-cream/40">Nessun dato.</li> : null}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <UpgradeBanner message="Sblocca grafici avanzati e analisi per servizio con il piano Pro." />
        </div>
      )}

      <div className="mt-6 card overflow-hidden">
        <div className="border-b border-ink-line px-5 py-4">
          <h2 className="font-display text-lg text-cream">Registro incassi</h2>
        </div>
        <div className="divide-y divide-ink-line">
          {recent.map((p) => {
            const net = Math.max(0, p.amountCents - p.discountCents);
            return (
              <div key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{p.description}</p>
                  <p className="text-xs text-cream/45">
                    {formatDate(p.date)} · {METHOD_LABELS[p.method]}
                    {p.clientName ? ` · ${p.clientName}` : ""}
                    {p.discountCents > 0 ? ` · sconto ${formatCents(p.discountCents)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gold-soft">{formatCents(net)}</span>
                  <button
                    onClick={() => { ws.removePayment(p.id); toast("Incasso eliminato", "info"); }}
                    className="rounded-lg p-1.5 text-cream/30 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Elimina incasso"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {recent.length === 0 ? <p className="px-5 py-8 text-center text-sm text-cream/40">Nessun incasso registrato.</p> : null}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Registra incasso"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annulla</button>
            <button className="btn-gold" form="payment-form" type="submit">Salva</button>
          </>
        }
      >
        <form id="payment-form" onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="p-desc">Descrizione</label>
            <input id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="field" placeholder="Es. Taglio + Barba" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="p-amount">Importo (€)</label>
              <input id="p-amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="field" placeholder="30,00" inputMode="decimal" />
            </div>
            <div>
              <label className="label" htmlFor="p-disc">Sconto (€)</label>
              <input id="p-disc" value={discount} onChange={(e) => setDiscount(e.target.value)} className="field" placeholder="0,00" inputMode="decimal" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="p-method">Metodo</label>
              <select id="p-method" value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} className="field">
                {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map((m) => (
                  <option key={m} value={m}>{METHOD_LABELS[m]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="p-client">Cliente</label>
              <select id="p-client" value={clientId} onChange={(e) => setClientId(e.target.value)} className="field">
                <option value="">— Nessuno —</option>
                {ws.clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
