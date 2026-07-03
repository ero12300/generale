"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Clock, Sparkles } from "lucide-react";
import { useShopData } from "@/hooks/use-shop-data";
import { demoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatEuro, cn } from "@/lib/utils";
import { toast } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Service } from "@/types";

export default function ServicesPage() {
  const { services } = useShopData();
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [creating, setCreating] = React.useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-400">
            Gestisci il tuo listino: durata, prezzo, descrizione. Compare sulla
            pagina di prenotazione pubblica.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> Nuovo servizio
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {services.map((s) => (
          <div
            key={s.id}
            className={cn(
              "glass rounded-xl p-5 relative",
              s.featured && "border-[color:var(--color-gold-500)]/40"
            )}
          >
            {s.featured && (
              <div className="absolute top-4 right-4">
                <Badge variant="gold" className="text-[10px]">
                  <Sparkles className="h-2.5 w-2.5" />
                  In evidenza
                </Badge>
              </div>
            )}
            <div className="mb-3">
              <div className="text-lg font-medium text-ink-50">{s.name}</div>
              {s.description && (
                <p className="text-sm text-ink-400 mt-1">{s.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="inline-flex items-center gap-1 text-ink-300">
                <Clock className="h-3.5 w-3.5" /> {s.durationMinutes} min
              </span>
              <span className="font-display text-xl text-[color:var(--color-gold-300)]">
                {formatEuro(s.priceCents)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <Badge variant={s.active ? "success" : "default"} className="text-[10px]">
                {s.active ? "Attivo" : "Nascosto"}
              </Badge>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing(s)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    demoStore.deleteService(s.id);
                    toast({ title: "Servizio eliminato", variant: "info" });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-ink-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <ServiceDialog
          service={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ServiceDialog({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const [name, setName] = React.useState(service?.name ?? "");
  const [description, setDescription] = React.useState(service?.description ?? "");
  const [duration, setDuration] = React.useState(service?.durationMinutes ?? 30);
  const [priceEuros, setPriceEuros] = React.useState(
    service ? (service.priceCents / 100).toString() : "25"
  );
  const [featured, setFeatured] = React.useState(service?.featured ?? false);
  const [active, setActive] = React.useState(service?.active ?? true);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const price = Math.round(parseFloat(priceEuros.replace(",", ".")) * 100);
    if (!name || !price || !duration) return;
    if (service) {
      demoStore.updateService(service.id, {
        name,
        description: description || undefined,
        durationMinutes: duration,
        priceCents: price,
        featured,
        active,
      });
      toast({ title: "Servizio aggiornato", variant: "success" });
    } else {
      demoStore.createService({
        name,
        description: description || undefined,
        durationMinutes: duration,
        priceCents: price,
        featured,
        active,
      });
      toast({ title: "Servizio creato", variant: "success" });
    }
    onClose();
  }

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? "Modifica servizio" : "Nuovo servizio"}</DialogTitle>
          <DialogDescription>
            Definisci nome, prezzo e durata. I clienti vedranno queste info in
            fase di prenotazione.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="n">Nome</Label>
            <Input
              id="n"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="es. Taglio Signature"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="d">Durata (min)</Label>
              <Input
                id="d"
                type="number"
                min={5}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p">Prezzo (€)</Label>
              <Input
                id="p"
                type="text"
                inputMode="decimal"
                value={priceEuros}
                onChange={(e) => setPriceEuros(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Descrizione</Label>
            <Textarea
              id="desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Come si sente il cliente dopo? Cosa include?"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-ink-200 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded"
              />
              In evidenza
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-200 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded"
              />
              Visibile al pubblico
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit">{service ? "Salva" : "Crea"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
