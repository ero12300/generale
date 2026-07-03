"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleAlert, Loader2, Plus, Search, UserRound, X } from "lucide-react";
import type { Client } from "@/lib/types";

type EnrichedClient = Client & { visits: number; referred: number };

export function ClientsView() {
  const [clients, setClients] = useState<EnrichedClient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/clients")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setClients(data.clients))
      .catch(() => setError("Impossibile caricare i clienti."));
  }, []);

  useEffect(load, [load]);

  const filtered = useMemo(() => {
    if (!clients) return [];
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
        c.referralCode.toLowerCase().includes(q),
    );
  }, [clients, query]);

  async function addClient(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Errore nel salvataggio.");
        return;
      }
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setShowForm(false);
      load();
    } catch {
      setFormError("Connessione non riuscita.");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-danger/40 bg-surface p-5 text-danger">
        <CircleAlert className="h-5 w-5" aria-hidden /> {error}
      </p>
    );
  }

  if (!clients) {
    return (
      <p className="flex items-center gap-2 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Caricamento
        clienti…
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 md:max-w-sm">
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome, telefono o codice…"
            aria-label="Cerca cliente"
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-11 pr-4 text-sm placeholder:text-muted/60"
          />
        </label>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft"
        >
          {showForm ? <X className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
          {showForm ? "Chiudi" : "Nuovo cliente"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addClient}
          className="rounded-2xl border border-gold-dim/50 bg-surface p-5"
          aria-label="Aggiungi nuovo cliente"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome e cognome *"
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
            />
            <input
              required
              minLength={6}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefono *"
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Note (preferenze, allergie…)"
              className="rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm placeholder:text-muted/60"
            />
          </div>
          {formError && (
            <p className="mt-3 flex items-center gap-2 text-sm text-danger" role="alert">
              <CircleAlert className="h-4 w-4" aria-hidden /> {formError}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Salva cliente
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3.5 font-semibold">Cliente</th>
              <th className="px-5 py-3.5 font-semibold">Telefono</th>
              <th className="px-5 py-3.5 text-center font-semibold">Visite</th>
              <th className="px-5 py-3.5 text-center font-semibold">Amici portati</th>
              <th className="px-5 py-3.5 font-semibold">Codice referral</th>
              <th className="px-5 py-3.5 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2">
                      <UserRound className="h-4 w-4 text-gold" aria-hidden />
                    </span>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      {c.referredBy && (
                        <p className="text-xs text-success">
                          Portato da {c.referredBy}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 tabular-nums text-muted">{c.phone}</td>
                <td className="px-5 py-3.5 text-center font-semibold">{c.visits}</td>
                <td className="px-5 py-3.5 text-center">
                  {c.referred > 0 ? (
                    <span className="rounded-full border border-gold-dim/50 px-2.5 py-0.5 text-xs font-bold text-gold-soft">
                      {c.referred}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <code className="rounded-md bg-surface-2 px-2 py-1 text-xs tracking-widest text-gold-soft">
                    {c.referralCode}
                  </code>
                </td>
                <td className="max-w-40 truncate px-5 py-3.5 text-muted">
                  {c.notes ?? "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">
                  Nessun cliente trovato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
