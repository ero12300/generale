"use client";

import { useEffect, useMemo, useState } from "react";
import { getStore, generateId, generateReferralCode } from "@/lib/store";
import { planAllowsNewCustomer, PLANS } from "@/lib/plans";
import type { Customer, ShopSettings } from "@/lib/types";
import { customerSchema } from "@/lib/types";

type Status = "loading" | "ready" | "error";

export function CustomersManager() {
  const [status, setStatus] = useState<Status>("loading");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const store = getStore();
    Promise.all([store.listCustomers(), store.getSettings()])
      .then(([cust, sett]) => {
        setCustomers(cust);
        setSettings(sett);
        setStatus("ready");
      })
      .catch(() => {
        setErrorMsg("Impossibile caricare i clienti.");
        setStatus("error");
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? customers.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.referralCode.toLowerCase().includes(q)
        )
      : customers;
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, search]);

  const planLimitReached =
    settings !== null &&
    !planAllowsNewCustomer(settings.plan, customers.length);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (planLimitReached && settings) {
      setErrorMsg(
        `Hai raggiunto il limite di ${PLANS[settings.plan].maxCustomers} clienti del piano ${PLANS[settings.plan].name}. Passa a Pro per clienti illimitati.`
      );
      return;
    }
    const customer: Customer = {
      id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      referralCode: generateReferralCode(name),
      referredBy: null,
    };
    const parsed = customerSchema.safeParse(customer);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Dati non validi.");
      return;
    }
    setSaving(true);
    try {
      await getStore().saveCustomer(parsed.data);
      setCustomers((prev) => [...prev, parsed.data]);
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setShowForm(false);
    } catch {
      setErrorMsg("Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await getStore().deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setErrorMsg("Errore durante l'eliminazione.");
    }
  }

  if (status === "loading") {
    return <div className="card animate-pulse text-cream-dim">Caricamento clienti…</div>;
  }
  if (status === "error" && customers.length === 0) {
    return <div className="card border-red-500/40 text-red-300">{errorMsg}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Database clienti</h1>
          <p className="mt-1 text-cream-dim">
            {customers.length} clienti in rubrica. Ogni cliente ha un codice
            &quot;porta un amico&quot; personale.
          </p>
        </div>
        <button
          type="button"
          className="btn-gold"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Chiudi" : "+ Nuovo cliente"}
        </button>
      </div>

      {planLimitReached && settings && (
        <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
          Limite del piano {PLANS[settings.plan].name} raggiunto (
          {PLANS[settings.plan].maxCustomers} clienti). Passa a Pro dalla sezione
          Abbonamento per continuare a crescere.
        </p>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card space-y-4" aria-label="Nuovo cliente">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-nome" className="label">Nome e cognome</label>
              <input id="c-nome" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="c-telefono" className="label">Telefono</label>
              <input id="c-telefono" type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="c-email" className="label">Email (facoltativa)</label>
              <input id="c-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="c-note" className="label">Note</label>
              <input id="c-note" className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, allergie…" />
            </div>
          </div>
          {errorMsg && (
            <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMsg}
            </p>
          )}
          <button type="submit" className="btn-gold" disabled={saving}>
            {saving ? "Salvataggio…" : "Salva cliente"}
          </button>
        </form>
      )}

      <div>
        <label htmlFor="ricerca" className="sr-only">Cerca cliente</label>
        <input
          id="ricerca"
          className="input max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca per nome, telefono o codice amico…"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-cream-dim">Nessun cliente trovato.</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((customer) => (
            <li key={customer.id} className="card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{customer.name}</p>
                  <p className="text-sm text-cream-dim">{customer.phone}</p>
                  {customer.email && (
                    <p className="truncate text-sm text-cream-dim">{customer.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(customer.id)}
                  className="text-xs text-cream-dim transition hover:text-red-400"
                  aria-label={`Elimina cliente ${customer.name}`}
                >
                  Elimina
                </button>
              </div>
              {customer.notes && (
                <p className="mt-2 text-sm italic text-cream-dim">“{customer.notes}”</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono font-semibold text-gold">
                  {customer.referralCode}
                </span>
                <span className="text-cream-dim">codice porta un amico</span>
                {customer.referredBy && (
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-300">
                    Invitato con {customer.referredBy}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
