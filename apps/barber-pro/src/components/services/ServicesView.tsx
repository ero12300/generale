"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatEUR } from "@/lib/utils";
import { Plus, Scissors, Timer, Euro } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function ServicesView({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState<Service[]>(initial);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Service | null>(null);
  const router = useRouter();

  async function refresh() {
    const res = await fetch("/api/services", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { services: Service[] };
      setServices(data.services);
    }
    router.refresh();
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => { setEdit(null); setOpen(true); }}>
          <Plus className="w-4 h-4" />
          Nuovo servizio
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Scissors className="w-6 h-6" />}
            title="Nessun servizio"
            description="Definisci il tuo listino per iniziare a ricevere prenotazioni."
            cta={<Button onClick={() => { setEdit(null); setOpen(true); }}><Plus className="w-4 h-4" />Nuovo servizio</Button>}
          />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => { setEdit(s); setOpen(true); }}
              className="glass glass-hover rounded-2xl p-5 text-left transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-500">Servizio</div>
                  <div className="text-lg font-display mt-1">{s.name}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[color:var(--color-gold-500)]/20 to-transparent border border-[color:var(--color-gold-500)]/20 grid place-items-center text-[color:var(--color-gold-400)]">
                  <Scissors className="w-4 h-4" />
                </div>
              </div>
              {s.description ? <p className="text-xs text-ink-400 mt-2 line-clamp-2">{s.description}</p> : null}
              <div className="mt-4 flex items-center gap-3 text-sm">
                <div className="inline-flex items-center gap-1 text-ink-300"><Euro className="w-3.5 h-3.5" /> {formatEUR(s.priceCents / 100)}</div>
                <div className="inline-flex items-center gap-1 text-ink-300"><Timer className="w-3.5 h-3.5" /> {s.durationMin} min</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <ServiceModal
        open={open}
        onClose={() => setOpen(false)}
        service={edit}
        onSaved={async () => {
          setOpen(false);
          await refresh();
        }}
      />
    </>
  );
}

function ServiceModal({
  open,
  onClose,
  service,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [price, setPrice] = useState(service ? String(service.priceCents / 100) : "");
  const [duration, setDuration] = useState(service ? String(service.durationMin) : "30");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    if (open) {
      setName(service?.name ?? "");
      setDescription(service?.description ?? "");
      setPrice(service ? String(service.priceCents / 100) : "");
      setDuration(service ? String(service.durationMin) : "30");
    }
  }, [service, open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cents = Math.round(parseFloat(price.replace(",", ".")) * 100);
      const dur = parseInt(duration, 10);
      if (!Number.isFinite(cents) || cents <= 0) throw new Error("Prezzo non valido");
      if (!Number.isFinite(dur) || dur <= 0) throw new Error("Durata non valida");
      const body = { name, description, priceCents: cents, durationMin: dur, active: true };
      const res = await fetch(service ? `/api/services/${service.id}` : "/api/services", {
        method: service ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      push({ kind: "success", title: service ? "Servizio aggiornato" : "Servizio creato" });
      await onSaved();
    } catch (err) {
      push({ kind: "error", title: "Errore", description: err instanceof Error ? err.message : "" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={service ? "Modifica servizio" : "Nuovo servizio"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nome">
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Taglio + Barba" />
        </Field>
        <Field label="Descrizione">
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Facoltativa" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prezzo (€)">
            <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="35,00" required />
          </Field>
          <Field label="Durata (min)">
            <Input type="number" min={5} step={5} value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
          <Button type="submit" loading={loading}>{service ? "Salva" : "Crea"}</Button>
        </div>
      </form>
    </Modal>
  );
}
