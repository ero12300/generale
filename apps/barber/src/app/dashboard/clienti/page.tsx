"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Phone, Mail, Star, Gift, Trash2, Crown } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useStore } from "@/lib/store/store-context";
import { eur } from "@/lib/money";
import { TIER_LABEL, TIER_TONE } from "@/lib/labels";
import { isLimitReached } from "@/lib/plan-access";
import { PLANS } from "@/lib/plans";
import type { Client } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ClientiPage() {
  const { state, addClient, deleteClient } = useStore();
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [detail, setDetail] = useState<Client | null>(null);

  const clients = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...state.clients].sort((a, b) => b.totalSpentCents - a.totalSpentCents);
    if (!q) return list;
    return list.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email ?? "").toLowerCase().includes(q),
    );
  }, [state.clients, query]);

  const plan = state.subscription.plan;
  const limitReached = isLimitReached(plan, "maxClients", state.clients.length);

  return (
    <div className="p-5 md:p-8">
      <PageHeader
        title="Clienti"
        subtitle="Il tuo database clienti: storico, spesa e fidelizzazione."
        actions={
          <Button size="sm" onClick={() => setShowNew(true)} disabled={limitReached}>
            <Plus size={16} /> Nuovo cliente
          </Button>
        }
      />

      {limitReached && (
        <Card className="mb-5 flex items-center justify-between border-[var(--gold-deep)]/40 bg-[var(--gold)]/8">
          <p className="text-sm text-muted">
            Hai raggiunto il limite di {PLANS[plan].limits.maxClients} clienti del piano Start.
          </p>
          <Link href="/dashboard/abbonamento"><Button size="sm" variant="outline"><Crown size={14} /> Passa a Pro</Button></Link>
        </Card>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatMini label="Clienti totali" value={String(state.clients.length)} />
        <StatMini label="Clienti VIP" value={String(state.clients.filter((c) => c.tier === "vip").length)} />
        <StatMini label="Punti fedeltà erogati" value={String(state.clients.reduce((s, c) => s + c.loyaltyPoints, 0))} />
      </div>

      <div className="relative mb-4">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca per nome, telefono o email…" className="pl-10" />
      </div>

      {clients.length === 0 ? (
        <Card className="py-16 text-center text-muted">Nessun cliente trovato.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <button key={c.id} onClick={() => setDetail(c)} className="text-left">
              <Card className="card-hover h-full">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 font-semibold text-[var(--gold-soft)]">
                      {c.firstName[0]}{c.lastName[0] ?? ""}
                    </span>
                    <div>
                      <div className="font-medium">{c.firstName} {c.lastName}</div>
                      <div className="text-xs text-muted">{c.phone}</div>
                    </div>
                  </div>
                  <Badge tone={TIER_TONE[c.tier]}>{c.tier === "vip" && <Star size={10} />}{TIER_LABEL[c.tier]}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <MiniStat label="Speso" value={eur(c.totalSpentCents)} />
                  <MiniStat label="Visite" value={String(c.visits)} />
                  <MiniStat label="Punti" value={String(c.loyaltyPoints)} />
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}

      {showNew && <NewClientModal onClose={() => setShowNew(false)} onAdd={addClient} />}
      {detail && (
        <ClientDetailModal
          client={detail}
          bookingsCount={state.bookings.filter((b) => b.clientId === detail.id).length}
          onClose={() => setDetail(null)}
          onDelete={() => { deleteClient(detail.id); setDetail(null); }}
        />
      )}
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 p-2">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[10px] text-muted">{label}</div>
    </div>
  );
}

function NewClientModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: ReturnType<typeof useStore>["addClient"];
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(true);

  function submit() {
    if (!firstName || !phone) return;
    onAdd({
      firstName,
      lastName,
      phone,
      email: email || undefined,
      notes: notes || undefined,
      tier: "nuovo",
      marketingConsent: consent,
    });
    onClose();
  }

  return (
    <Modal open onClose={onClose} title="Nuovo cliente">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome"><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Mario" /></Field>
          <Field label="Cognome"><Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Rossi" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Telefono"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 1234567" /></Field>
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@email.it" /></Field>
        </div>
        <Field label="Note"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, allergie, prodotti usati…" /></Field>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="accent-[var(--gold)]" />
          Consenso a comunicazioni marketing (campagne e promozioni)
        </label>
        <Button className="w-full" size="lg" disabled={!firstName || !phone} onClick={submit}>
          <Plus size={18} /> Aggiungi cliente
        </Button>
      </div>
    </Modal>
  );
}

function ClientDetailModal({
  client,
  bookingsCount,
  onClose,
  onDelete,
}: {
  client: Client;
  bookingsCount: number;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Modal open onClose={onClose} title={`${client.firstName} ${client.lastName}`}>
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold)]/15 text-lg font-semibold text-[var(--gold-soft)]">
          {client.firstName[0]}{client.lastName[0] ?? ""}
        </span>
        <div>
          <Badge tone={TIER_TONE[client.tier]}>{client.tier === "vip" && <Star size={10} />}{TIER_LABEL[client.tier]}</Badge>
          <p className="mt-1 text-xs text-muted">Cliente dal {formatDate(client.createdAt)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <MiniStat label="Speso totale" value={eur(client.totalSpentCents)} />
        <MiniStat label="Visite" value={String(client.visits)} />
        <MiniStat label="Punti fedeltà" value={String(client.loyaltyPoints)} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2"><Phone size={15} className="text-muted" /> {client.phone}</div>
        {client.email && <div className="flex items-center gap-2"><Mail size={15} className="text-muted" /> {client.email}</div>}
        <div className="flex items-center gap-2"><Gift size={15} className="text-muted" /> Codice invito: <span className="font-mono font-semibold text-[var(--gold-soft)]">{client.referralCode}</span></div>
        <div className="text-muted">Appuntamenti registrati: {bookingsCount}</div>
        {client.notes && <p className="rounded-lg bg-surface-2 p-3 text-muted">{client.notes}</p>}
      </div>

      <div className="mt-5 flex justify-between">
        <Button variant="danger" size="sm" onClick={onDelete}><Trash2 size={15} /> Elimina</Button>
        <Button variant="subtle" size="sm" onClick={onClose}>Chiudi</Button>
      </div>
    </Modal>
  );
}
