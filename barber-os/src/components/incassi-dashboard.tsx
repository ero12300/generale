"use client";

import { useEffect, useMemo, useState } from "react";
import { getStore, generateId } from "@/lib/store";
import type { PaymentMethod, Transaction } from "@/lib/types";
import { formatEuro, todayISO, transactionSchema } from "@/lib/types";

type Status = "loading" | "ready" | "error";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  contanti: "Contanti",
  carta: "Carta",
  altro: "Altro",
};

function sumCents(txs: Transaction[]): number {
  return txs.reduce((acc, t) => acc + t.amountCents, 0);
}

export function IncassiDashboard() {
  const [status, setStatus] = useState<Status>("loading");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("contanti");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getStore()
      .listTransactions()
      .then((txs) => {
        setTransactions(txs);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare gli incassi.");
        setStatus("error");
      });
  }, []);

  const stats = useMemo(() => {
    const today = todayISO();
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const monthStart = `${today.slice(0, 7)}-01`;

    const todayTxs = transactions.filter((t) => t.date === today);
    const weekTxs = transactions.filter(
      (t) => new Date(t.date + "T00:00:00") >= weekAgo
    );
    const monthTxs = transactions.filter((t) => t.date >= monthStart);
    return {
      today: sumCents(todayTxs),
      week: sumCents(weekTxs),
      month: sumCents(monthTxs),
      count: transactions.length,
    };
  }, [transactions]);

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions]
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const amountCents = Math.round(Number(amount.replace(",", ".")) * 100);
    if (!Number.isFinite(amountCents) || amountCents === 0) {
      setErrorMsg("Inserisci un importo valido (es. 25 o 25,50).");
      return;
    }
    const tx: Transaction = {
      id: generateId(),
      date: todayISO(),
      amountCents,
      method,
      description: description.trim() || "Incasso",
      bookingId: null,
    };
    const parsed = transactionSchema.safeParse(tx);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Dati non validi.");
      return;
    }
    setSaving(true);
    try {
      await getStore().saveTransaction(parsed.data);
      setTransactions((prev) => [...prev, parsed.data]);
      setAmount("");
      setDescription("");
    } catch {
      setErrorMsg("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await getStore().deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setErrorMsg("Errore durante l'eliminazione.");
    }
  }

  if (status === "loading") {
    return <div className="card animate-pulse text-cream-dim">Caricamento incassi…</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Registro incassi</h1>
        <p className="mt-1 text-cream-dim">
          Il polso del tuo salone, aggiornato a ogni taglio.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Oggi", value: stats.today },
          { label: "Ultimi 7 giorni", value: stats.week },
          { label: "Questo mese", value: stats.month },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-xs font-semibold uppercase tracking-widest text-cream-dim">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-gold">{formatEuro(stat.value)}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="card space-y-4" aria-label="Registra nuovo incasso">
        <h2 className="font-display text-xl font-semibold">Registra un incasso</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="importo" className="label">Importo (€)</label>
            <input
              id="importo"
              className="input"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25,00"
              required
            />
          </div>
          <div>
            <label htmlFor="metodo" className="label">Metodo</label>
            <select
              id="metodo"
              className="input"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              {Object.entries(METHOD_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="descrizione" className="label">Descrizione</label>
            <input
              id="descrizione"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Taglio — Mario Rossi"
            />
          </div>
        </div>
        {errorMsg && (
          <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMsg}
          </p>
        )}
        <button type="submit" className="btn-gold" disabled={saving}>
          {saving ? "Salvataggio…" : "Aggiungi incasso"}
        </button>
      </form>

      <section aria-label="Storico incassi">
        <h2 className="font-display mb-4 text-xl font-semibold">
          Movimenti ({stats.count})
        </h2>
        {sorted.length === 0 ? (
          <div className="card text-center text-cream-dim">
            Nessun incasso registrato. Aggiungi il primo qui sopra.
          </div>
        ) : (
          <div className="card overflow-x-auto !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-cream-dim">
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Descrizione</th>
                  <th className="px-4 py-3">Metodo</th>
                  <th className="px-4 py-3 text-right">Importo</th>
                  <th className="px-4 py-3" aria-label="Azioni" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 text-cream-dim">
                      {new Date(tx.date + "T00:00:00").toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-4 py-3">{tx.description}</td>
                    <td className="px-4 py-3 text-cream-dim">{METHOD_LABELS[tx.method]}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gold">
                      {formatEuro(tx.amountCents)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(tx.id)}
                        className="text-xs text-cream-dim transition hover:text-red-400"
                        aria-label={`Elimina incasso ${tx.description}`}
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
