"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArchiveIcon,
  DownloadIcon,
  FileTextIcon,
  PrinterIcon,
  RulerIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import {
  GIOCHI_PREDEFINITI,
  calcolaPorta,
  configurazionePortaSchema,
  configurazionePredefinita,
} from "@/lib/door-engine";
import type {
  ConfigurazionePorta,
  ConfigurazionePortaInput,
  ModelloPorta,
  PortaSalvata,
} from "@/lib/door-engine";
import { archivio } from "@/lib/archivio";
import { dimensioni } from "@/lib/formato";
import { DoorSchematic } from "./door-schematic";
import { SchedaProduzione } from "./scheda-produzione";

type Vista = "configura" | "scheda" | "archivio";

type ErroriCampo = Record<string, string>;

function SegmentedControl<T extends string>({
  label,
  opzioni,
  valore,
  onChange,
}: {
  label: string;
  opzioni: ReadonlyArray<{ value: T; label: string }>;
  valore: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-1 rounded-xl bg-sand p-1"
      >
        {opzioni.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={valore === o.value}
            onClick={() => onChange(o.value)}
            className={`seg-btn ${
              valore === o.value
                ? "bg-ink text-paper shadow"
                : "text-steel/70 hover:bg-white/60"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CampoNumerico({
  id,
  label,
  valore,
  onChange,
  errore,
  suffisso = "mm",
}: {
  id: string;
  label: string;
  valore: number;
  onChange: (v: number) => void;
  errore?: string;
  suffisso?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          className={`field-input pr-12 ${errore ? "border-err ring-2 ring-err/20" : ""}`}
          value={Number.isFinite(valore) ? valore : ""}
          onChange={(e) => onChange(e.target.value === "" ? Number.NaN : Number(e.target.value))}
          aria-invalid={Boolean(errore)}
          aria-describedby={errore ? `${id}-errore` : undefined}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-steel/50">
          {suffisso}
        </span>
      </div>
      {errore && (
        <p id={`${id}-errore`} className="mt-1 text-xs font-medium text-err">
          {errore}
        </p>
      )}
    </div>
  );
}

function Interruttore({
  id,
  label,
  descrizione,
  attivo,
  onChange,
}: {
  id: string;
  label: string;
  descrizione: string;
  attivo: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={attivo}
      onClick={() => onChange(!attivo)}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition ${
        attivo ? "border-brass bg-brass/10" : "border-steel/15 bg-white"
      }`}
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-steel/60">{descrizione}</span>
      </span>
      <span
        aria-hidden
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${attivo ? "bg-brass" : "bg-steel/25"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            attivo ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function Configuratore() {
  const [vista, setVista] = useState<Vista>("configura");
  const [config, setConfig] = useState<ConfigurazionePortaInput>(() =>
    configurazionePredefinita("interna"),
  );
  const [avanzateAperte, setAvanzateAperte] = useState(false);
  const [salvate, setSalvate] = useState<PortaSalvata[] | null>(null);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const schedaRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(() => configurazionePortaSchema.safeParse(config), [config]);

  const errori: ErroriCampo = useMemo(() => {
    if (parsed.success) return {};
    const out: ErroriCampo = {};
    for (const issue of parsed.error.issues) {
      const chiave = issue.path.join(".");
      if (!out[chiave]) out[chiave] = issue.message;
    }
    return out;
  }, [parsed]);

  const risultato = useMemo(
    () => (parsed.success ? calcolaPorta(parsed.data) : null),
    [parsed],
  );

  function aggiorna<K extends keyof ConfigurazionePortaInput>(
    campo: K,
    valore: ConfigurazionePortaInput[K],
  ) {
    setConfig((prev) => ({ ...prev, [campo]: valore }));
  }

  function aggiornaGioco(campo: keyof ConfigurazionePorta["giochi"], valore: number) {
    setConfig((prev) => ({
      ...prev,
      giochi: { ...(prev.giochi as ConfigurazionePorta["giochi"]), [campo]: valore },
    }));
  }

  function cambiaModello(modello: ModelloPorta) {
    setConfig((prev) => ({ ...prev, modello, giochi: GIOCHI_PREDEFINITI[modello] }));
  }

  function notifica(testo: string) {
    setMessaggio(testo);
    window.setTimeout(() => setMessaggio(null), 2500);
  }

  function caricaArchivio() {
    setSalvate(archivio.elenca());
  }

  function salvaInArchivio() {
    if (!parsed.success || !risultato) return;
    const porta: PortaSalvata = {
      id: crypto.randomUUID(),
      creataIl: new Date().toISOString(),
      configurazione: parsed.data,
      risultato,
    };
    archivio.salva(porta);
    caricaArchivio();
    notifica("Porta salvata in archivio");
  }

  function scaricaFile(nome: string, contenuto: string, tipo: string) {
    const blob = new Blob([contenuto], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
  }

  const nomeFile = (config.nome || "porta").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  function esportaJson() {
    if (!parsed.success || !risultato) return;
    scaricaFile(
      `${nomeFile}-scheda.json`,
      JSON.stringify({ configurazione: parsed.data, risultato }, null, 2),
      "application/json",
    );
    notifica("Scheda JSON scaricata");
  }

  function esportaSvg() {
    const svg = schedaRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    scaricaFile(
      `${nomeFile}-schema.svg`,
      `<?xml version="1.0" encoding="UTF-8"?>\n${clone.outerHTML}`,
      "image/svg+xml",
    );
    notifica("Disegno SVG scaricato");
  }

  const codiceScheda = useMemo(() => {
    if (!risultato) return "—";
    const mano = risultato.latoCerniere === "destra" ? "DX" : "SX";
    return `P-${risultato.anta.larghezza}x${risultato.anta.altezza}-${mano}`;
  }, [risultato]);

  const dataOggi = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const erroreGlobale = risultato?.avvisi.find((a) => a.livello === "errore");

  return (
    <div className="mx-auto min-h-dvh max-w-3xl pb-24">
      {/* Header */}
      <header className="no-print sticky top-0 z-20 border-b border-steel/10 bg-paper/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-paper">
              <RulerIcon size={18} aria-hidden />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-tight">PortaPro</h1>
              <p className="text-[11px] text-steel/60">Dal foro muro alla produzione</p>
            </div>
          </div>
          {risultato && (
            <div className="rounded-lg bg-ink px-2.5 py-1.5 text-right text-paper">
              <p className="text-[10px] uppercase tracking-wide opacity-60">Anta</p>
              <p className="text-sm font-bold leading-none" data-testid="anta-header">
                {risultato.anta.larghezza}×{risultato.anta.altezza} mm
              </p>
            </div>
          )}
        </div>
      </header>

      {messaggio && (
        <div
          role="status"
          className="no-print fixed left-1/2 top-16 z-30 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-lg"
        >
          {messaggio}
        </div>
      )}

      {/* ============ VISTA CONFIGURA ============ */}
      {vista === "configura" && (
        <main className="space-y-4 px-4 py-4">
          {/* Anteprima */}
          <section className="card overflow-hidden" aria-label="Anteprima porta">
            <div className="bg-sand/60 px-4 pt-3">
              <div className="mx-auto max-w-[300px]">
                {risultato ? (
                  <DoorSchematic
                    config={parsed.success ? parsed.data : (config as ConfigurazionePorta)}
                    risultato={risultato}
                    quote={false}
                  />
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center gap-2 px-6 text-center">
                    <p className="text-sm font-medium text-steel/60">
                      Correggi per vedere l&apos;anteprima:
                    </p>
                    <ul className="space-y-1">
                      {Object.values(errori).map((msg) => (
                        <li key={msg} className="text-xs font-medium text-err">
                          ⛔ {msg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {risultato && (
              <div className="grid grid-cols-3 divide-x divide-steel/10 border-t border-steel/10 text-center">
                <div className="p-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-steel/50">Anta</p>
                  <p className="text-sm font-bold" data-testid="anta-riepilogo">
                    {dimensioni(risultato.anta.larghezza, risultato.anta.altezza)}
                  </p>
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-steel/50">Luce netta</p>
                  <p className="text-sm font-bold" data-testid="luce-riepilogo">
                    {dimensioni(risultato.luceNetta.larghezza, risultato.luceNetta.altezza)}
                  </p>
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] uppercase tracking-wide text-steel/50">Apertura</p>
                  <p className="text-sm font-bold" data-testid="apertura-riepilogo">
                    {risultato.etichettaApertura}
                  </p>
                </div>
              </div>
            )}
            {erroreGlobale && (
              <p className="border-t border-err/20 bg-err/10 px-4 py-2 text-xs font-medium text-err">
                ⛔ {erroreGlobale.messaggio}
              </p>
            )}
          </section>

          {/* Avvisi non bloccanti */}
          {risultato && risultato.avvisi.some((a) => a.livello === "avviso") && (
            <div className="space-y-1" role="alert">
              {risultato.avvisi
                .filter((a) => a.livello === "avviso")
                .map((a) => (
                  <p
                    key={a.codice}
                    className="rounded-xl border border-warn/25 bg-warn/10 px-3 py-2 text-xs font-medium text-warn"
                  >
                    ⚠ {a.messaggio}
                  </p>
                ))}
            </div>
          )}

          {/* Modello */}
          <section className="card space-y-3 p-4" aria-labelledby="sez-modello">
            <h2 id="sez-modello" className="text-sm font-bold uppercase tracking-wide text-brass">
              1 · Modello porta
            </h2>
            <SegmentedControl
              label="Tipo"
              opzioni={[
                { value: "interna", label: "Interna" },
                { value: "ingresso", label: "Ingresso" },
              ]}
              valore={(config.modello ?? "interna") as ModelloPorta}
              onChange={cambiaModello}
            />
            <div>
              <label htmlFor="nome" className="field-label">
                Nome commessa (facoltativo)
              </label>
              <input
                id="nome"
                type="text"
                className="field-input"
                placeholder="Es. Cliente Rossi — bagno piano 1"
                value={config.nome ?? ""}
                onChange={(e) => aggiorna("nome", e.target.value)}
              />
            </div>
          </section>

          {/* Misure vano */}
          <section className="card space-y-3 p-4" aria-labelledby="sez-vano">
            <h2 id="sez-vano" className="text-sm font-bold uppercase tracking-wide text-brass">
              2 · Foro muro (vano grezzo)
            </h2>
            <p className="text-xs text-steel/60">
              Misura il buco nella parete: larghezza tra i muri e altezza dal pavimento finito
              al filo inferiore dell&apos;architrave. L&apos;app detrae automaticamente aria di
              posa e telaio (l&apos;opera morta).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <CampoNumerico
                id="foro-larghezza"
                label="Larghezza foro"
                valore={config.foroLarghezza as number}
                onChange={(v) => aggiorna("foroLarghezza", v)}
                errore={errori["foroLarghezza"]}
              />
              <CampoNumerico
                id="foro-altezza"
                label="Altezza foro"
                valore={config.foroAltezza as number}
                onChange={(v) => aggiorna("foroAltezza", v)}
                errore={errori["foroAltezza"]}
              />
            </div>
            <CampoNumerico
              id="spessore-muro"
              label="Spessore muro finito"
              valore={config.spessoreMuro as number}
              onChange={(v) => aggiorna("spessoreMuro", v)}
              errore={errori["spessoreMuro"]}
            />
          </section>

          {/* Apertura */}
          <section className="card space-y-3 p-4" aria-labelledby="sez-apertura">
            <h2 id="sez-apertura" className="text-sm font-bold uppercase tracking-wide text-brass">
              3 · Senso di apertura
            </h2>
            <p className="text-xs text-steel/60">
              Guarda la porta dal lato in cui vedi le cerniere: se sono a destra la mano è
              destra, se sono a sinistra la mano è sinistra. La maniglia va sul lato opposto.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <SegmentedControl
                label="Mano (lato cerniere)"
                opzioni={[
                  { value: "sinistra", label: "Sinistra" },
                  { value: "destra", label: "Destra" },
                ]}
                valore={(config.mano ?? "destra") as "destra" | "sinistra"}
                onChange={(v) => aggiorna("mano", v)}
              />
              <SegmentedControl
                label="Verso"
                opzioni={[
                  { value: "spingere", label: "Spingere" },
                  { value: "tirare", label: "Tirare" },
                ]}
                valore={(config.verso ?? "spingere") as "spingere" | "tirare"}
                onChange={(v) => aggiorna("verso", v)}
              />
            </div>
            {risultato && (
              <p className="rounded-xl bg-sand px-3 py-2 text-xs">
                <strong>{risultato.etichettaApertura}</strong> — cerniere a{" "}
                <strong>{risultato.latoCerniere}</strong>, maniglia a{" "}
                <strong>{risultato.latoManiglia}</strong>.
              </p>
            )}
          </section>

          {/* Composizione */}
          <section className="card space-y-3 p-4" aria-labelledby="sez-composizione">
            <h2
              id="sez-composizione"
              className="text-sm font-bold uppercase tracking-wide text-brass"
            >
              4 · Composizione
            </h2>
            <SegmentedControl
              label="Fisso laterale"
              opzioni={[
                { value: "nessuno", label: "No" },
                { value: "sinistra", label: "Sx" },
                { value: "destra", label: "Dx" },
                { value: "entrambi", label: "Sx+Dx" },
              ]}
              valore={(config.fissoPosizione ?? "nessuno") as ConfigurazionePorta["fissoPosizione"]}
              onChange={(v) => aggiorna("fissoPosizione", v)}
            />
            {config.fissoPosizione !== "nessuno" && (
              <CampoNumerico
                id="fisso-larghezza"
                label="Larghezza fisso (per modulo)"
                valore={config.fissoLarghezza as number}
                onChange={(v) => aggiorna("fissoLarghezza", v)}
                errore={errori["fissoLarghezza"]}
              />
            )}
            <SegmentedControl
              label="Sopraluce"
              opzioni={[
                { value: "nessuno", label: "No" },
                { value: "fisso", label: "Fisso" },
                { value: "compasso", label: "A compasso" },
              ]}
              valore={(config.sopraluceTipo ?? "nessuno") as ConfigurazionePorta["sopraluceTipo"]}
              onChange={(v) => aggiorna("sopraluceTipo", v)}
            />
            {config.sopraluceTipo !== "nessuno" && (
              <CampoNumerico
                id="sopraluce-altezza"
                label="Altezza sopraluce"
                valore={config.sopraluceAltezza as number}
                onChange={(v) => aggiorna("sopraluceAltezza", v)}
                errore={errori["sopraluceAltezza"]}
              />
            )}
            <div className="grid gap-2">
              <Interruttore
                id="vetro-display"
                label="Display vetrato"
                descrizione="Fascia in vetro verticale nell'anta"
                attivo={Boolean(config.vetroDisplay)}
                onChange={(v) => aggiorna("vetroDisplay", v)}
              />
              <Interruttore
                id="oblo"
                label="Oblò ovale"
                descrizione="Vetro ovale nella parte alta dell'anta"
                attivo={Boolean(config.oblo)}
                onChange={(v) => aggiorna("oblo", v)}
              />
            </div>
          </section>

          {/* Avanzate */}
          <section className="card p-4" aria-labelledby="sez-avanzate">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              aria-expanded={avanzateAperte}
              onClick={() => setAvanzateAperte((v) => !v)}
            >
              <h2
                id="sez-avanzate"
                className="text-sm font-bold uppercase tracking-wide text-brass"
              >
                5 · Opera morta (avanzate)
              </h2>
              <span className="text-steel/50">{avanzateAperte ? "−" : "+"}</span>
            </button>
            {avanzateAperte && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <CampoNumerico
                  id="aria-laterale"
                  label="Aria posa laterale"
                  valore={config.giochi?.ariaLaterale as number}
                  onChange={(v) => aggiornaGioco("ariaLaterale", v)}
                  errore={errori["giochi.ariaLaterale"]}
                />
                <CampoNumerico
                  id="aria-superiore"
                  label="Aria posa superiore"
                  valore={config.giochi?.ariaSuperiore as number}
                  onChange={(v) => aggiornaGioco("ariaSuperiore", v)}
                  errore={errori["giochi.ariaSuperiore"]}
                />
                <CampoNumerico
                  id="montante"
                  label="Montante telaio"
                  valore={config.giochi?.montanteTelaio as number}
                  onChange={(v) => aggiornaGioco("montanteTelaio", v)}
                  errore={errori["giochi.montanteTelaio"]}
                />
                <CampoNumerico
                  id="traverso"
                  label="Traverso telaio"
                  valore={config.giochi?.traversoTelaio as number}
                  onChange={(v) => aggiornaGioco("traversoTelaio", v)}
                  errore={errori["giochi.traversoTelaio"]}
                />
                <CampoNumerico
                  id="battuta"
                  label="Battuta anta"
                  valore={config.giochi?.battuta as number}
                  onChange={(v) => aggiornaGioco("battuta", v)}
                  errore={errori["giochi.battuta"]}
                />
                <CampoNumerico
                  id="gioco-pavimento"
                  label="Gioco pavimento"
                  valore={config.giochi?.giocoPavimento as number}
                  onChange={(v) => aggiornaGioco("giocoPavimento", v)}
                  errore={errori["giochi.giocoPavimento"]}
                />
              </div>
            )}
          </section>

          <button
            type="button"
            onClick={() => setVista("scheda")}
            disabled={!risultato || Boolean(erroreGlobale)}
            className="w-full rounded-2xl bg-ink py-3.5 text-base font-semibold text-paper shadow-lg transition enabled:hover:bg-steel disabled:opacity-40"
          >
            Genera scheda di produzione →
          </button>
        </main>
      )}

      {/* ============ VISTA SCHEDA ============ */}
      {vista === "scheda" && (
        <main className="space-y-4 px-4 py-4">
          {risultato && parsed.success ? (
            <>
              <div ref={schedaRef}>
                <SchedaProduzione
                  config={parsed.data}
                  risultato={risultato}
                  codice={codiceScheda}
                  data={dataOggi}
                />
              </div>
              <div className="no-print grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-semibold text-paper"
                >
                  <PrinterIcon size={16} aria-hidden /> Stampa / PDF
                </button>
                <button
                  type="button"
                  onClick={esportaJson}
                  className="flex items-center justify-center gap-2 rounded-xl border border-steel/20 bg-white py-3 text-sm font-semibold"
                >
                  <DownloadIcon size={16} aria-hidden /> JSON
                </button>
                <button
                  type="button"
                  onClick={esportaSvg}
                  className="flex items-center justify-center gap-2 rounded-xl border border-steel/20 bg-white py-3 text-sm font-semibold"
                >
                  <FileTextIcon size={16} aria-hidden /> Disegno SVG
                </button>
                <button
                  type="button"
                  onClick={salvaInArchivio}
                  className="flex items-center justify-center gap-2 rounded-xl border border-steel/20 bg-white py-3 text-sm font-semibold"
                >
                  <SaveIcon size={16} aria-hidden /> Salva
                </button>
              </div>
            </>
          ) : (
            <p className="card p-6 text-center text-sm text-steel/60">
              Correggi prima gli errori nella configurazione.
            </p>
          )}
        </main>
      )}

      {/* ============ VISTA ARCHIVIO ============ */}
      {vista === "archivio" && (
        <main className="space-y-3 px-4 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-brass">
            Porte salvate su questo dispositivo
          </h2>
          {(salvate ?? archivio.elenca()).length === 0 ? (
            <p className="card p-6 text-center text-sm text-steel/60">
              Nessuna porta in archivio. Genera una scheda e premi «Salva».
            </p>
          ) : (
            (salvate ?? archivio.elenca()).map((p) => (
              <article key={p.id} className="card flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {p.configurazione.nome || "Porta senza nome"}
                  </p>
                  <p className="text-xs text-steel/60">
                    Anta {dimensioni(p.risultato.anta.larghezza, p.risultato.anta.altezza)} ·{" "}
                    {p.risultato.etichettaApertura} ·{" "}
                    {new Date(p.creataIl).toLocaleDateString("it-IT")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setConfig(p.configurazione);
                    setVista("scheda");
                  }}
                  className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-paper"
                >
                  Apri
                </button>
                <button
                  type="button"
                  aria-label={`Elimina ${p.configurazione.nome || "porta"}`}
                  onClick={() => {
                    archivio.elimina(p.id);
                    caricaArchivio();
                  }}
                  className="rounded-lg border border-err/30 p-2 text-err"
                >
                  <Trash2Icon size={16} aria-hidden />
                </button>
              </article>
            ))
          )}
        </main>
      )}

      {/* Barra di navigazione mobile */}
      <nav
        aria-label="Navigazione principale"
        className="no-print safe-bottom fixed inset-x-0 bottom-0 z-20 border-t border-steel/10 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-3xl">
          {(
            [
              { id: "configura", label: "Configura", icona: RulerIcon },
              { id: "scheda", label: "Scheda", icona: FileTextIcon },
              { id: "archivio", label: "Archivio", icona: ArchiveIcon },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={vista === t.id ? "page" : undefined}
              onClick={() => {
                setVista(t.id);
                if (t.id === "archivio") caricaArchivio();
              }}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition ${
                vista === t.id ? "text-brass" : "text-steel/50"
              }`}
            >
              <t.icona size={20} aria-hidden />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
