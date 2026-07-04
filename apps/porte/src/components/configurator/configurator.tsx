"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DoorClosed,
  Download,
  FolderOpen,
  Printer,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import { ToggleRow } from "@/components/ui/toggle-row";
import { calcolaPorta } from "@/lib/door/engine";
import { esportaJSON, stampaScheda } from "@/lib/door/export";
import { ACCESSORI_DEFAULT, SISTEMI, getSistema } from "@/lib/door/systems";
import type { AccessoriPorta, ConfigurazionePorta, Lato, Progetto, SensoApertura } from "@/lib/door/types";
import { configurazioneSchema } from "@/lib/door/validation";
import { caricaProgetti, eliminaProgetto, salvaProgetto } from "@/lib/storage";
import { formatDate, uid } from "@/lib/utils";
import { ResultPanel } from "./result-panel";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
  suffix = "mm",
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))}
          className="pr-12"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export function Configurator() {
  const [sistemaId, setSistemaId] = useState(SISTEMI[0].id);
  const [larghezza, setLarghezza] = useState(900);
  const [altezza, setAltezza] = useState(2170);
  const [spessoreMuro, setSpessoreMuro] = useState(105);
  const [latoCerniere, setLatoCerniere] = useState<Lato>("sinistra");
  const [sensoApertura, setSensoApertura] = useState<SensoApertura>("tiro");
  const [accessori, setAccessori] = useState<AccessoriPorta>({ ...ACCESSORI_DEFAULT });

  const [nomeProgetto, setNomeProgetto] = useState("");
  const [cliente, setCliente] = useState("");
  const [note, setNote] = useState("");

  const [progetti, setProgetti] = useState<Progetto[]>([]);
  const [correnteId, setCorrenteId] = useState<string | null>(null);
  const [mostraProgetti, setMostraProgetti] = useState(false);

  useEffect(() => {
    setProgetti(caricaProgetti());
  }, []);

  const sistema = getSistema(sistemaId);

  const config: ConfigurazionePorta = useMemo(
    () => ({
      sistemaId,
      foroMuro: { larghezza, altezza, spessoreMuro },
      latoCerniere,
      sensoApertura,
      accessori,
    }),
    [sistemaId, larghezza, altezza, spessoreMuro, latoCerniere, sensoApertura, accessori]
  );

  const parsed = useMemo(() => configurazioneSchema.safeParse(config), [config]);
  const risultato = useMemo(
    () => (parsed.success ? calcolaPorta(config, sistema) : null),
    [parsed.success, config, sistema]
  );

  const erroriValidazione = parsed.success ? [] : parsed.error.issues.map((i) => i.message);

  function aggiornaAccessori(patch: Partial<AccessoriPorta>) {
    setAccessori((a) => ({ ...a, ...patch }));
  }

  function reset() {
    setSistemaId(SISTEMI[0].id);
    setLarghezza(900);
    setAltezza(2170);
    setSpessoreMuro(105);
    setLatoCerniere("sinistra");
    setSensoApertura("tiro");
    setAccessori({ ...ACCESSORI_DEFAULT });
    setNomeProgetto("");
    setCliente("");
    setNote("");
    setCorrenteId(null);
  }

  function salva() {
    const id = correnteId ?? uid();
    const progetto: Progetto = {
      id,
      nome: nomeProgetto.trim() || `Porta ${larghezza}×${altezza}`,
      cliente: cliente.trim(),
      note: note.trim(),
      configurazione: config,
      creatoIl: new Date().toISOString(),
    };
    setProgetti(salvaProgetto(progetto));
    setCorrenteId(id);
  }

  function apri(p: Progetto) {
    const c = p.configurazione;
    setSistemaId(c.sistemaId);
    setLarghezza(c.foroMuro.larghezza);
    setAltezza(c.foroMuro.altezza);
    setSpessoreMuro(c.foroMuro.spessoreMuro);
    setLatoCerniere(c.latoCerniere);
    setSensoApertura(c.sensoApertura);
    setAccessori({ ...c.accessori });
    setNomeProgetto(p.nome);
    setCliente(p.cliente);
    setNote(p.note);
    setCorrenteId(p.id);
    setMostraProgetti(false);
  }

  function elimina(id: string) {
    setProgetti(eliminaProgetto(id));
    if (correnteId === id) setCorrenteId(null);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 pb-24 pt-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Colonna sinistra: form (nascosta in stampa) */}
        <div className="no-print space-y-4">
          <Section title="Sistema porta">
            <div className="grid grid-cols-1 gap-2">
              {SISTEMI.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSistemaId(s.id)}
                  className={`rounded-xl border p-3 text-left transition-colors touch-manipulation ${
                    s.id === sistemaId
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <DoorClosed className="h-4 w-4 text-blue-600" /> {s.nome}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">{s.descrizione}</span>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Foro muro (vano)">
            <div className="grid grid-cols-2 gap-3">
              <NumberField id="larghezza" label="Larghezza" value={larghezza} onChange={setLarghezza} />
              <NumberField id="altezza" label="Altezza" value={altezza} onChange={setAltezza} />
            </div>
            <NumberField id="spessore" label="Spessore muro" value={spessoreMuro} onChange={setSpessoreMuro} />
          </Section>

          <Section title="Verso di apertura">
            <div className="space-y-1.5">
              <Label>Lato cerniere</Label>
              <Segmented<Lato>
                aria-label="Lato cerniere"
                value={latoCerniere}
                onValueChange={setLatoCerniere}
                options={[
                  { value: "sinistra", label: "Sinistra" },
                  { value: "destra", label: "Destra" },
                ]}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Senso apertura</Label>
              <Segmented<SensoApertura>
                aria-label="Senso apertura"
                value={sensoApertura}
                onValueChange={setSensoApertura}
                options={[
                  { value: "tiro", label: "Tiro" },
                  { value: "spinta", label: "Spinta" },
                ]}
              />
            </div>
            <p className="text-xs text-slate-500">
              La maniglia viene posizionata automaticamente sul lato opposto alle cerniere.
            </p>
          </Section>

          <Section title="Modello e accessori">
            <ToggleRow
              id="bussola"
              label="Bussola / doppia anta"
              description="Due ante a battente che si incontrano al centro"
              checked={accessori.bussola}
              onCheckedChange={(v) => aggiornaAccessori({ bussola: v })}
            />
            <ToggleRow
              id="fisso"
              label="Fisso laterale"
              description="Pannello fisso a fianco dell'anta"
              checked={accessori.fissoLaterale}
              onCheckedChange={(v) => aggiornaAccessori({ fissoLaterale: v })}
            />
            {accessori.fissoLaterale ? (
              <NumberField
                id="larghezzaFisso"
                label="Luce fisso laterale"
                value={accessori.larghezzaFisso}
                onChange={(v) => aggiornaAccessori({ larghezzaFisso: v })}
              />
            ) : null}
            <ToggleRow
              id="sopraluce"
              label="Sopraluce"
              description="Imposta / lunetta sopra la porta"
              checked={accessori.sopraluce}
              onCheckedChange={(v) => aggiornaAccessori({ sopraluce: v })}
            />
            {accessori.sopraluce ? (
              <NumberField
                id="altezzaSopraluce"
                label="Altezza sopraluce"
                value={accessori.altezzaSopraluce}
                onChange={(v) => aggiornaAccessori({ altezzaSopraluce: v })}
              />
            ) : null}
            <ToggleRow
              id="vetro"
              label="Anta vetrata"
              description="Specchiatura in vetro"
              checked={accessori.vetro}
              onCheckedChange={(v) => aggiornaAccessori({ vetro: v })}
            />
            <ToggleRow
              id="ovale"
              label="Ovale"
              description="Oblò / inserto ovale decorativo"
              checked={accessori.ovale}
              onCheckedChange={(v) => aggiornaAccessori({ ovale: v })}
            />
          </Section>

          <Section title="Dati commessa">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome progetto</Label>
              <Input id="nome" value={nomeProgetto} onChange={(e) => setNomeProgetto(e.target.value)} placeholder="Es. Camera 1 — Rossi" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Es. Sig. Rossi" />
            </div>
          </Section>
        </div>

        {/* Colonna destra: risultato + azioni */}
        <div className="space-y-4">
          {erroriValidazione.length > 0 ? (
            <div className="no-print rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="mb-1 text-sm font-semibold text-red-700">Controlla i dati inseriti</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                {erroriValidazione.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {risultato ? (
            <ResultPanel r={risultato} nomeProgetto={nomeProgetto} cliente={cliente} />
          ) : null}

          <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button onClick={salva} disabled={!risultato} className="w-full">
              <Save /> Salva
            </Button>
            <Button
              variant="secondary"
              onClick={() => risultato && esportaJSON(nomeProgetto, config, risultato)}
              disabled={!risultato}
              className="w-full"
            >
              <Download /> Export
            </Button>
            <Button variant="secondary" onClick={stampaScheda} disabled={!risultato} className="w-full">
              <Printer /> Stampa
            </Button>
            <Button variant="ghost" onClick={reset} className="w-full">
              <RotateCcw /> Reset
            </Button>
          </div>

          <div className="no-print">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMostraProgetti((v) => !v)}
            >
              <FolderOpen /> Progetti salvati ({progetti.length})
            </Button>
            {mostraProgetti ? (
              <div className="mt-2 space-y-2">
                {progetti.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-400">
                    Nessun progetto salvato.
                  </p>
                ) : (
                  progetti.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <button type="button" onClick={() => apri(p)} className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-medium text-slate-800">{p.nome}</span>
                        <span className="block truncate text-xs text-slate-500">
                          {p.cliente ? `${p.cliente} · ` : ""}
                          {p.configurazione.foroMuro.larghezza}×{p.configurazione.foroMuro.altezza} mm ·{" "}
                          {formatDate(p.creatoIl)}
                        </span>
                      </button>
                      <Button variant="ghost" size="icon" onClick={() => elimina(p.id)} aria-label="Elimina progetto">
                        <Trash2 className="text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
