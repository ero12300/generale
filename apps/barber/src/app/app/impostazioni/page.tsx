"use client";

import { useState } from "react";
import { Topbar } from "@/components/app/topbar";
import { useOpenNav } from "@/app/app/nav-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/components/providers/data-provider";
import { useToast } from "@/components/providers/toast-provider";
import { formatEUR, slugify } from "@/lib/utils";
import { Plus, Save, Trash2 } from "lucide-react";
import type { Service, WeeklyHours } from "@/types";

const DAYS: { key: keyof WeeklyHours; label: string }[] = [
  { key: "mon", label: "Lunedì" },
  { key: "tue", label: "Martedì" },
  { key: "wed", label: "Mercoledì" },
  { key: "thu", label: "Giovedì" },
  { key: "fri", label: "Venerdì" },
  { key: "sat", label: "Sabato" },
  { key: "sun", label: "Domenica" },
];

export default function ImpostazioniPage() {
  const store = useStore();
  const toast = useToast();
  const openNav = useOpenNav();
  const [shop, setShop] = useState(store.shop);
  const [services, setServices] = useState<Service[]>(store.shop.services);
  const [hours, setHours] = useState<WeeklyHours>(store.shop.hours);

  const saveShop = async () => {
    await store.updateShop({
      name: shop.name,
      city: shop.city,
      address: shop.address,
      phone: shop.phone,
      email: shop.email,
      slotMinutes: shop.slotMinutes,
    });
    toast.success("Anagrafica salvata");
  };

  const saveServices = async () => {
    await store.updateServices(services);
    toast.success("Servizi aggiornati", `${services.length} servizi in listino`);
  };

  const saveHours = async () => {
    await store.updateHours(hours);
    toast.success("Orari salvati");
  };

  const addService = () => {
    setServices((s) => [
      ...s,
      { id: `svc_${Math.random().toString(36).slice(2, 8)}`, name: "Nuovo servizio", durationMin: 30, priceEur: 20, active: true },
    ]);
  };

  return (
    <>
      <Topbar title="Impostazioni" subtitle="Anagrafica, servizi, orari e link pubblico." onOpenNav={openNav} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Anagrafica shop</CardTitle>
              <CardDescription>Compare in header pagina pubblica, promemoria e ricevute.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Nome barbershop</Label>
                  <Input value={shop.name} onChange={(e) => setShop((s) => ({ ...s, name: e.target.value, slug: slugify(e.target.value) }))} />
                  <div className="mt-1 text-xs text-white/40">
                    Link pubblico: <code className="text-[color:var(--color-gold-200)]">/book/{shop.slug}</code>
                  </div>
                </div>
                <div>
                  <Label>Città</Label>
                  <Input value={shop.city ?? ""} onChange={(e) => setShop((s) => ({ ...s, city: e.target.value }))} />
                </div>
                <div>
                  <Label>Telefono</Label>
                  <Input value={shop.phone ?? ""} onChange={(e) => setShop((s) => ({ ...s, phone: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <Label>Indirizzo</Label>
                  <Input value={shop.address ?? ""} onChange={(e) => setShop((s) => ({ ...s, address: e.target.value }))} />
                </div>
                <div className="col-span-2">
                  <Label>Email di contatto</Label>
                  <Input type="email" value={shop.email ?? ""} onChange={(e) => setShop((s) => ({ ...s, email: e.target.value }))} />
                </div>
                <div>
                  <Label>Slot (min)</Label>
                  <Input type="number" min={5} step={5} value={shop.slotMinutes} onChange={(e) => setShop((s) => ({ ...s, slotMinutes: Number(e.target.value) || 15 }))} />
                </div>
              </div>
              <Button variant="gold" onClick={saveShop} className="self-end">
                <Save className="h-4 w-4" /> Salva anagrafica
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Orari settimana</CardTitle>
              <CardDescription>Gli slot vengono calcolati sui giorni aperti.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DAYS.map((d) => {
                const h = hours[d.key];
                return (
                  <div key={d.key} className="grid grid-cols-[100px_60px_1fr] items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                    <div className="text-sm text-white/85">{d.label}</div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={h.open}
                        onCheckedChange={(v) => setHours((prev) => ({ ...prev, [d.key]: { ...prev[d.key], open: v } }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        disabled={!h.open}
                        value={h.from}
                        onChange={(e) => setHours((prev) => ({ ...prev, [d.key]: { ...prev[d.key], from: e.target.value } }))}
                        className="h-9 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white disabled:opacity-40"
                      />
                      <span className="text-white/40">→</span>
                      <input
                        type="time"
                        disabled={!h.open}
                        value={h.to}
                        onChange={(e) => setHours((prev) => ({ ...prev, [d.key]: { ...prev[d.key], to: e.target.value } }))}
                        className="h-9 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white disabled:opacity-40"
                      />
                    </div>
                  </div>
                );
              })}
              <Button variant="gold" onClick={saveHours} className="mt-2">
                <Save className="h-4 w-4" /> Salva orari
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Servizi & listino</CardTitle>
              <CardDescription>Attivi qui si mostrano al cliente sulla pagina pubblica.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={addService}><Plus className="h-4 w-4" /> Aggiungi</Button>
              <Button variant="gold" onClick={saveServices}><Save className="h-4 w-4" /> Salva</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="pb-2 pr-3">Nome</th>
                    <th className="pb-2 pr-3">Durata (min)</th>
                    <th className="pb-2 pr-3">Prezzo €</th>
                    <th className="pb-2 pr-3">Attivo</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {services.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="py-2 pr-3">
                        <Input value={s.name} onChange={(e) => setServices((all) => all.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} />
                      </td>
                      <td className="py-2 pr-3 w-32">
                        <Input type="number" min={5} step={5} value={s.durationMin} onChange={(e) => setServices((all) => all.map((x, i) => i === idx ? { ...x, durationMin: Number(e.target.value) || 30 } : x))} />
                      </td>
                      <td className="py-2 pr-3 w-32">
                        <Input type="number" min={0} step={1} value={s.priceEur} onChange={(e) => setServices((all) => all.map((x, i) => i === idx ? { ...x, priceEur: Number(e.target.value) || 0 } : x))} />
                        <div className="mt-0.5 text-[10px] text-white/40">{formatEUR(s.priceEur)}</div>
                      </td>
                      <td className="py-2 pr-3">
                        <Switch checked={s.active} onCheckedChange={(v) => setServices((all) => all.map((x, i) => i === idx ? { ...x, active: v } : x))} />
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setServices((all) => all.filter((_, i) => i !== idx))}
                          aria-label="Rimuovi"
                        >
                          <Trash2 className="h-4 w-4 text-rose-300" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Reset demo</CardTitle>
              <CardDescription>Ripristina i dati dimostrativi di partenza.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="danger"
              onClick={() => {
                store.resetDemo();
                toast.info("Dati demo ripristinati");
              }}
            >
              Ripristina dati demo
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
