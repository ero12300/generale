"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateShop } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import type { Service, StaffMember } from "@/types";
import {
  Save, Plus, Trash2, Scissors, Users, Clock, Euro,
  Store, Phone, Mail, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { generateId, formatCurrency } from "@/lib/utils";

export default function SettingsPage() {
  const { shop, refreshShop } = useAuth();
  const [saving, setSaving] = useState(false);
  const [shopForm, setShopForm] = useState({
    name: shop?.name ?? "",
    phone: shop?.phone ?? "",
    email: shop?.email ?? "",
    address: shop?.address ?? "",
  });
  const [services, setServices] = useState<Service[]>(shop?.settings?.services ?? []);
  const [staff, setStaff] = useState<StaffMember[]>(shop?.settings?.staff ?? []);

  const handleSaveShop = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await updateShop(shop.id, {
        name: shopForm.name,
        phone: shopForm.phone || undefined,
        email: shopForm.email || undefined,
        address: shopForm.address || undefined,
      });
      await refreshShop();
      toast.success("Impostazioni salvate!");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await updateShop(shop.id, { settings: { ...shop.settings, services } });
      await refreshShop();
      toast.success("Servizi aggiornati!");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStaff = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await updateShop(shop.id, { settings: { ...shop.settings, staff } });
      await refreshShop();
      toast.success("Staff aggiornato!");
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    setServices((p) => [
      ...p,
      { id: generateId(), name: "Nuovo servizio", duration: 30, price: 15, active: true },
    ]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices((p) => p.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const removeService = (id: string) => {
    setServices((p) => p.filter((s) => s.id !== id));
  };

  const addStaff = () => {
    setStaff((p) => [
      ...p,
      { id: generateId(), name: "Nuovo barbiere", active: true, services: services.map((s) => s.id) },
    ]);
  };

  const updateStaff = (id: string, data: Partial<StaffMember>) => {
    setStaff((p) => p.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const removeStaff = (id: string) => {
    setStaff((p) => p.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Impostazioni</h1>
        <p className="text-sm text-[var(--muted)]">Configura il tuo barbershop</p>
      </div>

      {/* Shop Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[var(--primary)]" /> Informazioni negozio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nome barbershop"
            value={shopForm.name}
            onChange={(e) => setShopForm((p) => ({ ...p, name: e.target.value }))}
            leftIcon={<Scissors className="w-4 h-4" />}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Telefono"
              value={shopForm.phone}
              onChange={(e) => setShopForm((p) => ({ ...p, phone: e.target.value }))}
              leftIcon={<Phone className="w-4 h-4" />}
              type="tel"
            />
            <Input
              label="Email"
              value={shopForm.email}
              onChange={(e) => setShopForm((p) => ({ ...p, email: e.target.value }))}
              leftIcon={<Mail className="w-4 h-4" />}
              type="email"
            />
          </div>
          <Input
            label="Indirizzo"
            value={shopForm.address}
            onChange={(e) => setShopForm((p) => ({ ...p, address: e.target.value }))}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
          <Button variant="gold" onClick={handleSaveShop} loading={saving}>
            <Save className="w-4 h-4" /> Salva informazioni
          </Button>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-[var(--primary)]" /> Servizi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-[var(--accent)] border border-[var(--border)]">
                <div className="col-span-5">
                  <Input
                    label="Nome"
                    value={service.name}
                    onChange={(e) => updateService(service.id, { name: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    label="Min"
                    type="number"
                    value={String(service.duration)}
                    onChange={(e) => updateService(service.id, { duration: Number(e.target.value) })}
                    leftIcon={<Clock className="w-3 h-3" />}
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    label="Prezzo €"
                    type="number"
                    step="0.5"
                    value={String(service.price)}
                    onChange={(e) => updateService(service.id, { price: Number(e.target.value) })}
                    leftIcon={<Euro className="w-3 h-3" />}
                  />
                </div>
                <div className="col-span-2 flex justify-end pb-0.5">
                  <Button size="icon" variant="ghost" onClick={() => removeService(service.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={addService}>
              <Plus className="w-4 h-4" /> Aggiungi servizio
            </Button>
            <Button variant="gold" onClick={handleSaveServices} loading={saving}>
              <Save className="w-4 h-4" /> Salva servizi
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--primary)]" /> Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {staff.map((member) => (
              <div key={member.id} className="flex items-end gap-3 p-3 rounded-lg bg-[var(--accent)] border border-[var(--border)]">
                <Input
                  label="Nome"
                  value={member.name}
                  onChange={(e) => updateStaff(member.id, { name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  label="Email"
                  value={member.email ?? ""}
                  onChange={(e) => updateStaff(member.id, { email: e.target.value || undefined })}
                  className="flex-1"
                  type="email"
                />
                <Button size="icon" variant="ghost" className="mb-0.5" onClick={() => removeStaff(member.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={addStaff}>
              <Plus className="w-4 h-4" /> Aggiungi barbiere
            </Button>
            <Button variant="gold" onClick={handleSaveStaff} loading={saving}>
              <Save className="w-4 h-4" /> Salva staff
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
