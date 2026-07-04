"use client";

import { useEffect, useMemo, useState } from "react";
import { calcolaPorta, ETICHETTE_MODELLO } from "@/lib/calcolo";
import { CONFIG_INIZIALE, schemaConfigurazione } from "@/lib/schema";
import type { ConfigurazionePorta, ModelloPorta, RisultatoCalcolo } from "@/lib/tipi";
import { DisegnoPianta } from "./DisegnoPianta";
import { DisegnoProspetto } from "./DisegnoProspetto";
import { SchedaProduzione } from "./SchedaProduzione";

const CHIAVE_ARCHIVIO = "portelab.commesse.v1";

interface CommessaSalvata {
  id: string;
  salvataIl: string;
  config: ConfigurazionePorta;
}

type Vista = "configura" | "scheda";

const MODELLI: { valore: ModelloPorta; descrizione: string }[] = [
  { valore: "battente", descrizione: "La porta classica a 1 anta girevole" },
  { valore: "bussola", descrizione: "2 ante: una apribile + una semifissa" },
  { valore: "scorrevole_scomparsa", descrizione: "Scorre dentro il muro (controtelaio)" },
  { valore: "scorrevole_esterno", descrizione: "Scorre esterno muro su binario" },
  { valore: "ventola", descrizione: "Va e vieni bidirezionale (tipo saloon)" },
];

function CampoNumerico({
  id,
  etichetta,
  valore,
  onChange,
  unita = "mm",
  errore,
}: {
  id: string;
  etichetta: string;
  valore: number;
  onChange: (v: number) => void;
  unita?: string;
  errore?: string;
}) {
  const [testo, setTesto] = useState(Number.isFinite(valore) ? String(valore) : "");

  useEffect(() => {
    if (Number.isFinite(valore) && String(valore) !== testo) {
      setTesto(String(valore));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valore]);

  return (
    <div className="flex-1">
      <label htmlFor={id} className="mb-1 block text-[13px] font-medium text-slate-600">
        {etichetta}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={testo}
          onChange={(e) => {
            const pulito = e.target.value.replace(/[^\d]/g, "");
            setTesto(pulito);
            onChange(pulito === "" ? Number.NaN : Number.parseInt(pulito, 10));
          }}
          aria-invalid={Boolean(errore)}
          aria-describedby={errore ? `${id}-errore` : undefined}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 pr-12 font-mono text-base outline-none transition focus:ring-2 focus:ring-tecnico ${
            errore ? "border-errore" : "border-slate-300"
          }`}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
          {unita}
        </span>
      </div>
      {errore && (
        <p id={`${id}-errore`} className="mt-1 text-xs font-medium text-errore">
          {errore}
        </p>
      )}
    </div>
  );
}

function Interruttore({
  id,
  etichetta,
  attivo,
  onChange,
}: {
  id: string;
  etichetta: string;
  attivo: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 py-1">
      <span className="text-[15px] font-semibold">{etichetta}</span>
      <span className="relative inline-flex">
        <input
          id={id}
          type="checkbox"
          checked={attivo}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-tecnico peer-focus-visible:ring-2 peer-focus-visible:ring-tecnico peer-focus-visible:ring-offset-2" />
        <span className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function GruppoScelta<T extends string>({
  nome,
  opzioni,
  valore,
  onChange,
}: {
  nome: string;
  opzioni: { valore: T; etichetta: string }[];
  valore: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={nome} className="grid grid-cols-2 gap-2">
      {opzioni.map((o) => (
        <label
          key={o.valore}
          className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tecnico ${
            valore === o.valore
              ? "border-tecnico bg-tecnico-soft text-tecnico"
              : "border-slate-300 bg-white text-slate-600"
          }`}
        >
          <input
            type="radio"
            name={nome}
            value={o.valore}
            checked={valore === o.valore}
            onChange={() => onChange(o.valore)}
            className="sr-only"
          />
          {o.etichetta}
        </label>
      ))}
    </div>
  );
}

function Sezione({ titolo, passo, children }: { titolo: string; passo: number; children: React.ReactNode }) {
  return (
    <section aria-label={titolo} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tecnico text-xs font-bold text-white">
          {passo}
        </span>
        {titolo}
      </h2>
      {children}
    </section>
  );
}

