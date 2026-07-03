"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dataStore } from "@/lib/data-store";
import type { Service, Shop } from "@/lib/types";
import { formatEuro } from "@/lib/utils";
import Link from "next/link";

export function SettingsPanel() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await dataStore.getShop();
      const svcs = await dataStore.getServices(s.id);
      setShop(s);
      setServices(svcs);
      setLoading(false);
    }
    void load();
  }, []);

  if (loading || !shop) {
    return <p className="text-cream/50">Caricamento impostazioni...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Impostazioni</h1>
        <p className="text-cream/50">Configura il tuo salone</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Salone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome Salone</Label>
              <Input defaultValue={shop.name} />
            </div>
            <div>
              <Label>Indirizzo</Label>
              <Input defaultValue={shop.address} />
            </div>
            <div>
              <Label>Telefono</Label>
              <Input defaultValue={shop.phone} />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue={shop.email} />
            </div>
            <div>
              <Label>Slug prenotazione</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-cream/50">/book/</span>
                <Input defaultValue={shop.slug} className="flex-1" />
              </div>
            </div>
            <Button>Salva Modifiche</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Piano Attuale</CardTitle>
            <Badge variant="default">{shop.plan.toUpperCase()}</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cream/60 mb-4">
              Il tuo piano include prenotazioni, gestione clienti e incassi.
              {shop.plan === "pro" && " Campagne e referral sono attivi."}
            </p>
            <Button variant="outline" asChild>
              <Link href="/pricing">Gestisci Abbonamento</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servizi e Prezzi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-gold/10 bg-charcoal/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-cream/50">{s.durationMinutes} min</p>
                </div>
                <p className="text-gold font-semibold">{formatEuro(s.priceCents)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
