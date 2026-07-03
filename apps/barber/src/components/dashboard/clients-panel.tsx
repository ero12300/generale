"use client";

import { useEffect, useState } from "react";
import { Gift, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataStore } from "@/lib/data-store";
import type { Customer } from "@/lib/types";
import { formatEuro } from "@/lib/utils";

export function ClientsPanel() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const shop = await dataStore.getShop();
      const c = await dataStore.getCustomers(shop.id);
      setCustomers(c);
      setLoading(false);
    }
    void load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Nome e telefono sono obbligatori");
      return;
    }

    setSaving(true);
    try {
      const shop = await dataStore.getShop();
      const customer = await dataStore.createCustomer({
        shopId: shop.id,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      });
      setCustomers((prev) => [...prev, customer]);
      setForm({ name: "", phone: "", email: "" });
      setShowForm(false);
      setSuccess(true);
    } catch {
      setError("Errore durante il salvataggio");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-cream/50">Caricamento clienti...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Clienti</h1>
          <p className="text-cream/50">{customers.length} clienti nel database</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <UserPlus className="h-4 w-4" />
          Nuovo Cliente
        </Button>
      </div>

      {success && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-sm">
          Cliente aggiunto con successo!
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Aggiungi Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)} className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+39 333 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="mario@email.it"
                />
              </div>
              {error && <p className="sm:col-span-3 text-red-400 text-sm">{error}</p>}
              <div className="sm:col-span-3 flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvataggio..." : "Salva Cliente"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-gold font-display text-lg font-bold">
                  {c.name.charAt(0)}
                </div>
                {c.referredBy && (
                  <Badge variant="success">
                    <Gift className="h-3 w-3 mr-1" />
                    Referral
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold mb-1">{c.name}</h3>
              <p className="text-sm text-cream/50 mb-3">{c.phone}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-charcoal/50 p-2">
                  <p className="text-cream/40">Visite</p>
                  <p className="font-medium">{c.totalVisits}</p>
                </div>
                <div className="rounded-lg bg-charcoal/50 p-2">
                  <p className="text-cream/40">Speso</p>
                  <p className="font-medium text-gold">{formatEuro(c.totalSpentCents)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-cream/40">
                Codice referral: <span className="text-gold font-mono">{c.referralCode}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
