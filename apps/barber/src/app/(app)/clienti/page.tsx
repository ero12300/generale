"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Gift, Phone, Plus, Search, Star, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiGet, apiSend } from "@/lib/client-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Client } from "@/lib/types";

export default function ClientiPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setClients(await apiGet<Client[]>("/api/clients"));
  }

  useEffect(() => {
    reload()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
    );
  }, [clients, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Clienti</h1>
          <p className="mt-1 text-zinc-400">
            {clients.length} clienti in archivio · storico, fedeltà e referral.
          </p>
        </div>
        <NewClientDialog onCreated={reload} />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca per nome o telefono…"
          className="pl-9"
          aria-label="Cerca clienti"
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="h-40 animate-pulse rounded-2xl bg-zinc-800/60" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{c.name}</p>
                      {c.tags.includes("VIP") && (
                        <Badge variant="default" className="gap-1">
                          <Star className="h-3 w-3 fill-current" /> VIP
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                      <Phone className="h-3.5 w-3.5" /> {c.phone}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-lg bg-[#c9a24b]/10 px-2 py-1 text-xs text-gold-soft">
                    <Award className="h-3.5 w-3.5" /> {c.loyaltyPoints} pt
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                    <p className="text-xs text-zinc-500">Visite</p>
                    <p className="font-semibold">{c.totalVisits}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                    <p className="text-xs text-zinc-500">Spesa totale</p>
                    <p className="font-semibold">{formatCurrency(c.totalSpent)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Gift className="h-3.5 w-3.5 text-gold-soft" />
                    <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-gold-soft">
                      {c.referralCode}
                    </code>
                  </span>
                  <span>Ultima: {formatDate(c.lastVisitAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-zinc-500">Nessun cliente trovato.</p>
          )}
        </div>
      )}
    </div>
  );
}

function NewClientDialog({ onCreated }: { onCreated: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [referredByCode, setReferredByCode] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setName("");
    setPhone("");
    setEmail("");
    setReferredByCode("");
    setNotes("");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiSend("/api/clients", "POST", {
        name,
        phone,
        email: email || undefined,
        referredByCode: referredByCode || undefined,
        notes: notes || undefined,
      });
      await onCreated();
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuovo cliente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo cliente</DialogTitle>
          <DialogDescription>
            Aggiungi un cliente al database. Se arriva da un referral, inserisci il codice
            amico per assegnare i punti.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="c-name">Nome</Label>
              <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-phone">Telefono</Label>
              <Input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-email">Email (opzionale)</Label>
            <Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-ref">Codice amico (referral)</Label>
            <Input
              id="c-ref"
              value={referredByCode}
              onChange={(e) => setReferredByCode(e.target.value)}
              placeholder="Es. AMICO-X1Y2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-notes">Note</Label>
            <Textarea id="c-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && (
            <p className="rounded-lg border border-red-600/40 bg-red-600/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={saving}>
              <UserPlus className="h-4 w-4" /> {saving ? "Salvataggio…" : "Aggiungi cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
