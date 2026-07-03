"use client";

import { useState } from "react";
import { Plus, Trash2, Scissors, Lock, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/lib/store/WorkspaceProvider";
import { formatCents, parseEuroToCents } from "@/lib/format";

export default function ServicesPage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast("Inserisci il nome del servizio", "error");
    const priceCents = parseEuroToCents(price);
    if (priceCents <= 0) return toast("Inserisci un prezzo valido", "error");
    const res = ws.addService({
      name: name.trim(),
      description: description.trim() || undefined,
      priceCents,
      durationMin: Number(duration) || 30,
      active: true,
    });
    if (!res.ok) return toast(res.error ?? "Errore", "error");
    toast("Servizio aggiunto", "success");
    setName(""); setDescription(""); setPrice(""); setDuration("30");
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Servizi"
        subtitle="Il listino del tuo salone"
        action={
          <button
            className="btn-gold"
            onClick={() => (ws.canAddService ? setOpen(true) : toast(`Limite piano ${ws.plan.name} raggiunto. Passa a Pro.`, "error"))}
          >
            {ws.canAddService ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Nuovo servizio
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ws.services.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/20 bg-gold/5 text-gold-soft">
                <Scissors className="h-5 w-5" />
              </span>
              <button
                onClick={() => { ws.removeService(s.id); toast("Servizio eliminato", "info"); }}
                className="rounded-lg p-2 text-cream/40 transition hover:bg-red-500/10 hover:text-red-400"
                aria-label={`Elimina ${s.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-3 font-display text-lg text-cream">{s.name}</h3>
            {s.description ? <p className="mt-1 text-sm text-cream/50">{s.description}</p> : null}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-2xl text-gold-soft">{formatCents(s.priceCents)}</span>
              <span className="flex items-center gap-1 text-xs text-cream/50">
                <Clock className="h-3.5 w-3.5" /> {s.durationMin} min
              </span>
            </div>
            <label className="mt-4 flex items-center gap-2 text-xs text-cream/60">
              <input
                type="checkbox"
                checked={s.active}
                onChange={() => ws.updateService(s.id, { active: !s.active })}
                className="h-4 w-4 accent-[#c9a227]"
              />
              Attivo (prenotabile)
            </label>
          </div>
        ))}
        {ws.services.length === 0 ? (
          <p className="col-span-full py-10 text-center text-sm text-cream/40">Nessun servizio. Aggiungi il primo!</p>
        ) : null}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Nuovo servizio"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(false)}>Annulla</button>
            <button className="btn-gold" form="service-form" type="submit">Salva</button>
          </>
        }
      >
        <form id="service-form" onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="s-name">Nome</label>
            <input id="s-name" value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Es. Taglio + Barba" />
          </div>
          <div>
            <label className="label" htmlFor="s-desc">Descrizione</label>
            <input id="s-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="s-price">Prezzo (€)</label>
              <input id="s-price" value={price} onChange={(e) => setPrice(e.target.value)} className="field" placeholder="25,00" inputMode="decimal" />
            </div>
            <div>
              <label className="label" htmlFor="s-dur">Durata (min)</label>
              <input id="s-dur" type="number" min={5} step={5} value={duration} onChange={(e) => setDuration(e.target.value)} className="field" />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
