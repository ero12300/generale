"use client";

import { useState } from "react";
import { Save, RotateCcw, Scissors, Plus, Check } from "lucide-react";
import { PageHeader } from "@/components/dashboard/shell";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useStore } from "@/lib/store/store-context";
import { eur, parseEuroToCents } from "@/lib/money";
import type { Service, ServiceCategory } from "@/lib/types";
import { uid } from "@/lib/utils";

const DAYS = [
  { i: 1, l: "Lun" }, { i: 2, l: "Mar" }, { i: 3, l: "Mer" }, { i: 4, l: "Gio" },
  { i: 5, l: "Ven" }, { i: 6, l: "Sab" }, { i: 0, l: "Dom" },
];

export default function ImpostazioniPage() {
  const { state, updateSettings, upsertService, resetDemo } = useStore();
  const s = state.settings;
  const [saved, setSaved] = useState(false);
  const [showService, setShowService] = useState(false);

  const [form, setForm] = useState({
    shopName: s.shopName,
    ownerName: s.ownerName,
    address: s.address,
    phone: s.phone,
    openHour: s.openHour,
    closeHour: s.closeHour,
    slotMinutes: s.slotMinutes,
    workingDays: s.workingDays,
  });

  function toggleDay(i: number) {
    setForm((f) => ({
      ...f,
      workingDays: f.workingDays.includes(i)
        ? f.workingDays.filter((d) => d !== i)
        : [...f.workingDays, i],
    }));
  }

  function save() {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="p-5 md:p-8">
      <PageHeader title="Impostazioni" subtitle="Configura la tua barberia, gli orari e i servizi." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-4">Dati barberia</CardTitle>
          <div className="space-y-4">
            <Field label="Nome barberia"><Input value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Titolare"><Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} /></Field>
              <Field label="Telefono"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
            </div>
            <Field label="Indirizzo"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Orari e agenda</CardTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Apertura">
              <Select value={form.openHour} onChange={(e) => setForm({ ...form, openHour: Number(e.target.value) })}>
                {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i}:00</option>)}
              </Select>
            </Field>
            <Field label="Chiusura">
              <Select value={form.closeHour} onChange={(e) => setForm({ ...form, closeHour: Number(e.target.value) })}>
                {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{i}:00</option>)}
              </Select>
            </Field>
            <Field label="Durata slot">
              <Select value={form.slotMinutes} onChange={(e) => setForm({ ...form, slotMinutes: Number(e.target.value) })}>
                {[15, 20, 30, 45, 60].map((m) => <option key={m} value={m}>{m} min</option>)}
              </Select>
            </Field>
          </div>
          <p className="mb-2 mt-4 text-sm font-medium">Giorni di apertura</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d.i}
                onClick={() => toggleDay(d.i)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  form.workingDays.includes(d.i)
                    ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold-soft)]"
                    : "border-border bg-surface text-muted"
                }`}
              >
                {d.l}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={save}>{saved ? <><Check size={16} /> Salvato</> : <><Save size={16} /> Salva impostazioni</>}</Button>
      </div>

      {/* Services */}
      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>Listino servizi</CardTitle>
          <Button size="sm" variant="subtle" onClick={() => setShowService(true)}><Plus size={16} /> Aggiungi servizio</Button>
        </div>
        <div className="divide-y divide-border">
          {state.services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gold)]/12 text-[var(--gold)]"><Scissors size={16} /></span>
                <div>
                  <div className="text-sm font-medium">{svc.name}</div>
                  <div className="text-xs text-muted">{svc.durationMin} min · {svc.category}</div>
                </div>
              </div>
              <span className="font-semibold text-[var(--gold-soft)]">{eur(svc.priceCents)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger / demo */}
      <Card className="mt-6 border-[var(--danger)]/30">
        <CardTitle className="mb-2">Dati demo</CardTitle>
        <p className="text-sm text-muted">Ripristina i dati di esempio (prenotazioni, clienti, campagne). Utile per fare una demo pulita.</p>
        <Button className="mt-4" variant="danger" size="sm" onClick={() => { if (confirm("Ripristinare i dati demo? Le modifiche andranno perse.")) resetDemo(); }}>
          <RotateCcw size={15} /> Ripristina dati demo
        </Button>
      </Card>

      {showService && (
        <NewServiceModal
          onClose={() => setShowService(false)}
          onCreate={(svc) => { upsertService(svc); setShowService(false); }}
        />
      )}
    </div>
  );
}

function NewServiceModal({ onClose, onCreate }: { onClose: () => void; onCreate: (s: Service) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");
  const [category, setCategory] = useState<ServiceCategory>("capelli");

  function submit() {
    if (!name || !price) return;
    onCreate({
      id: uid("svc"),
      name,
      category,
      durationMin: Number(duration),
      priceCents: parseEuroToCents(price),
      active: true,
    });
  }

  return (
    <Modal open onClose={onClose} title="Nuovo servizio">
      <div className="space-y-4">
        <Field label="Nome servizio"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Taglio + Shampoo" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prezzo (€)"><Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="25,00" /></Field>
          <Field label="Durata">
            <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
              {[15, 20, 30, 45, 60, 90].map((m) => <option key={m} value={m}>{m} min</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Categoria">
          <Select value={category} onChange={(e) => setCategory(e.target.value as ServiceCategory)}>
            <option value="capelli">Capelli</option>
            <option value="barba">Barba</option>
            <option value="combo">Combo</option>
            <option value="trattamenti">Trattamenti</option>
            <option value="altro">Altro</option>
          </Select>
        </Field>
        <Button className="w-full" size="lg" disabled={!name || !price} onClick={submit}>
          <Plus size={18} /> Aggiungi servizio
        </Button>
      </div>
    </Modal>
  );
}
