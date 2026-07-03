"use client";

import * as React from "react";
import { Search, Plus, Copy, Phone, Mail, Trash2, Gift } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { demoStore } from "@/lib/demo-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatEuro, formatDateIt, initials } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import type { Client } from "@/types";

export default function ClientsPage() {
  const { clients, bookings, shop } = useShopData();
  const [query, setQuery] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detail, setDetail] = React.useState<Client | null>(null);

  const filtered = clients
    .filter((c) =>
      query
        ? [c.name, c.phone ?? "", c.email ?? "", c.referralCode].some((s) =>
            s.toLowerCase().includes(query.toLowerCase())
          )
        : true
    )
    .sort((a, b) => b.totalSpentCents - a.totalSpentCents);

  const totalRevenue = clients.reduce((s, c) => s + c.totalSpentCents, 0);
  const vipCount = clients.filter((c) => c.totalSpentCents >= 5000).length;

  function copyReferralLink(client: Client) {
    const url = `${window.location.origin}/b/${shop.slug}?ref=${client.referralCode}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link referral copiato",
      description: url,
      variant: "success",
    });
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Clienti totali" value={String(clients.length)} />
        <StatBox label="Clienti VIP" value={String(vipCount)} hint="Spesa > 50€" />
        <StatBox label="Valore lifetime" value={formatEuro(totalRevenue)} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <Input
            placeholder="Cerca per nome, telefono, codice referral"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Nuovo cliente
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setDetail(c)}
            className="glass rounded-xl p-5 text-left hover:border-[color:var(--color-gold-500)]/40 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)] font-medium">
                {initials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink-50 truncate">{c.name}</div>
                <div className="text-xs text-ink-400 truncate">
                  {c.phone ?? c.email ?? "—"}
                </div>
              </div>
              {c.tags && c.tags.includes("VIP") && (
                <Badge variant="gold" className="text-[10px]">VIP</Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-white/5">
              <MiniInfo label="Visite" value={String(c.totalVisits)} />
              <MiniInfo label="Speso" value={formatEuro(c.totalSpentCents)} />
              <MiniInfo
                label="Ultima"
                value={c.lastVisitAt ? formatDateIt(c.lastVisitAt) : "—"}
              />
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-ink-400">
            Nessun cliente trovato.
          </div>
        )}
      </div>

      <NewClientDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      {detail && (
        <ClientDetailDialog
          client={detail}
          bookingsForClient={bookings.filter((b) => b.clientId === detail.id)}
          onClose={() => setDetail(null)}
          onCopyReferral={() => copyReferralLink(detail)}
        />
      )}
    </div>
  );
}

function StatBox({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">
        {label}
      </div>
      <div className="font-display text-3xl text-ink-50 mb-1">{value}</div>
      {hint && <div className="text-xs text-ink-400">{hint}</div>}
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-0.5">
        {label}
      </div>
      <div className="text-xs font-medium text-ink-100 truncate">{value}</div>
    </div>
  );
}

function NewClientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    demoStore.createClient({
      name,
      phone: phone || undefined,
      email: email || undefined,
      notes: notes || undefined,
      tags: ["Nuovo"],
    });
    toast({ title: "Cliente aggiunto", variant: "success" });
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo cliente</DialogTitle>
          <DialogDescription>
            Aggiungi manualmente un cliente al database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="n">Nome</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p">Telefono</Label>
              <Input id="p" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e">Email</Label>
              <Input
                id="e"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Preferenze, allergie, storia..."
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit">Aggiungi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ClientDetailDialog({
  client,
  bookingsForClient,
  onClose,
  onCopyReferral,
}: {
  client: Client;
  bookingsForClient: ReturnType<typeof useShopData>["bookings"];
  onClose: () => void;
  onCopyReferral: () => void;
}) {
  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[color:var(--color-gold-500)]/15 text-[color:var(--color-gold-300)] font-medium text-lg">
              {initials(client.name)}
            </div>
            <div>
              <DialogTitle>{client.name}</DialogTitle>
              <DialogDescription>
                Cliente dal {formatDateIt(client.createdAt)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Visite" value={String(client.totalVisits)} />
          <MiniStat label="Speso" value={formatEuro(client.totalSpentCents)} />
          <MiniStat
            label="Ultima"
            value={client.lastVisitAt ? formatDateIt(client.lastVisitAt) : "—"}
          />
        </div>

        <div className="space-y-3">
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-ink-200">
              <Phone className="h-4 w-4 text-ink-500" /> {client.phone}
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-ink-200">
              <Mail className="h-4 w-4 text-ink-500" /> {client.email}
            </div>
          )}
          {client.notes && (
            <div className="rounded-lg bg-black/30 border border-white/5 p-3 text-sm text-ink-300">
              {client.notes}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[color:var(--color-gold-500)]/25 bg-[color:var(--color-gold-500)]/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-[color:var(--color-gold-400)]" />
            <span className="text-sm font-medium text-[color:var(--color-gold-300)]">
              Codice referral
            </span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-ink-100 font-mono px-3 py-2 rounded bg-black/40 border border-white/5">
              {client.referralCode}
            </code>
            <Button size="sm" variant="secondary" onClick={onCopyReferral}>
              <Copy className="h-3.5 w-3.5" /> Copia link
            </Button>
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-ink-500 mb-2">
            Ultime prenotazioni
          </div>
          {bookingsForClient.length === 0 ? (
            <div className="text-sm text-ink-500">Nessuna prenotazione.</div>
          ) : (
            <ul className="space-y-2">
              {bookingsForClient.slice(0, 5).map((b) => (
                <li
                  key={b.id}
                  className="flex justify-between text-sm border-b border-white/5 pb-2"
                >
                  <div>
                    <div className="text-ink-100">{b.serviceName}</div>
                    <div className="text-xs text-ink-500">
                      {formatDateIt(b.startsAt, { withTime: true })}
                    </div>
                  </div>
                  <div className="text-ink-200">{formatEuro(b.priceCents)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              demoStore.deleteClient(client.id);
              toast({ title: "Cliente rimosso", variant: "info" });
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4" /> Elimina
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/30 border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-widest text-ink-500 mb-1">
        {label}
      </div>
      <div className="font-display text-xl text-ink-50">{value}</div>
    </div>
  );
}
