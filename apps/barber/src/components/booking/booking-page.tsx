"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Check, Clock, MapPin, Scissors } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataStore } from "@/lib/data-store";
import type { Service, Shop } from "@/lib/types";
import { formatEuro } from "@/lib/utils";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

interface BookingPageProps {
  slug: string;
}

export function BookingPage({ slug }: BookingPageProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", referralCode: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const s = await dataStore.getShopBySlug(slug);
      if (s) {
        setShop(s);
        const svcs = await dataStore.getServices(s.id);
        setServices(svcs.filter((svc) => svc.active));
      }
      setLoading(false);
    }
    void load();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!shop || !selectedService || !selectedDate || !selectedTime) return;

    setError(null);
    setSubmitting(true);

    try {
      let customerId = "walk-in";
      const existing = (await dataStore.getCustomers(shop.id)).find(
        (c) => c.phone === form.phone.trim()
      );

      if (existing) {
        customerId = existing.id;
      } else {
        const created = await dataStore.createCustomer({
          shopId: shop.id,
          name: form.name.trim(),
          phone: form.phone.trim(),
          referredBy: form.referralCode.trim() || undefined,
        });
        customerId = created.id;
      }

      await dataStore.createBooking({
        shopId: shop.id,
        customerId,
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: selectedService.durationMinutes,
        priceCents: selectedService.priceCents,
      });

      setSuccess(true);
    } catch {
      setError("Errore durante la prenotazione. Riprova.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal text-cream/50">
        Caricamento...
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-cream/70">Salone non trovato</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal hero-glow p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto mb-4">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Prenotazione Confermata!</h2>
            <p className="text-cream/60 mb-2">
              {selectedService?.name} — {selectedDate} alle {selectedTime}
            </p>
            <p className="text-sm text-cream/50">
              Riceverai una conferma al {form.phone}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80"
          alt={shop.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="h-5 w-5 text-gold" />
            <Badge variant="default">Prenota Online</Badge>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">{shop.name}</h1>
          {shop.address && (
            <p className="flex items-center gap-1 text-sm text-cream/60 mt-1">
              <MapPin className="h-4 w-4" />
              {shop.address}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-colors ${
                step >= s ? "bg-gold" : "bg-gold/20"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold mb-4">Scegli il servizio</h2>
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedService(s);
                  setStep(2);
                }}
                className="w-full text-left rounded-2xl border border-gold/10 bg-charcoal-light/80 p-5 hover:border-gold/30 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    {s.description && (
                      <p className="text-sm text-cream/50 mt-1">{s.description}</p>
                    )}
                    <p className="flex items-center gap-1 text-xs text-cream/40 mt-2">
                      <Clock className="h-3 w-3" />
                      {s.durationMinutes} min
                    </p>
                  </div>
                  <p className="text-gold font-bold text-lg">{formatEuro(s.priceCents)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && selectedService && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Scegli data e ora</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Cambia servizio
              </Button>
            </div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gold" />
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Orario</Label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`rounded-lg py-2 text-sm border transition-all ${
                          selectedTime === t
                            ? "bg-gold text-charcoal border-gold"
                            : "border-gold/20 hover:border-gold/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                >
                  Continua
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && selectedService && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">I tuoi dati</h2>
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                Indietro
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="rounded-xl bg-gold/5 border border-gold/20 p-4 mb-6 text-sm">
                  <p className="font-medium">{selectedService.name}</p>
                  <p className="text-cream/50">
                    {selectedDate} alle {selectedTime} — {formatEuro(selectedService.priceCents)}
                  </p>
                </div>

                <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="referral">Codice amico (opzionale)</Label>
                    <Input
                      id="referral"
                      value={form.referralCode}
                      onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
                      placeholder="Es. MARC8X2K"
                    />
                    <p className="text-xs text-cream/40 mt-1">
                      Hai un codice Porta un Amico? Inseriscilo per lo sconto.
                    </p>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? "Prenotazione in corso..." : "Conferma Prenotazione"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
