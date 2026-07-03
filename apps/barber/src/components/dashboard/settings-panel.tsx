"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Plus, Save, Scissors, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataStore } from "@/lib/data-store";
import { DAY_KEYS, DAY_LABELS } from "@/lib/opening-hours";
import type { DayHours, OpeningHours, Shop } from "@/lib/types";

type ServiceDraft = {
  id: string;
  name: string;
  durationMinutes: string;
  priceEuro: string;
  isNew?: boolean;
};

function hoursToDraft(hours: OpeningHours): OpeningHours {
  return { ...hours };
}

export function SettingsPanel() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [services, setServices] = useState<ServiceDraft[]>([]);
  const [hours, setHours] = useState<OpeningHours | null>(null);
  const [shopForm, setShopForm] = useState({ name: "", address: "", phone: "", email: "", slug: "" });
  const [loading, setLoading] = useState(true);
  const [savingHours, setSavingHours] = useState(false);
  const [savingServices, setSavingServices] = useState(false);
  const [savingShop, setSavingShop] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const s = await dataStore.getShop();
      const svcs = await dataStore.getServices(s.id);
      setShop(s);
      setShopForm({
        name: s.name,
        address: s.address ?? "",
        phone: s.phone ?? "",
        email: s.email,
        slug: s.slug,
      });
      setHours(hoursToDraft(s.openingHours));
      setServices(
        svcs.map((svc) => ({
          id: svc.id,
          name: svc.name,
          durationMinutes: String(svc.durationMinutes),
          priceEuro: (svc.priceCents / 100).toFixed(2),
        }))
      );
      setLoading(false);
    }
    void load();
  }, []);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function saveHours() {
    if (!shop || !hours) return;
    setSavingHours(true);
    try {
      const updated = await dataStore.updateShop(shop.id, {
        openingHours: hours,
      });
      setShop(updated);
      showMessage("success", "Orari salvati! Visibili subito nella pagina prenotazioni.");
    } catch {
      showMessage("error", "Errore nel salvataggio orari");
    } finally {
      setSavingHours(false);
    }
  }

  async function saveServices() {
    if (!shop) return;
    setSavingServices(true);
    try {
      for (const draft of services) {
        const duration = parseInt(draft.durationMinutes, 10);
        const priceCents = Math.round(parseFloat(draft.priceEuro) * 100);

        if (!draft.name.trim() || isNaN(duration) || duration <= 0 || isNaN(priceCents) || priceCents < 0) {
          throw new Error("Controlla nome, durata e prezzo di ogni servizio");
        }

        if (draft.isNew) {
          await dataStore.addService({
            shopId: shop.id,
            name: draft.name.trim(),
            durationMinutes: duration,
            priceCents,
            active: true,
          });
        } else {
          await dataStore.updateService(draft.id, {
            name: draft.name.trim(),
            durationMinutes: duration,
            priceCents,
          });
        }
      }

      const refreshed = await dataStore.getServices(shop.id);
      setServices(
        refreshed.map((svc) => ({
          id: svc.id,
          name: svc.name,
          durationMinutes: String(svc.durationMinutes),
          priceEuro: (svc.priceCents / 100).toFixed(2),
        }))
      );
      showMessage("success", "Prezzi aggiornati! I clienti vedranno i nuovi importi.");
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "Errore nel salvataggio prezzi");
    } finally {
      setSavingServices(false);
    }
  }

  async function saveShopInfo() {
    if (!shop) return;
    setSavingShop(true);
    try {
      const updated = await dataStore.updateShop(shop.id, {
        name: shopForm.name.trim(),
        address: shopForm.address.trim(),
        phone: shopForm.phone.trim(),
        email: shopForm.email.trim(),
        slug: shopForm.slug.trim(),
      });
      setShop(updated);
      showMessage("success", "Informazioni salone salvate");
    } catch {
      showMessage("error", "Errore nel salvataggio");
    } finally {
      setSavingShop(false);
    }
  }

  function updateDayHours(day: keyof OpeningHours, field: keyof DayHours, value: string | boolean) {
    setHours((prev) =>
      prev
        ? {
            ...prev,
            [day]: { ...prev[day], [field]: value },
          }
        : prev
    );
  }

  function addServiceRow() {
    setServices((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, name: "", durationMinutes: "30", priceEuro: "25.00", isNew: true },
    ]);
  }

  async function removeService(id: string, isNew?: boolean) {
    if (isNew) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    const removed = await dataStore.deleteService(id);
    if (removed) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      showMessage("success", "Servizio eliminato");
    }
  }

  if (loading || !shop || !hours) {
    return <p className="text-cream/50 py-8 text-center">Caricamento impostazioni...</p>;
  }

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Backoffice</h1>
        <p className="text-sm text-cream/50">Modifica orari e prezzi dal telefono</p>
      </div>

      {message && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
          role="status"
        >
          {message.text}
        </div>
      )}

      <Tabs defaultValue="hours" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="hours" className="py-2.5 text-xs sm:text-sm">
            <Clock className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Orari</span>
          </TabsTrigger>
          <TabsTrigger value="prices" className="py-2.5 text-xs sm:text-sm">
            <Scissors className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Prezzi</span>
          </TabsTrigger>
          <TabsTrigger value="shop" className="py-2.5 text-xs sm:text-sm">
            Salone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Orari di apertura</CardTitle>
              <p className="text-sm text-cream/50">
                Gli slot prenotazione si aggiornano automaticamente
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {DAY_KEYS.map((day) => {
                const dayHours = hours?.[day];
                if (!dayHours) return null;
                return (
                  <div
                    key={day}
                    className="rounded-xl border border-gold/10 bg-charcoal/40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-sm">{DAY_LABELS[day]}</span>
                      <label className="flex items-center gap-2 text-sm text-cream/60 cursor-pointer min-h-[44px]">
                        <input
                          type="checkbox"
                          checked={!!dayHours.closed}
                          onChange={(e) => updateDayHours(day, "closed", e.target.checked)}
                          className="h-5 w-5 rounded accent-gold"
                        />
                        Chiuso
                      </label>
                    </div>
                    {!dayHours.closed && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`${day}-open`} className="text-xs">Apertura</Label>
                          <Input
                            id={`${day}-open`}
                            type="time"
                            value={dayHours.open}
                            onChange={(e) => updateDayHours(day, "open", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${day}-close`} className="text-xs">Chiusura</Label>
                          <Input
                            id={`${day}-close`}
                            type="time"
                            value={dayHours.close}
                            onChange={(e) => updateDayHours(day, "close", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <Button
                className="w-full min-h-[48px]"
                onClick={() => void saveHours()}
                disabled={savingHours}
              >
                <Save className="h-4 w-4" />
                {savingHours ? "Salvataggio..." : "Salva Orari"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prices" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Servizi e prezzi</CardTitle>
              <p className="text-sm text-cream/50">I clienti vedono questi prezzi quando prenotano</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="rounded-xl border border-gold/10 bg-charcoal/40 p-4 space-y-3"
                >
                  <div>
                    <Label htmlFor={`name-${svc.id}`} className="text-xs">Nome servizio</Label>
                    <Input
                      id={`name-${svc.id}`}
                      value={svc.name}
                      onChange={(e) =>
                        setServices((prev) =>
                          prev.map((s) => (s.id === svc.id ? { ...s, name: e.target.value } : s))
                        )
                      }
                      placeholder="Es. Taglio Classico"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`dur-${svc.id}`} className="text-xs">Durata (min)</Label>
                      <Input
                        id={`dur-${svc.id}`}
                        type="number"
                        inputMode="numeric"
                        min="5"
                        step="5"
                        value={svc.durationMinutes}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === svc.id ? { ...s, durationMinutes: e.target.value } : s
                            )
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`price-${svc.id}`} className="text-xs">Prezzo (€)</Label>
                      <Input
                        id={`price-${svc.id}`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.5"
                        value={svc.priceEuro}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s) =>
                              s.id === svc.id ? { ...s, priceEuro: e.target.value } : s
                            )
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 min-h-[44px]"
                    onClick={() => void removeService(svc.id, svc.isNew)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Elimina
                  </Button>
                </div>
              ))}

              <Button variant="outline" className="w-full min-h-[48px]" onClick={addServiceRow}>
                <Plus className="h-4 w-4" />
                Aggiungi Servizio
              </Button>

              <Button
                className="w-full min-h-[48px]"
                onClick={() => void saveServices()}
                disabled={savingServices}
              >
                <Save className="h-4 w-4" />
                {savingServices ? "Salvataggio..." : "Salva Prezzi"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shop" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Il tuo salone</CardTitle>
              <Badge variant="default">{shop.plan.toUpperCase()}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shop-name">Nome Salone</Label>
                <Input
                  id="shop-name"
                  value={shopForm.name}
                  onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shop-address">Indirizzo</Label>
                <Input
                  id="shop-address"
                  value={shopForm.address}
                  onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shop-phone">Telefono</Label>
                <Input
                  id="shop-phone"
                  type="tel"
                  inputMode="tel"
                  value={shopForm.phone}
                  onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shop-email">Email</Label>
                <Input
                  id="shop-email"
                  type="email"
                  inputMode="email"
                  value={shopForm.email}
                  onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shop-slug">Link prenotazione</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-cream/50 shrink-0">/book/</span>
                  <Input
                    id="shop-slug"
                    value={shopForm.slug}
                    onChange={(e) => setShopForm({ ...shopForm, slug: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button
                className="w-full min-h-[48px]"
                onClick={() => void saveShopInfo()}
                disabled={savingShop}
              >
                {savingShop ? "Salvataggio..." : "Salva Informazioni"}
              </Button>
              <Button variant="outline" className="w-full min-h-[48px]" asChild>
                <Link href="/pricing">Gestisci Abbonamento</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