function scaricaJson(config: ConfigurazionePorta, risultato: RisultatoCalcolo) {
  const contenuto = {
    generatoIl: new Date().toISOString(),
    applicazione: "PortaLab",
    unitaMisura: "mm",
    configurazione: config,
    risultato,
  };
  const blob = new Blob([JSON.stringify(contenuto, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `porta_${(config.commessa || "commessa").replace(/\s+/g, "_").toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Configuratore() {
  const [config, setConfig] = useState<ConfigurazionePorta>(CONFIG_INIZIALE);
  const [vista, setVista] = useState<Vista>("configura");
  const [inviato, setInviato] = useState(false);
  const [archivio, setArchivio] = useState<CommessaSalvata[]>([]);
  const [archivioCaricato, setArchivioCaricato] = useState(false);
  const [messaggio, setMessaggio] = useState<string | null>(null);

  useEffect(() => {
    try {
      const grezzo = window.localStorage.getItem(CHIAVE_ARCHIVIO);
      if (grezzo) setArchivio(JSON.parse(grezzo) as CommessaSalvata[]);
    } catch {
      // archivio corrotto: si riparte da vuoto
    }
    setArchivioCaricato(true);
  }, []);

  useEffect(() => {
    if (!messaggio) return;
    const timer = window.setTimeout(() => setMessaggio(null), 2500);
    return () => window.clearTimeout(timer);
  }, [messaggio]);

  const validazione = useMemo(() => schemaConfigurazione.safeParse(config), [config]);
  const erroriCampi = useMemo(() => {
    if (validazione.success) return {} as Record<string, string>;
    const mappa: Record<string, string> = {};
    for (const problema of validazione.error.issues) {
      mappa[problema.path.join(".")] = problema.message;
    }
    return mappa;
  }, [validazione]);

  const risultato = useMemo(
    () => (validazione.success ? calcolaPorta(validazione.data) : null),
    [validazione]
  );

  const scorrevole =
    config.modello === "scorrevole_scomparsa" || config.modello === "scorrevole_esterno";
  const mostraErrore = (campo: string) => (inviato ? erroriCampi[campo] : undefined);

  function aggiorna(parziale: Partial<ConfigurazionePorta>) {
    setConfig((precedente) => ({ ...precedente, ...parziale }));
  }

  function generaScheda() {
    setInviato(true);
    if (!validazione.success) {
      setMessaggio("Controlla i campi evidenziati in rosso.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setVista("scheda");
    window.scrollTo({ top: 0 });
  }

  function salvaCommessa() {
    setInviato(true);
    if (!validazione.success) {
      setMessaggio("Controlla i campi evidenziati in rosso.");
      return;
    }
    const voce: CommessaSalvata = {
      id: `${Date.now()}`,
      salvataIl: new Date().toISOString(),
      config: validazione.data,
    };
    const nuovo = [voce, ...archivio].slice(0, 50);
    setArchivio(nuovo);
    window.localStorage.setItem(CHIAVE_ARCHIVIO, JSON.stringify(nuovo));
    setMessaggio("Commessa salvata nell'archivio.");
  }

  function eliminaCommessa(id: string) {
    const nuovo = archivio.filter((c) => c.id !== id);
    setArchivio(nuovo);
    window.localStorage.setItem(CHIAVE_ARCHIVIO, JSON.stringify(nuovo));
  }

  if (vista === "scheda" && risultato) {
    return (
      <div className="mx-auto max-w-3xl px-3 pb-28 pt-4 sm:px-6">
        <SchedaProduzione config={config} risultato={risultato} />
        <div className="no-print fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl gap-2">
            <button
              type="button"
              onClick={() => setVista("configura")}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-tecnico"
            >
              ← Modifica
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 rounded-xl bg-tecnico px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-tecnico focus-visible:ring-offset-2"
            >
              Stampa / PDF
            </button>
            <button
              type="button"
              onClick={() => scaricaJson(config, risultato)}
              className="rounded-xl border border-tecnico bg-white px-4 py-3 text-sm font-bold text-tecnico transition hover:bg-tecnico-soft focus-visible:ring-2 focus-visible:ring-tecnico"
            >
              Esporta JSON
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 pb-32 pt-4 sm:px-6">
      <header className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tecnico">PortaLab</p>
        <h1 className="text-2xl font-bold leading-tight">Configuratore porte per produzione</h1>
        <p className="mt-1 text-sm text-slate-500">
          Inserisci il vano vuoto nel muro: calcoliamo anta, telaio e opera morta, con verso di
          apertura e scheda pronta per la produzione.
        </p>
      </header>

      {messaggio && (
        <p role="status" className="mb-3 rounded-xl bg-tecnico-soft px-4 py-2.5 text-sm font-semibold text-tecnico">
          {messaggio}
        </p>
      )}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          generaScheda();
        }}
      >
        <Sezione titolo="Commessa e foro muro (vano vuoto)" passo={1}>
          <div className="space-y-3">
            <div>
              <label htmlFor="commessa" className="mb-1 block text-[13px] font-medium text-slate-600">
                Nome commessa / cliente
              </label>
              <input
                id="commessa"
                type="text"
                value={config.commessa}
                onChange={(e) => aggiorna({ commessa: e.target.value })}
                placeholder="Es. Cantiere Rossi — bagno piano 1"
                aria-invalid={Boolean(mostraErrore("commessa"))}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-base outline-none transition focus:ring-2 focus:ring-tecnico ${
                  mostraErrore("commessa") ? "border-errore" : "border-slate-300"
                }`}
              />
              {mostraErrore("commessa") && (
                <p className="mt-1 text-xs font-medium text-errore">{erroriCampi["commessa"]}</p>
              )}
            </div>
            <div className="flex gap-2">
              <CampoNumerico
                id="fm-larghezza"
                etichetta="Larghezza foro"
                valore={config.foroMuro.larghezza}
                onChange={(v) => aggiorna({ foroMuro: { ...config.foroMuro, larghezza: v } })}
                errore={mostraErrore("foroMuro.larghezza")}
              />
              <CampoNumerico
                id="fm-altezza"
                etichetta="Altezza foro"
                valore={config.foroMuro.altezza}
                onChange={(v) => aggiorna({ foroMuro: { ...config.foroMuro, altezza: v } })}
                errore={mostraErrore("foroMuro.altezza")}
              />
              <CampoNumerico
                id="fm-spessore"
                etichetta="Spessore muro"
                valore={config.foroMuro.spessoreMuro}
                onChange={(v) => aggiorna({ foroMuro: { ...config.foroMuro, spessoreMuro: v } })}
                errore={mostraErrore("foroMuro.spessoreMuro")}
              />
            </div>
          </div>
        </Sezione>

        <Sezione titolo="Modello porta" passo={2}>
          <div role="radiogroup" aria-label="Modello porta" className="space-y-2">
            {MODELLI.map((m) => (
              <label
                key={m.valore}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tecnico ${
                  config.modello === m.valore
                    ? "border-tecnico bg-tecnico-soft"
                    : "border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="modello"
                  value={m.valore}
                  checked={config.modello === m.valore}
                  onChange={() => aggiorna({ modello: m.valore })}
                  className="h-4 w-4 accent-[#1d4ed8]"
                />
                <span>
                  <span className="block text-[15px] font-semibold">{ETICHETTE_MODELLO[m.valore]}</span>
                  <span className="block text-[13px] text-slate-500">{m.descrizione}</span>
                </span>
              </label>
            ))}
          </div>
        </Sezione>

        <Sezione titolo="Verso di apertura e maniglia" passo={3}>
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-slate-600">
                {scorrevole ? "Direzione di scorrimento" : "Lato cardini (guardando la porta dal lato a spingere)"}
              </p>
              <GruppoScelta
                nome="lato-apertura"
                valore={config.apertura.lato}
                onChange={(lato) => aggiorna({ apertura: { ...config.apertura, lato } })}
                opzioni={[
                  { valore: "destra", etichetta: "Destra" },
                  { valore: "sinistra", etichetta: "Sinistra" },
                ]}
              />
            </div>
            {!scorrevole && config.modello !== "ventola" && (
              <div>
                <p className="mb-1.5 text-[13px] font-medium text-slate-600">Movimento</p>
                <GruppoScelta
                  nome="movimento"
                  valore={config.apertura.movimento}
                  onChange={(movimento) => aggiorna({ apertura: { ...config.apertura, movimento } })}
                  opzioni={[
                    { valore: "spingere", etichetta: "A spingere" },
                    { valore: "tirare", etichetta: "A tirare" },
                  ]}
                />
              </div>
            )}
            {risultato && !scorrevole && config.modello !== "ventola" && (
              <p className="rounded-xl bg-slate-100 px-3 py-2 text-[13px] font-medium text-slate-600">
                → Apertura <strong>{risultato.ferramenta.descrizioneApertura.toLowerCase()}</strong>:
                cerniere a <strong>{risultato.ferramenta.latoCerniere}</strong>, maniglia a{" "}
                <strong>{risultato.ferramenta.latoManiglia}</strong>.
              </p>
            )}
            {!scorrevole && config.modello !== "ventola" && (
              <div className="flex gap-2">
                <CampoNumerico
                  id="quota-maniglia"
                  etichetta="Quota maniglia da terra"
                  valore={config.altezzaManiglia}
                  onChange={(v) => aggiorna({ altezzaManiglia: v })}
                  errore={mostraErrore("altezzaManiglia")}
                />
              </div>
            )}
          </div>
        </Sezione>

        <Sezione titolo="Opzioni: fisso, display, oblò" passo={4}>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 p-3">
              <Interruttore
                id="fisso"
                etichetta="Pannello fisso laterale"
                attivo={config.fisso.presente}
                onChange={(presente) => aggiorna({ fisso: { ...config.fisso, presente } })}
              />
              {config.fisso.presente && (
                <div className="mt-3 space-y-3">
                  <GruppoScelta
                    nome="lato-fisso"
                    valore={config.fisso.lato}
                    onChange={(lato) => aggiorna({ fisso: { ...config.fisso, lato } })}
                    opzioni={[
                      { valore: "destra", etichetta: "Fisso a destra" },
                      { valore: "sinistra", etichetta: "Fisso a sinistra" },
                    ]}
                  />
                  <CampoNumerico
                    id="fisso-larghezza"
                    etichetta="Larghezza fisso"
                    valore={config.fisso.larghezza}
                    onChange={(v) => aggiorna({ fisso: { ...config.fisso, larghezza: v } })}
                    errore={mostraErrore("fisso.larghezza")}
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <Interruttore
                id="display"
                etichetta="Display (sopraluce vetrato)"
                attivo={config.display.presente}
                onChange={(presente) => aggiorna({ display: { ...config.display, presente } })}
              />
              {config.display.presente && (
                <div className="mt-3">
                  <CampoNumerico
                    id="display-altezza"
                    etichetta="Altezza display"
                    valore={config.display.altezza}
                    onChange={(v) => aggiorna({ display: { ...config.display, altezza: v } })}
                    errore={mostraErrore("display.altezza")}
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <Interruttore
                id="oblo"
                etichetta="Oblò in vetro"
                attivo={config.oblo.presente}
                onChange={(presente) => aggiorna({ oblo: { ...config.oblo, presente } })}
              />
              {config.oblo.presente && (
                <div className="mt-3 space-y-3">
                  <GruppoScelta
                    nome="forma-oblo"
                    valore={config.oblo.forma}
                    onChange={(forma) => aggiorna({ oblo: { ...config.oblo, forma } })}
                    opzioni={[
                      { valore: "tondo", etichetta: "Tondo" },
                      { valore: "quadro", etichetta: "Quadro" },
                    ]}
                  />
                  <div className="flex gap-2">
                    <CampoNumerico
                      id="oblo-dimensione"
                      etichetta={config.oblo.forma === "tondo" ? "Diametro" : "Lato"}
                      valore={config.oblo.dimensione}
                      onChange={(v) => aggiorna({ oblo: { ...config.oblo, dimensione: v } })}
                      errore={mostraErrore("oblo.dimensione")}
                    />
                    <CampoNumerico
                      id="oblo-centro"
                      etichetta="Centro da terra"
                      valore={config.oblo.altezzaCentro}
                      onChange={(v) => aggiorna({ oblo: { ...config.oblo, altezzaCentro: v } })}
                      errore={mostraErrore("oblo.altezzaCentro")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Sezione>

        <Sezione titolo="Porta calcolata" passo={5}>
          {!risultato && (
            <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-medium text-avviso">
              Completa i campi con misure valide per vedere il calcolo.
            </p>
          )}
          {risultato && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-tecnico-soft px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-tecnico">Anta</p>
                  <p className="font-mono text-lg font-bold text-tecnico">
                    {risultato.anta.larghezza}×{risultato.anta.altezza}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {risultato.antaSemifissa ? "Semifissa" : "Luce passaggio"}
                  </p>
                  <p className="font-mono text-lg font-bold">
                    {risultato.antaSemifissa
                      ? `${risultato.antaSemifissa.larghezza}×${risultato.antaSemifissa.altezza}`
                      : `${risultato.lucePassaggio.larghezza}×${risultato.lucePassaggio.altezza}`}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Esterno telaio
                  </p>
                  <p className="font-mono text-lg font-bold">
                    {risultato.esternoTelaio.larghezza}×{risultato.esternoTelaio.altezza}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Opera morta
                  </p>
                  <p className="font-mono text-lg font-bold">
                    {risultato.controtelaio.larghezza}×{risultato.controtelaio.altezza}
                  </p>
                </div>
              </div>

              {risultato.errori.map((e) => (
                <p key={e} className="rounded-xl bg-red-50 px-3 py-2 text-[13px] font-medium text-errore">
                  ✕ {e}
                </p>
              ))}
              {risultato.avvisi.map((a) => (
                <p key={a} className="rounded-xl bg-amber-50 px-3 py-2 text-[13px] font-medium text-avviso">
                  ⚠ {a}
                </p>
              ))}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-2">
                  <DisegnoProspetto config={config} risultato={risultato} />
                </div>
                <div className="rounded-xl border border-slate-200 p-2">
                  <DisegnoPianta config={config} risultato={risultato} />
                </div>
              </div>
            </div>
          )}
        </Sezione>
      </form>

      <section aria-label="Archivio commesse" className="mt-6">
        <h2 className="mb-2 text-[15px] font-bold">Archivio commesse</h2>
        {!archivioCaricato && <p className="text-sm text-slate-400">Caricamento archivio…</p>}
        {archivioCaricato && archivio.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-400">
            Nessuna commessa salvata. Configura una porta e premi «Salva».
          </p>
        )}
        <ul className="space-y-2">
          {archivio.map((voce) => (
            <li
              key={voce.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{voce.config.commessa}</p>
                <p className="text-xs text-slate-400">
                  {ETICHETTE_MODELLO[voce.config.modello]} · foro {voce.config.foroMuro.larghezza}×
                  {voce.config.foroMuro.altezza} ·{" "}
                  {new Date(voce.salvataIl).toLocaleDateString("it-IT")}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setConfig(voce.config);
                    setInviato(false);
                    setMessaggio("Commessa caricata.");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-lg border border-tecnico px-3 py-1.5 text-xs font-bold text-tecnico transition hover:bg-tecnico-soft focus-visible:ring-2 focus-visible:ring-tecnico"
                >
                  Apri
                </button>
                <button
                  type="button"
                  onClick={() => eliminaCommessa(voce.id)}
                  aria-label={`Elimina commessa ${voce.config.commessa}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-tecnico"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="no-print fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2">
          <button
            type="button"
            onClick={salvaCommessa}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-tecnico"
          >
            Salva
          </button>
          <button
            type="button"
            onClick={generaScheda}
            disabled={Boolean(risultato && !risultato.ok)}
            className="flex-1 rounded-xl bg-tecnico px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-tecnico focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {risultato && !risultato.ok ? "Correggi gli errori per produrre" : "Genera scheda produzione →"}
          </button>
        </div>
      </div>
    </div>
  );
}
