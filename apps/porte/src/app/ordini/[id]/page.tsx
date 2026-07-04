"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Printer, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { eliminaOrdine, leggiOrdine } from "@/lib/store";
import { MODELLI, VETRI } from "@/lib/modelli-porta";
import type { Ordine } from "@/lib/types";
import { formatoCm, formatoData, formatoMm } from "@/lib/utils";
import { SchemaPorta } from "@/components/porta/schema-svg";

export default function DettaglioOrdinePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [ordine, setOrdine] = React.useState<Ordine | null | undefined>(undefined);

  React.useEffect(() => {
    if (!id) return;
    const trovato = leggiOrdine(id) ?? null;
    setOrdine(trovato);
  }, [id]);

  if (ordine === undefined) {
    return <p className="text-sm text-slate-500">Caricamento…</p>;
  }
  if (ordine === null) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">Ordine non trovato.</p>
        <Link
          href="/ordini"
          className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200"
        >
          <ArrowLeft size={16} /> Torna agli ordini
        </Link>
      </div>
    );
  }

  const modello = MODELLI.find((m) => m.id === ordine.modello);
  const vetro = VETRI.find((v) => v.id === ordine.opzioni.vetro);
  const c = ordine.calcolo;

  function onElimina() {
    if (!ordine) return;
    if (!window.confirm("Eliminare definitivamente questo ordine?")) return;
    eliminaOrdine(ordine.id);
    window.location.href = "/ordini";
  }

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href="/ordini"
            className="mb-2 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft size={14} /> Ordini
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">
            {ordine.riferimento}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {ordine.cliente}
            {ordine.ambiente && ` · ${ordine.ambiente}`}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Creato il {formatoData(ordine.creatoIl)}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/ordini/${ordine.id}/scheda`}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white hover:bg-brand-600"
          >
            <FileText size={16} /> Scheda
          </Link>
          <Button variant="ghost" size="sm" onClick={onElimina} className="text-red-400">
            <Trash2 size={14} /> Elimina
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schema</CardTitle>
          <CardDescription>
            {modello?.nome} · maniglia {ordine.opzioni.maniglia === "destra" ? "DX" : "SX"} · apertura{" "}
            {ordine.opzioni.versoApertura}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchemaPorta
            dimensioni={ordine.dimensioni}
            opzioni={ordine.opzioni}
            calcolo={c}
            className="mx-auto max-w-md rounded-xl border border-slate-800"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Foro muro</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-400">Larghezza</dt>
              <dd className="text-right text-slate-100">
                {formatoCm(ordine.dimensioni.foroLarghezzaCm)}
              </dd>
              <dt className="text-slate-400">Altezza</dt>
              <dd className="text-right text-slate-100">
                {formatoCm(ordine.dimensioni.foroAltezzaCm)}
              </dd>
              <dt className="text-slate-400">Spessore muro</dt>
              <dd className="text-right text-slate-100">
                {formatoCm(ordine.dimensioni.spessoreMuroCm)}
              </dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anta</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-400">Larghezza</dt>
              <dd className="text-right font-semibold text-slate-50">
                {formatoCm(c.anta.larghezzaCm)}
              </dd>
              <dt className="text-slate-400">Altezza</dt>
              <dd className="text-right font-semibold text-slate-50">
                {formatoCm(c.anta.altezzaCm)}
              </dd>
              <dt className="text-slate-400">Spessore</dt>
              <dd className="text-right text-slate-100">{formatoMm(c.anta.spessoreMm)}</dd>
              <dt className="text-slate-400">Luce netta</dt>
              <dd className="text-right text-slate-100">{formatoCm(c.luceNettaCm)}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Telaio</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-400">Larghezza</dt>
              <dd className="text-right text-slate-100">{formatoCm(c.telaio.larghezzaCm)}</dd>
              <dt className="text-slate-400">Altezza</dt>
              <dd className="text-right text-slate-100">{formatoCm(c.telaio.altezzaCm)}</dd>
              <dt className="text-slate-400">Profondità cons.</dt>
              <dd className="text-right text-slate-100">
                {formatoMm(c.telaio.profondita.consigliatoMm)}
              </dd>
              <dt className="text-slate-400">Battuta</dt>
              <dd className="text-right text-slate-100">{formatoMm(c.telaio.battutaMm)}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coprifilo</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-400">Tipo</dt>
              <dd className="text-right text-slate-100 capitalize">{c.coprifilo.tipo}</dd>
              {c.coprifilo.tipo !== "nessuno" && (
                <>
                  <dt className="text-slate-400">Larghezza</dt>
                  <dd className="text-right text-slate-100">
                    {formatoMm(c.coprifilo.larghezzaMm)}
                  </dd>
                </>
              )}
              {c.coprifilo.telescopicoRangeMm && (
                <>
                  <dt className="text-slate-400">Range telesc.</dt>
                  <dd className="text-right text-slate-100">
                    {c.coprifilo.telescopicoRangeMm[0]}–{c.coprifilo.telescopicoRangeMm[1]} mm
                  </dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>

        {c.fisso && (
          <Card>
            <CardHeader>
              <CardTitle>Pannello fisso</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-slate-400">Larghezza</dt>
                <dd className="text-right text-slate-100">{formatoCm(c.fisso.larghezzaCm)}</dd>
                <dt className="text-slate-400">Altezza</dt>
                <dd className="text-right text-slate-100">{formatoCm(c.fisso.altezzaCm)}</dd>
                <dt className="text-slate-400">Posizione</dt>
                <dd className="text-right text-slate-100">
                  {ordine.opzioni.maniglia === "destra" ? "SX" : "DX"}
                </dd>
              </dl>
            </CardContent>
          </Card>
        )}

        {c.sopraluce && (
          <Card>
            <CardHeader>
              <CardTitle>Sopraluce</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-slate-400">Larghezza</dt>
                <dd className="text-right text-slate-100">
                  {formatoCm(c.sopraluce.larghezzaCm)}
                </dd>
                <dt className="text-slate-400">Altezza</dt>
                <dd className="text-right text-slate-100">
                  {formatoCm(c.sopraluce.altezzaCm)}
                </dd>
              </dl>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configurazione</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-slate-400">Modello</dt>
              <dd className="text-right text-slate-100">{modello?.nome}</dd>
              <dt className="text-slate-400">Vetro</dt>
              <dd className="text-right text-slate-100">{vetro?.nome}</dd>
              <dt className="text-slate-400">Maniglia</dt>
              <dd className="text-right text-slate-100">
                {ordine.opzioni.maniglia === "destra" ? "DX" : "SX"}
              </dd>
              <dt className="text-slate-400">Cerniere</dt>
              <dd className="text-right text-slate-100">
                {ordine.opzioni.maniglia === "destra" ? "SX" : "DX"}
              </dd>
              <dt className="text-slate-400">Apertura</dt>
              <dd className="text-right text-slate-100 capitalize">
                {ordine.opzioni.versoApertura}
              </dd>
              <dt className="text-slate-400">Bussola</dt>
              <dd className="text-right text-slate-100">
                {ordine.opzioni.bussola ? "Sì" : "No"}
              </dd>
            </dl>
          </CardContent>
        </Card>
      </div>

      {ordine.note && (
        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{ordine.note}</p>
          </CardContent>
        </Card>
      )}

      {c.avvertenze.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avvertenze</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {c.avvertenze.map((av, i) => {
              const color =
                av.livello === "errore"
                  ? "border-red-500/40 bg-red-500/10 text-red-300"
                  : av.livello === "attenzione"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                    : "border-brand-500/40 bg-brand-500/10 text-brand-200";
              return (
                <div key={i} className={`rounded-xl border p-3 text-sm ${color}`}>
                  {av.messaggio}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="pt-2">
        <Link
          href={`/ordini/${ordine.id}/scheda`}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 font-semibold text-white shadow shadow-brand-500/20 hover:bg-brand-600"
        >
          <Printer size={18} /> Apri scheda di produzione
        </Link>
      </div>
    </div>
  );
}
