"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Client } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatEUR, initials, formatDate } from "@/lib/utils";
import { Crown, Plus, Search, Users, Sparkles, Phone, Mail, Copy } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function ClientsView({ initial }: { initial: Client[] }) {
  const [clients, setClients] = useState<Client[]>(initial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Client | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.referralCode.toLowerCase().includes(q),
    );
  }, [clients, query]);

  async function refresh() {
    const res = await fetch("/api/clients", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { clients: Client[] };
      setClients(data.clients);
    }
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <Input
            className="pl-9"
            placeholder="Cerca per nome, telefono, email o codice referral…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cerca clienti"
          />
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Nuovo cliente
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="Nessun cliente"
            description={query ? "Prova a modificare la ricerca." : "Aggiungi il primo cliente per iniziare."}
            cta={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4" />Nuovo cliente</Button>}
          />
        </Card>
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-white/5">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="w-full text-left flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e5cd8b] to-[#a8853a] text-ink-950 grid place-items-center text-xs font-semibold">
                    {initials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-ink-100 truncate">{c.name}</div>
                      {c.vip ? <Badge tone="gold"><Crown className="w-3 h-3" />VIP</Badge> : null}
                      {c.tags?.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-ink-400 truncate">
                      {c.phone ?? "—"} {c.email ? ` · ${c.email}` : ""}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium">{formatEUR(c.totalSpentCents / 100)}</div>
                    <div className="text-xs text-ink-500">{c.visits} visite</div>
                  </div>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <NewClientModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={async () => {
          setOpen(false);
          await refresh();
        }}
      />

      <ClientDetail
        client={selected}
        onClose={() => setSelected(null)}
        onChanged={async () => {
          await refresh();
          setSelected(null);
        }}
      />
    </>
  );
}

function NewClientModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [referrerCode, setReferrerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, email, notes, referrerCode }),
      });
      if (!res.ok) throw new Error(await res.text());
      push({ kind: "success", title: "Cliente creato" });
      await onCreated();
      setName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setReferrerCode("");
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuovo cliente">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nome completo">
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Mario Rossi" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Telefono">
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 333 123 4567" />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mario@example.com" />
          </Field>
        </div>
        <Field label="Note">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, allergie, appunti…" />
        </Field>
        <Field label="Codice referral (opzionale)" hint="Se un cliente esistente ha invitato questa persona, incolla il suo codice.">
          <Input value={referrerCode} onChange={(e) => setReferrerCode(e.target.value.toUpperCase())} placeholder="ANDRE12AB" />
        </Field>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
          <Button type="submit" loading={loading}>Crea cliente</Button>
        </div>
      </form>
    </Modal>
  );
}

function ClientDetail({
  client,
  onClose,
  onChanged,
}: {
  client: Client | null;
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [notes, setNotes] = useState(client?.notes ?? "");
  const [vip, setVip] = useState(client?.vip ?? false);
  const [copied, setCopied] = useState(false);
  const { push } = useToast();

  if (!client) return null;

  async function save() {
    if (!client) return;
    const res = await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ notes, vip }),
    });
    if (res.ok) {
      push({ kind: "success", title: "Cliente aggiornato" });
      await onChanged();
    }
  }

  function copyLink() {
    const url = `${window.location.origin}/book/salone-demo?ref=${client!.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Modal open={Boolean(client)} onClose={onClose} title={client.name} size="lg">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <div className="glass rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-ink-400">Contatti</div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-ink-500" /> {client.phone ?? "—"}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-ink-500" /> {client.email ?? "—"}
              </div>
              <div className="text-xs text-ink-500 pt-1">
                Cliente dal {formatDate(client.createdAt)}
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-ink-400">Codice referral</div>
              <Badge tone="gold"><Sparkles className="w-3 h-3" />Porta un amico</Badge>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="glass rounded-md px-2 py-1.5 font-mono text-sm text-[color:var(--color-gold-300)]">
                {client.referralCode}
              </div>
              <button
                onClick={copyLink}
                className="text-xs inline-flex items-center gap-1 px-2 py-1.5 rounded-md border border-white/10 hover:bg-white/5"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copiato!" : "Copia link"}
              </button>
            </div>
            <div className="text-xs text-ink-500 mt-2">Condividilo con lui/lei via WhatsApp.</div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-ink-400">Storico</div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <Stat label="Speso" value={formatEUR(client.totalSpentCents / 100)} />
              <Stat label="Visite" value={String(client.visits)} />
              <Stat label="Punti" value={String(client.loyaltyPoints)} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="glass rounded-xl p-4 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={vip}
              onChange={(e) => setVip(e.target.checked)}
              className="w-4 h-4 rounded accent-[color:var(--color-gold-500)]"
            />
            <div>
              <div className="text-sm font-medium text-ink-100 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[color:var(--color-gold-400)]" /> Cliente VIP
              </div>
              <div className="text-xs text-ink-400">Priorità nelle prenotazioni e promozioni dedicate.</div>
            </div>
          </label>

          <Field label="Note del barbiere">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Preferenze, allergie, servizi ricorrenti…"
            />
          </Field>

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>Chiudi</Button>
            <Button onClick={save}>Salva modifiche</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[11px] uppercase tracking-wider text-ink-500">{label}</div>
      <div className="text-sm font-medium mt-1">{value}</div>
    </div>
  );
}
