"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getClients, createClient, updateClient, deleteClient } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { Client } from "@/types";
import {
  Plus,
  Search,
  X,
  Star,
  Phone,
  Mail,
  Trash2,
  Edit,
  Gift,
  TrendingUp,
  Users,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function ClientsPage() {
  const { shop } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setClients(await getClients(shop.id));
    setLoading(false);
  }, [shop?.id]);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter(
    (c) =>
      search === "" ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminare questo cliente?")) return;
    await deleteClient(id);
    setClients((p) => p.filter((c) => c.id !== id));
    if (selectedClient?.id === id) setSelectedClient(null);
    toast.success("Cliente eliminato");
  };

  const copyReferral = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Codice copiato!");
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Clienti</h1>
          <p className="text-sm text-[var(--muted)]">{clients.length} clienti registrati</p>
        </div>
        <Button variant="gold" onClick={() => { setEditingClient(null); setShowModal(true); }}>
          <Plus className="w-4 h-4" /> Nuovo cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Totale</p>
                <p className="text-xl font-bold mt-1">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-[var(--border)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Fedeli</p>
                <p className="text-xl font-bold mt-1">{clients.filter((c) => c.totalVisits >= 5).length}</p>
              </div>
              <Star className="w-8 h-8 text-[var(--border)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">Referral</p>
                <p className="text-xl font-bold mt-1">{clients.filter((c) => c.referredBy).length}</p>
              </div>
              <Gift className="w-8 h-8 text-[var(--border)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-6">
        {/* Client List */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <Input
              placeholder="Cerca per nome, email, telefono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="space-y-2">
            {loading ? (
              [...Array(5)].map((_, i) => <Card key={i} className="h-16 shimmer" />)
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-[var(--border)] mx-auto mb-3" />
                <p className="text-[var(--muted)]">Nessun cliente trovato</p>
                <Button variant="gold" className="mt-4" onClick={() => setShowModal(true)}>
                  Aggiungi il primo cliente
                </Button>
              </div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedClient?.id === c.id
                      ? "border-[var(--primary)]/50 bg-[var(--primary)]/5"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center text-sm font-bold text-black shrink-0">
                    {getInitials(`${c.firstName} ${c.lastName}`)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] text-sm">
                      {c.firstName} {c.lastName}
                    </p>
                    <p className="text-xs text-[var(--muted)] truncate">{c.email ?? c.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-[var(--muted)]">{c.totalVisits} visite</p>
                      <p className="text-xs text-[var(--primary)]">{c.loyaltyPoints} pt</p>
                    </div>
                    {c.totalVisits >= 10 && (
                      <Star className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)]" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Client Detail Panel */}
        {selectedClient && (
          <div className="w-80 shrink-0 space-y-4">
            <Card className="gradient-border">
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] flex items-center justify-center text-base font-bold text-black">
                      {getInitials(`${selectedClient.firstName} ${selectedClient.lastName}`)}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--foreground)]">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        Cliente dal {formatDate(selectedClient.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingClient(selectedClient); setShowModal(true); }}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(selectedClient.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[var(--accent)] rounded-lg p-2">
                    <p className="text-lg font-bold text-[var(--primary)]">{selectedClient.totalVisits}</p>
                    <p className="text-xs text-[var(--muted)]">Visite</p>
                  </div>
                  <div className="bg-[var(--accent)] rounded-lg p-2">
                    <p className="text-lg font-bold">{selectedClient.loyaltyPoints}</p>
                    <p className="text-xs text-[var(--muted)]">Punti</p>
                  </div>
                  <div className="bg-[var(--accent)] rounded-lg p-2">
                    <p className="text-lg font-bold text-green-400">
                      €{(selectedClient.totalSpent / 100).toFixed(0)}
                    </p>
                    <p className="text-xs text-[var(--muted)]">Speso</p>
                  </div>
                </div>

                {selectedClient.phone && (
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedClient.phone}</span>
                  </div>
                )}
                {selectedClient.email && (
                  <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{selectedClient.email}</span>
                  </div>
                )}
                {selectedClient.notes && (
                  <p className="text-xs text-[var(--muted)] bg-[var(--accent)] rounded-lg p-2">
                    {selectedClient.notes}
                  </p>
                )}

                <div className="border-t border-[var(--border)] pt-3">
                  <p className="text-xs text-[var(--muted)] mb-1">Codice referral</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">
                      {selectedClient.referralCode}
                    </code>
                    <Button size="icon" variant="ghost" onClick={() => copyReferral(selectedClient.referralCode)}>
                      {copiedCode === selectedClient.referralCode
                        ? <Check className="w-3.5 h-3.5 text-green-400" />
                        : <Copy className="w-3.5 h-3.5" />
                      }
                    </Button>
                  </div>
                </div>

                {selectedClient.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedClient.tags.map((tag) => (
                      <Badge key={tag} variant="gold">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {showModal && shop && (
        <ClientModal
          shop={shop}
          client={editingClient}
          onClose={() => setShowModal(false)}
          onSaved={(c) => {
            if (editingClient) {
              setClients((p) => p.map((x) => (x.id === c.id ? c : x)));
              if (selectedClient?.id === c.id) setSelectedClient(c);
            } else {
              setClients((p) => [c, ...p]);
            }
            setShowModal(false);
            toast.success(editingClient ? "Cliente aggiornato" : "Cliente aggiunto!");
          }}
        />
      )}
    </div>
  );
}

function ClientModal({
  shop,
  client,
  onClose,
  onSaved,
}: {
  shop: any;
  client: Client | null;
  onClose: () => void;
  onSaved: (c: Client) => void;
}) {
  const [form, setForm] = useState({
    firstName: client?.firstName ?? "",
    lastName: client?.lastName ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    notes: client?.notes ?? "",
    tags: client?.tags?.join(", ") ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName) return;
    setSaving(true);
    try {
      const data = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email || undefined,
        phone: form.phone || undefined,
        notes: form.notes || undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (client) {
        await updateClient(client.id, data);
        onSaved({ ...client, ...data });
      } else {
        const newClient = await createClient(shop.id, data);
        onSaved(newClient);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{client ? "Modifica cliente" : "Nuovo cliente"}</h2>
          <Button size="icon" variant="ghost" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome *" value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
            <Input label="Cognome" value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Telefono" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          <Textarea label="Note" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Preferenze, allergie, note..." />
          <Input label="Tag (separati da virgola)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="VIP, Fedele, Barba..." />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Annulla</Button>
            <Button type="submit" variant="gold" className="flex-1" loading={saving}>
              {client ? "Aggiorna" : "Salva"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
