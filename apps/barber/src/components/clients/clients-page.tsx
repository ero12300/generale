"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Phone,
  Mail,
  Trash2,
  Pencil,
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { demoStore, DEMO_ORG_ID } from "@/lib/demo-store";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency, formatDate, generateId, initials } from "@/lib/utils";
import type { Client } from "@/types";

export function ClientsPage() {
  const { push } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "vip" | "new" | "referral">("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setClients(demoStore.listClients());
  }

  const filtered = useMemo(() => {
    let list = clients;
    if (filter === "vip") list = list.filter((c) => c.tags.includes("VIP"));
    if (filter === "new") list = list.filter((c) => c.tags.includes("nuovo"));
    if (filter === "referral") list = list.filter((c) => c.tags.includes("porta-un-amico"));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [clients, filter, query]);

  function handleDelete(id: string) {
    demoStore.deleteClient(id);
    push("Cliente eliminato", "info");
    refresh();
  }

  const totalRevenue = clients.reduce((a, c) => a + c.totalSpent, 0);
  const vipCount = clients.filter((c) => c.tags.includes("VIP")).length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Clienti"
        description="La tua rubrica dorata. Preferenze, storico, punti fedeltà — tutto a portata di mano."
        action={
          <Button onClick={() => { setEditing(null); setOpenForm(true); }}>
            <Plus className="h-4 w-4" /> Nuovo cliente
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MiniStat icon={<Users className="h-4 w-4" />} label="Totale rubrica" value={`${clients.length}`} />
        <MiniStat icon={<Star className="h-4 w-4" />} label="Clienti VIP" value={`${vipCount}`} />
        <MiniStat icon={<Sparkles className="h-4 w-4" />} label="LTV totale" value={formatCurrency(totalRevenue)} />
        <MiniStat icon={<Sparkles className="h-4 w-4" />} label="LTV medio" value={clients.length ? formatCurrency(totalRevenue / clients.length) : "€0"} />
      </div>

      <div className="surface rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per nome, telefono, email…"
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5">
            {(["all", "vip", "new", "referral"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-xs px-3 py-2 rounded-lg border transition-colors",
                  filter === f
                    ? "border-gold-400/40 bg-gold-400/10 text-gold-200"
                    : "border-white/10 bg-white/5 text-ink-300 hover:bg-white/10"
                )}
              >
                {f === "all" ? "Tutti" : f === "vip" ? "VIP" : f === "new" ? "Nuovi" : "Referral"}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-400">
            <Users className="h-6 w-6 mx-auto text-gold-300 mb-2 opacity-60" />
            <p className="text-sm">Nessun cliente trovato.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((c) => (
              <div key={c.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-gold-400/20 hover:bg-white/[0.04] transition-all group">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "grid h-11 w-11 place-items-center rounded-full text-sm font-medium border shrink-0",
                    c.tags.includes("VIP") ? "bg-gold-400/20 border-gold-400/40 text-gold-100" : "bg-white/5 border-white/10 text-ink-200"
                  )}>
                    {initials(c.fullName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm text-ink-50 font-medium truncate">{c.fullName}</span>
                      {c.tags.map((t) => (
                        <Badge key={t} variant={t === "VIP" ? "gold" : t === "nuovo" ? "emerald" : "muted"} className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-xs text-ink-400">
                      {c.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" /> {c.phone}
                        </div>
                      )}
                      {c.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="h-3 w-3" /> {c.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" title="Modifica" onClick={() => { setEditing(c); setOpenForm(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Elimina" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-display text-lg text-ink-50">{c.totalVisits}</div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-widest">Visite</div>
                  </div>
                  <div>
                    <div className="font-display text-lg gradient-text">{formatCurrency(c.totalSpent).replace(",00", "")}</div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-widest">LTV</div>
                  </div>
                  <div>
                    <div className="font-display text-lg text-ink-50">{c.loyaltyPoints}</div>
                    <div className="text-[10px] text-ink-400 uppercase tracking-widest">Punti</div>
                  </div>
                </div>
                {c.lastVisitAt && (
                  <div className="mt-2 text-[11px] text-ink-500">
                    Ultima visita: {formatDate(c.lastVisitAt)}
                  </div>
                )}
                {c.notes && (
                  <div className="mt-2 text-xs text-ink-300 italic line-clamp-2">"{c.notes}"</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ClientForm
        open={openForm}
        onOpenChange={setOpenForm}
        editing={editing}
        onSaved={() => {
          setOpenForm(false);
          refresh();
        }}
      />
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="surface rounded-xl p-4">
      <div className="text-xs uppercase tracking-widest text-ink-400 flex items-center gap-1.5">
        <span className="text-gold-300">{icon}</span> {label}
      </div>
      <div className="font-display text-2xl text-ink-50 mt-1">{value}</div>
    </div>
  );
}

function ClientForm({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Client | null;
  onSaved: () => void;
}) {
  const { push } = useToast();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setFullName(editing.fullName);
      setPhone(editing.phone);
      setEmail(editing.email ?? "");
      setNotes(editing.notes);
      setTagsRaw(editing.tags.join(", "));
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setTagsRaw("");
    }
  }, [open, editing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      push("Inserisci il nome", "error");
      return;
    }
    const now = new Date().toISOString();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    if (editing) {
      demoStore.upsertClient({ ...editing, fullName: fullName.trim(), phone, email, notes, tags });
      push("Cliente aggiornato", "success");
    } else {
      demoStore.upsertClient({
        id: generateId("cli"),
        organizationId: DEMO_ORG_ID,
        fullName: fullName.trim(),
        phone,
        email,
        tags,
        notes,
        totalVisits: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        createdAt: now,
      });
      push("Cliente aggiunto", "success");
    }
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifica cliente" : "Nuovo cliente"}</DialogTitle>
          <DialogDescription>Compila la scheda per aggiungerlo alla rubrica.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome completo</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Telefono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 ..." />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Tag (separati da virgola)</Label>
            <Input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="VIP, abbonato, nuovo" />
          </div>
          <div>
            <Label>Note</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Preferenze, allergie, richieste..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button type="submit">{editing ? "Aggiorna" : "Aggiungi"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
