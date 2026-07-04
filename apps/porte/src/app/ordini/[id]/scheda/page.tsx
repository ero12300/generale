"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { leggiOrdine } from "@/lib/store";
import type { Ordine } from "@/lib/types";
import { SchedaProduzione } from "@/components/porta/scheda-produzione";

export default function SchedaPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [ordine, setOrdine] = React.useState<Ordine | null | undefined>(undefined);

  React.useEffect(() => {
    if (!id) return;
    setOrdine(leggiOrdine(id) ?? null);
  }, [id]);

  async function onCondividi() {
    if (!ordine) return;
    const testo = costruisciTestoCondivisione(ordine);
    try {
      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      if (nav && typeof nav.share === "function") {
        await nav.share({
          title: `Porta ${ordine.riferimento}`,
          text: testo,
        });
        return;
      }
      if (nav?.clipboard) {
        await nav.clipboard.writeText(testo);
        window.alert("Scheda copiata negli appunti");
      }
    } catch {
      // Utente ha annullato la condivisione: nessuna azione richiesta.
    }
  }

  if (ordine === undefined) {
    return <p className="text-sm text-slate-500">Caricamento…</p>;
  }
  if (ordine === null) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-400">Ordine non trovato.</p>
        <Link
          href="/ordini"
          className="inline-flex items-center gap-2 text-sm text-brand-300"
        >
          <ArrowLeft size={16} /> Torna agli ordini
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/ordini/${ordine.id}`}
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft size={16} /> Torna al dettaglio
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onCondividi}>
            <Share2 size={16} /> Condividi
          </Button>
          <Button onClick={() => window.print()}>
            <Printer size={16} /> Stampa / PDF
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-2xl shadow-black/40">
        <SchedaProduzione ordine={ordine} />
      </div>

      <p className="no-print mt-4 text-center text-xs text-slate-500">
        Suggerimento: dal menu di stampa scegli &quot;Salva come PDF&quot; per esportare.
      </p>
    </div>
  );
}

function costruisciTestoCondivisione(o: Ordine): string {
  const c = o.calcolo;
  return [
    `PortePro · ${o.riferimento}`,
    `Cliente: ${o.cliente}${o.ambiente ? ` (${o.ambiente})` : ""}`,
    "",
    `Modello: ${o.modello}`,
    `Foro muro: ${o.dimensioni.foroLarghezzaCm}×${o.dimensioni.foroAltezzaCm} cm (sp. ${o.dimensioni.spessoreMuroCm} cm)`,
    `Anta: ${c.anta.larghezzaCm}×${c.anta.altezzaCm} cm (sp. ${c.anta.spessoreMm} mm)`,
    `Luce netta: ${c.luceNettaCm} cm`,
    `Maniglia: ${o.opzioni.maniglia === "destra" ? "DX" : "SX"} · Apertura: ${o.opzioni.versoApertura}`,
    `Cerniere: ${o.opzioni.maniglia === "destra" ? "SX" : "DX"}`,
    o.opzioni.bussola ? "Bussola: sì" : "",
    o.opzioni.fisso ? `Fisso: ${o.opzioni.fissoLarghezzaCm} cm` : "",
    o.opzioni.sopraluce ? `Sopraluce: ${o.opzioni.sopraluceAltezzaCm} cm` : "",
    o.opzioni.vetro !== "nessuno" ? `Vetro: ${o.opzioni.vetro}` : "",
    o.note ? `\nNote: ${o.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
