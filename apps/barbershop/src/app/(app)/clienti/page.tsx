"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Phone, Mail, Gift, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { formatCents } from "@/lib/money";
import { initials } from "@/lib/utils";

export default function ClientiPage() {
  const { data, addClient, deleteClient } = useStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...data.clients].sort((a, b) => b.totalSpentCents - a.totalSpentCents);
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q)
    );
  }, [data.clients, query]);

  return (
    <div>
      <PageHeader
        title="Database Clienti"
        subtitle={`${data.clients.length} clienti registrati`}
        action={<AddClientDialog onAdd={addClient} referralCodes={data.clients.map((c) => c.referralCode)} />}
      />

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          className="pl-9"
          placeholder="Cerca per nome, telefono o email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/15 font-semibold text-amber-300">
                    {initials(c.name)}
                  </span>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <Badge key={t} variant="neutral">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteClient(c.id)}
                  aria-label={`Elimina ${c.name}`}
                  className="rounded p-1 text-zinc-600 hover:bg-zinc-800 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-zinc-400">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {c.phone}
                </p>
                {c.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Gift className="h-3.5 w-3.5" /> Codice invito:{" "}
                  <span className="font-mono text-amber-300">{c.referralCode}</span>
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-zinc-800 pt-3 text-center">
                <div>
                  <p className="text-sm font-bold">{c.visits}</p>
                  <p className="text-[10px] uppercase text-zinc-500">Visite</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{formatCents(c.totalSpentCents, { withDecimals: false })}</p>
                  <p className="text-[10px] uppercase text-zinc-500">Speso</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-300">{c.loyaltyPoints}</p>
                  <p className="text-[10px] uppercase text-zinc-500">Punti</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-zinc-500">Nessun cliente trovato.</p>
      )}
    </div>
  );
}

function AddClientDialog({
  onAdd,
  referralCodes,
}: {
  onAdd: ReturnType<typeof useStore>["addClient"];
  referralCodes: string[];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [referredByCode, setReferredByCode] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Nome e telefono sono obbligatori.");
      return;
    }
    if (referredByCode && !referralCodes.includes(referredByCode.trim().toUpperCase())) {
      setError("Codice invito non valido.");
      return;
    }
    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      referredByCode: referredByCode.trim().toUpperCase() || undefined,
    });
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setReferredByCode("");
    setError("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Nuovo cliente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuovo cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cl-name">Nome *</Label>
              <Input id="cl-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-phone">Telefono *</Label>
              <Input id="cl-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-email">Email</Label>
            <Input id="cl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-ref">Codice invito (Porta un Amico)</Label>
            <Input
              id="cl-ref"
              value={referredByCode}
              onChange={(e) => setReferredByCode(e.target.value)}
              placeholder="Es. GIUSE-4821"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-notes">Note</Label>
            <Input id="cl-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annulla
              </Button>
            </DialogClose>
            <Button type="submit">Aggiungi cliente</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
