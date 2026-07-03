"use client";

import { Suspense, useState } from "react";
import { Store, Save, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Billing } from "@/components/dashboard/Billing";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";

export default function SettingsPage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [form, setForm] = useState({
    shopName: ws.settings.shopName,
    ownerName: ws.settings.ownerName,
    address: ws.settings.address ?? "",
    phone: ws.settings.phone ?? "",
    openTime: ws.settings.openTime,
    closeTime: ws.settings.closeTime,
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    ws.updateSettings({
      shopName: form.shopName.trim() || "Il mio salone",
      ownerName: form.ownerName.trim(),
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
      openTime: form.openTime,
      closeTime: form.closeTime,
    });
    toast("Impostazioni salvate", "success");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Impostazioni" subtitle="Dati del salone e abbonamento" />

      <form onSubmit={save} className="card p-6">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-gold-soft" />
          <h2 className="font-display text-xl text-cream">Il tuo salone</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="set-shop">Nome salone</label>
            <input id="set-shop" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="set-owner">Titolare</label>
            <input id="set-owner" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="field" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="set-addr">Indirizzo</label>
            <input id="set-addr" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="set-phone">Telefono</label>
            <input id="set-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="set-open">Apertura</label>
              <input id="set-open" type="time" value={form.openTime} onChange={(e) => setForm({ ...form, openTime: e.target.value })} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="set-close">Chiusura</label>
              <input id="set-close" type="time" value={form.closeTime} onChange={(e) => setForm({ ...form, closeTime: e.target.value })} className="field" />
            </div>
          </div>
        </div>
        <button type="submit" className="btn-gold mt-5">
          <Save className="h-4 w-4" /> Salva impostazioni
        </button>
      </form>

      <Suspense fallback={<div className="card p-6 text-sm text-cream/40">Caricamento...</div>}>
        <Billing />
      </Suspense>

      <div className="card p-6">
        <h2 className="font-display text-xl text-cream">Modalità demo</h2>
        <p className="mt-1 text-sm text-cream/50">
          Ripristina i dati dimostrativi (clienti, prenotazioni e incassi di esempio).
        </p>
        <button
          onClick={() => { ws.resetDemo(); toast("Dati demo ripristinati", "success"); }}
          className="btn-ghost mt-4"
        >
          <RefreshCw className="h-4 w-4" /> Ripristina dati demo
        </button>
      </div>
    </div>
  );
}
