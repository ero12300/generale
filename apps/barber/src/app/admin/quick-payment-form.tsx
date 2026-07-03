"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Plus, X } from "lucide-react";
import type { PaymentMethod } from "@/lib/types";

/** Form rapido per registrare un incasso manuale (walk-in senza prenotazione). */
export function QuickPaymentForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("contanti");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Converte "25,50" o "25.50" in centesimi interi senza usare float
    const normalized = amount.replace(",", ".").trim();
    const match = normalized.match(/^(\d+)(?:\.(\d{1,2}))?$/);
    if (!match) {
      setError("Importo non valido (es. 25 o 25,50)");
      return;
    }
    const amountCents =
      parseInt(match[1], 10) * 100 + parseInt((match[2] ?? "0").padEnd(2, "0"), 10);

    setSaving(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, serviceName, amountCents, method }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Errore nel salvataggio");
        return;
      }
      setOpen(false);
      setClientName("");
      setServiceName("");
      setAmount("");
      router.refresh();
    } catch {
      setError("Connessione non riuscita");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft"
      >
        <Plus className="h-4 w-4" aria-hidden /> Registra incasso
      </button>
    );
  }

  return (
    <form
      onSubmit={save}
      className="w-full rounded-2xl border border-gold-dim/50 bg-surface p-5 md:max-w-2xl"
      aria-label="Registra un nuovo incasso"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">Nuovo incasso</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Chiudi"
          className="text-muted transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Cliente"
          className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
        />
        <input
          required
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Servizio (es. Taglio Classico)"
          className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
        />
        <input
          required
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Importo € (es. 25,00)"
          className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm"
          aria-label="Metodo di pagamento"
        >
          <option value="contanti">Contanti</option>
          <option value="carta">Carta</option>
          <option value="satispay">Satispay</option>
        </select>
      </div>
      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-danger" role="alert">
          <CircleAlert className="h-4 w-4" aria-hidden /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="mt-4 flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        Salva incasso
      </button>
    </form>
  );
}
