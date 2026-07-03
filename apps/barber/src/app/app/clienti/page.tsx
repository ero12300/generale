"use client";

import { useMemo, useState } from "react";
import { Topbar } from "@/components/app/topbar";
import { useOpenNav } from "@/app/app/nav-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useStore } from "@/components/providers/data-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Download, Phone, Plus, Search, Users } from "lucide-react";
import { formatDateIT, formatEUR, initials } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { hasFeature } from "@/lib/plans";
import Link from "next/link";

export default function ClientiPage() {
  const store = useStore();
  const openNav = useOpenNav();
  const toast = useToast();
  const { user } = useAuth();
  const canExport = hasFeature(user?.plan, "export.csv");
  const [q, setQ] = useState("");
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", tags: "", notes: "" });

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return store.clients
      .filter((c) => {
        if (!query) return true;
        return (
          `${c.firstName} ${c.lastName ?? ""}`.toLowerCase().includes(query) ||
          (c.phone ?? "").toLowerCase().includes(query) ||
          (c.email ?? "").toLowerCase().includes(query) ||
          c.tags.some((t) => t.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => (b.lastVisitAt ?? "").localeCompare(a.lastVisitAt ?? ""));
  }, [store.clients, q]);

  const submit = async () => {
    if (!form.firstName.trim()) {
      toast.error("Serve almeno il nome");
      return;
    }
    await store.createClient({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      notes: form.notes.trim() || undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    toast.success("Cliente aggiunto");
    setDialog(false);
    setForm({ firstName: "", lastName: "", phone: "", email: "", tags: "", notes: "" });
  };

  const exportCsv = () => {
    const rows = [
      ["Nome", "Cognome", "Telefono", "Email", "Tag", "Visite", "Totale speso €", "Ultima visita", "Codice referral"].join(","),
      ...store.clients.map((c) =>
        [
          c.firstName,
          c.lastName ?? "",
          c.phone ?? "",
          c.email ?? "",
          c.tags.join("|"),
          c.totalVisits,
          c.totalSpentEur.toFixed(2),
          c.lastVisitAt ?? "",
          c.referralCode,
        ]
          .map((f) => `"${String(f).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clienti-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV scaricato");
  };

  return (
    <>
      <Topbar
        title="Clienti"
        subtitle={`${store.clients.length} clienti nel tuo database`}
        onOpenNav={openNav}
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!canExport}
              onClick={exportCsv}
              title={!canExport ? "Disponibile dal piano Base" : "Scarica CSV"}
            >
              <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button variant="gold" onClick={() => setDialog(true)}>
              <Plus className="h-4 w-4" /> Nuovo cliente
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input placeholder="Cerca per nome, telefono, tag…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title="Nessun cliente"
              description="Aggiungi il tuo primo cliente o importa dal telefono."
              action={<Button variant="gold" onClick={() => setDialog(true)}><Plus className="h-4 w-4" /> Nuovo cliente</Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="pb-3 pr-4">Cliente</th>
                    <th className="pb-3 pr-4">Contatti</th>
                    <th className="pb-3 pr-4">Visite</th>
                    <th className="pb-3 pr-4">Totale</th>
                    <th className="pb-3 pr-4">Ultima visita</th>
                    <th className="pb-3">Codice referral</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((c) => (
                    <tr key={c.id} className="text-white/85">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full gold-border text-xs text-[color:var(--color-gold-200)]">
                            {initials(`${c.firstName} ${c.lastName ?? ""}`.trim())}
                          </span>
                          <div>
                            <div className="text-white">{c.firstName} {c.lastName ?? ""}</div>
                            <div className="mt-0.5 flex gap-1">
                              {c.tags.map((t) => (
                                <Badge key={t} tone={t === "VIP" ? "gold" : "muted"}>{t}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5 text-white/80">
                          {c.phone ? (
                            <>
                              <Phone className="h-3 w-3 text-white/40" /> <a className="hover:text-white" href={`tel:${c.phone}`}>{c.phone}</a>
                            </>
                          ) : "—"}
                        </div>
                        <div className="text-xs text-white/50">{c.email ?? ""}</div>
                      </td>
                      <td className="py-3 pr-4">{c.totalVisits}</td>
                      <td className="py-3 pr-4 text-[color:var(--color-gold-200)]">{formatEUR(c.totalSpentEur)}</td>
                      <td className="py-3 pr-4">{c.lastVisitAt ? formatDateIT(c.lastVisitAt) : "—"}</td>
                      <td className="py-3">
                        <button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(c.referralCode);
                              toast.success("Codice referral copiato");
                            } catch { toast.error("Copia non riuscita"); }
                          }}
                          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs text-[color:var(--color-gold-200)] hover:border-[color:var(--color-gold-300)]/30"
                        >
                          {c.referralCode}
                          <Copy className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!canExport && (
        <p className="mt-3 text-xs text-white/40">
          Export CSV disponibile con piano Base. <Link className="text-[color:var(--color-gold-200)] underline underline-offset-4" href="/app/abbonamento">Aggiorna</Link>
        </p>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuovo cliente</DialogTitle>
            <DialogDescription>Puoi lasciare vuoti i campi opzionali.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>Nome *</Label>
                <Input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} placeholder="Marco" />
              </div>
              <div>
                <Label>Cognome</Label>
                <Input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} placeholder="Bianchi" />
              </div>
              <div>
                <Label>Telefono</Label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+39 …" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="cliente@email.it" />
              </div>
              <div className="sm:col-span-2">
                <Label>Tag (separati da virgola)</Label>
                <Input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="VIP, Barba, Studente" />
              </div>
              <div className="sm:col-span-2">
                <Label>Note</Label>
                <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Preferenze, allergie, promemoria…" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialog(false)}>Annulla</Button>
            <Button variant="gold" onClick={submit}>Aggiungi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
