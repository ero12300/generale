"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Copy, Gift, Lock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import { formatCents, formatDate, initials } from "@/lib/format";
import type { Client } from "@/lib/types";

export default function ClientsPage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  const stats = useMemo(() => {
    const map = new Map<string, { visits: number; spent: number }>();
    for (const p of ws.payments) {
      if (!p.clientId) continue;
      const e = map.get(p.clientId) ?? { visits: 0, spent: 0 };
      e.visits += 1;
      e.spent += Math.max(0, p.amountCents - p.discountCents);
      map.set(p.clientId, e);
    }
    return map;
  }, [ws.payments]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ws.clients;
    return ws.clients.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.phone ?? ""} ${c.email ?? ""}`.toLowerCase().includes(q),
    );
  }, [ws.clients, query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return toast("Nome e cognome obbligatori", "error");
    const res = ws.addClient({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    if (!res.ok) return toast(res.error ?? "Errore", "error");
    toast("Cliente aggiunto", "success");
    setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setNotes("");
    setOpen(false);
  };

  const copyReferral = (code: string) => {
    navigator.clipboard?.writeText(code).then(
      () => toast(`Codice ${code} copiato`, "success"),
      () => toast("Impossibile copiare", "error"),
    );
  };

  return (
    <div>
      <PageHeader
        title="Clienti"
        subtitle={`${ws.clients.length} clienti nel tuo database`}
        action={
          <button
            className="btn-gold"
            onClick={() => (ws.canAddClient ? setOpen(true) : toast(`Limite piano ${ws.plan.name} raggiunto. Passa a Pro.`, "error"))}
          >
            {ws.canAddClient ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Nuovo cliente
          </button>
        }
      />

      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field pl-9"
          placeholder="Cerca per nome, telefono o email"
          aria-label="Cerca cliente"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const s = stats.get(c.id);
          return (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="card p-4 text-left transition hover:border-gold/30"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-gradient font-semibold text-ink">
                  {initials(c.firstName, c.lastName)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-cream">{c.firstName} {c.lastName}</p>
                  <p className="truncate text-xs text-cream/50">{c.phone ?? c.email ?? "—"}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-cream/50">
                <span>{s?.visits ?? 0} visite</span>
                <span className="text-gold-soft">{formatCents(s?.spent ?? 0)}</span>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-cream/40">Nessun cliente trovato.</p>
        ) : null}
      </div>

      {/* Modal nuovo cliente */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuovo cliente"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annulla</button>
            <button className="btn-gold" form="client-form" type="submit">Salva</button>
          </>
        }
      >
        <form id="client-form" onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="c-first">Nome</label>
              <input id="c-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="c-last">Cognome</label>
              <input id="c-last" value={lastName} onChange={(e) => setLastName(e.target.value)} className="field" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="c-phone">Telefono</label>
            <input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" placeholder="+39 ..." />
          </div>
          <div>
            <label className="label" htmlFor="c-email">Email</label>
            <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="c-notes">Note</label>
            <input id="c-notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="field" placeholder="Preferenze, allergie..." />
          </div>
        </form>
      </Modal>

      {/* Modal dettaglio cliente */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.firstName} ${selected.lastName}` : ""}
        footer={
          selected ? (
            <button
              className="btn-ghost text-red-300 hover:border-red-500/40"
              onClick={() => {
                ws.removeClient(selected.id);
                toast("Cliente eliminato", "info");
                setSelected(null);
              }}
            >
              <Trash2 className="h-4 w-4" /> Elimina
            </button>
          ) : null
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-cream/40">Telefono</p>
                <p className="text-cream">{selected.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream/40">Email</p>
                <p className="truncate text-cream">{selected.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream/40">Cliente dal</p>
                <p className="text-cream">{formatDate(selected.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-cream/40">Speso totale</p>
                <p className="text-gold-soft">{formatCents(stats.get(selected.id)?.spent ?? 0)}</p>
              </div>
            </div>

            {selected.notes ? (
              <div className="rounded-xl border border-ink-line bg-ink-soft p-3 text-sm text-cream/70">
                {selected.notes}
              </div>
            ) : null}

            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-soft">
                <Gift className="h-3.5 w-3.5" /> Codice porta un amico
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-display text-2xl text-cream">{selected.referralCode}</span>
                <button className="btn-ghost py-1.5" onClick={() => copyReferral(selected.referralCode)}>
                  <Copy className="h-3.5 w-3.5" /> Copia
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-cream/40">Ultimi appuntamenti</p>
              <ul className="space-y-2">
                {ws.bookings
                  .filter((b) => b.clientId === selected.id)
                  .slice(0, 5)
                  .map((b) => (
                    <li key={b.id} className="flex justify-between rounded-lg border border-ink-line bg-ink-soft/50 px-3 py-2 text-sm">
                      <span className="text-cream/80">{b.serviceName}</span>
                      <span className="text-cream/40">{formatDate(b.start)}</span>
                    </li>
                  ))}
                {ws.bookings.filter((b) => b.clientId === selected.id).length === 0 ? (
                  <li className="text-sm text-cream/40">Nessun appuntamento registrato.</li>
                ) : null}
              </ul>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
