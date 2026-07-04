"use client";

import { useState, useRef } from "react";
import type {
  ConfigurazionePorta,
  TipologiaPorta,
  AperturaPorta,
  VersoApertura,
  TipoVetro,
  PosizioneManigliaPorta,
} from "@/lib/porte/types";
import { calcolaDimensioniPorta, descrizioneTipologia, descrizioneVetro } from "@/lib/porte/calcoli";
import type { DimensioniPorta } from "@/lib/porte/types";
import { SchemaSvg } from "./schema-svg";

type Step = "vano" | "tipo" | "opzioni" | "risultato";

const stepOrdine: Step[] = ["vano", "tipo", "opzioni", "risultato"];

const tipologiePorta: TipologiaPorta[] = [
  "battente",
  "battente_fisso",
  "battente_sopraluce",
  "battente_fisso_sopraluce",
  "doppia_battente",
];

function CardOpzione({
  selezionato,
  onClick,
  children,
  descrizione,
}: {
  selezionato: boolean;
  onClick: () => void;
  children: React.ReactNode;
  descrizione?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
        selezionato
          ? "border-amber-500 bg-amber-500/10"
          : "border-zinc-700 bg-zinc-800/60 hover:border-zinc-500"
      }`}
    >
      <div className="font-semibold text-sm">{children}</div>
      {descrizione && <div className="text-xs text-zinc-400 mt-1">{descrizione}</div>}
    </button>
  );
}

function InputMm({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
      {hint && <p className="text-xs text-zinc-500 mb-2">{hint}</p>}
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-600 px-4 py-3 pr-14 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          inputMode="numeric"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
          mm
        </span>
      </div>
    </div>
  );
}

function RigaDimensione({ etichetta, valore, evidenziato }: { etichetta: string; valore: string; evidenziato?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2.5 px-3 rounded-lg ${evidenziato ? "bg-amber-500/10 border border-amber-500/30" : "bg-zinc-800/60"}`}>
      <span className={`text-sm ${evidenziato ? "text-amber-400 font-medium" : "text-zinc-400"}`}>{etichetta}</span>
      <span className={`text-sm font-mono font-bold ${evidenziato ? "text-amber-300" : "text-white"}`}>{valore}</span>
    </div>
  );
}

export function Configuratore() {
  const [step, setStep] = useState<Step>("vano");
  const [larghezza, setLarghezza] = useState("");
  const [altezza, setAltezza] = useState("");
  const [spessore, setSpessore] = useState("120");
  const [tipologia, setTipologia] = useState<TipologiaPorta>("battente");
  const [apertura, setApertura] = useState<AperturaPorta>("destra");
  const [verso, setVerso] = useState<VersoApertura>("verso");
  const [vetro, setVetro] = useState<TipoVetro>("nessuno");
  const [maniglia, setManiglia] = useState<PosizioneManigliaPorta>("sinistra");
  const [risultato, setRisultato] = useState<DimensioniPorta | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const stepCorrente = stepOrdine.indexOf(step);

  function avanti() {
    if (step === "opzioni") {
      const cfg: ConfigurazionePorta = {
        vano: {
          larghezzaVano: parseInt(larghezza),
          altezzaVano: parseInt(altezza),
          spessoreMuro: parseInt(spessore),
        },
        tipologia,
        apertura,
        versoApertura: verso,
        tipoVetro: vetro,
        posizioneManigliaPorta: maniglia,
        conCerniere: true,
        conSerratura: true,
      };
      setRisultato(calcolaDimensioniPorta(cfg));
    }
    const idx = stepOrdine.indexOf(step);
    if (idx < stepOrdine.length - 1) {
      setStep(stepOrdine[idx + 1]);
    }
  }

  function indietro() {
    const idx = stepOrdine.indexOf(step);
    if (idx > 0) setStep(stepOrdine[idx - 1]);
  }

  function reset() {
    setStep("vano");
    setRisultato(null);
    setLarghezza("");
    setAltezza("");
    setSpessore("120");
    setTipologia("battente");
    setApertura("destra");
    setVerso("verso");
    setVetro("nessuno");
    setManiglia("sinistra");
  }

  function puoiAvanzare(): boolean {
    if (step === "vano") {
      const l = parseInt(larghezza);
      const h = parseInt(altezza);
      const s = parseInt(spessore);
      return l > 0 && h > 0 && s > 0;
    }
    return true;
  }

  function esportaSVG() {
    if (!svgRef.current) return;
    const svg = svgRef.current.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `porta-${tipologia}-${larghezza}x${altezza}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function stampaPDF() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-zinc-800 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-amber-400">🚪 Configuratore Porte</h1>
              <p className="text-xs text-zinc-500">Calcolo dimensioni per produzione</p>
            </div>
            {step !== "vano" && (
              <button
                type="button"
                onClick={reset}
                className="text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-3 py-1.5 transition"
              >
                Ricomincia
              </button>
            )}
          </div>
          {/* Progress bar */}
          <div className="flex gap-1.5">
            {stepOrdine.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i <= stepCorrente ? "bg-amber-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["Vano", "Tipo", "Opzioni", "Risultato"].map((l, i) => (
              <span
                key={l}
                className={`text-[10px] ${i === stepCorrente ? "text-amber-400 font-semibold" : "text-zinc-600"}`}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* STEP 1: VANO */}
        {step === "vano" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">Misure vano muro</h2>
              <p className="text-sm text-zinc-400">
                Misura il foro nel muro in almeno 3 punti e inserisci il valore più piccolo.
              </p>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400 text-lg">📐</span>
                <span className="text-sm font-medium text-zinc-300">Come misurare</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Misura larghezza in alto, centro e basso → prendi il minore</li>
                <li>Misura altezza a sinistra, centro e destra → prendi il minore</li>
                <li>Misura lo spessore del muro (escluso l&apos;intonaco)</li>
                <li>Include eventuali architravi e soglie</li>
              </ul>
            </div>

            <InputMm
              label="Larghezza vano (L)"
              value={larghezza}
              onChange={setLarghezza}
              placeholder="es. 900"
              hint="Distanza orizzontale interna del foro muro"
            />
            <InputMm
              label="Altezza vano (H)"
              value={altezza}
              onChange={setAltezza}
              placeholder="es. 2100"
              hint="Distanza verticale dal pavimento finito all'architrave"
            />
            <InputMm
              label="Spessore muro"
              value={spessore}
              onChange={setSpessore}
              placeholder="es. 120"
              hint="Necessario per scegliere il telaio corretto"
            />

            {larghezza && altezza && (
              <div className="bg-zinc-900 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs text-zinc-400">
                  Vano inserito:{" "}
                  <span className="text-amber-400 font-bold">{larghezza} × {altezza} mm</span>
                  {" — "}Spessore muro:{" "}
                  <span className="text-amber-400 font-bold">{spessore} mm</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: TIPO PORTA */}
        {step === "tipo" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Tipologia porta</h2>
              <p className="text-sm text-zinc-400">
                Scegli la configurazione strutturale della porta.
              </p>
            </div>

            <div className="space-y-2.5">
              {tipologiePorta.map((t) => (
                <CardOpzione
                  key={t}
                  selezionato={tipologia === t}
                  onClick={() => setTipologia(t)}
                  descrizione={tipoDescrizione(t)}
                >
                  {tipoIcona(t)} {descrizioneTipologia(t)}
                </CardOpzione>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: OPZIONI */}
        {step === "opzioni" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Opzioni porta</h2>
              <p className="text-sm text-zinc-400">Configura vetro, apertura e maniglia.</p>
            </div>

            {/* Vetro */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Tipo di vetro</h3>
              <div className="grid grid-cols-2 gap-2">
                {(["nessuno", "intero", "ovale", "parziale"] as TipoVetro[]).map((v) => (
                  <CardOpzione
                    key={v}
                    selezionato={vetro === v}
                    onClick={() => setVetro(v)}
                  >
                    {vetroIcona(v)} {descrizioneVetro(v)}
                  </CardOpzione>
                ))}
              </div>
            </div>

            {/* Apertura */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Lato cerniere (apertura)</h3>
              <p className="text-xs text-zinc-500 mb-2">
                Guardando la porta dal lato in cui si apre verso di te, le cerniere sono a:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <CardOpzione selezionato={apertura === "sinistra"} onClick={() => setApertura("sinistra")}>
                  ◀ Sinistra
                </CardOpzione>
                <CardOpzione selezionato={apertura === "destra"} onClick={() => setApertura("destra")}>
                  Destra ▶
                </CardOpzione>
              </div>
            </div>

            {/* Verso apertura */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Senso di apertura</h3>
              <p className="text-xs text-zinc-500 mb-2">
                Stando davanti alla porta, essa si apre:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <CardOpzione selezionato={verso === "verso"} onClick={() => setVerso("verso")} descrizione="Si apre verso di te (entrando spingi)">
                  ↙ Verso di me
                </CardOpzione>
                <CardOpzione selezionato={verso === "lontano"} onClick={() => setVerso("lontano")} descrizione="Si apre lontano da te (entrando tiri)">
                  ↗ Lontano da me
                </CardOpzione>
              </div>
            </div>

            {/* Maniglia */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Posizione maniglia</h3>
              <p className="text-xs text-zinc-500 mb-2">
                Su quale lato dell&apos;anta è montata la maniglia:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <CardOpzione selezionato={maniglia === "sinistra"} onClick={() => setManiglia("sinistra")}>
                  ◀ Maniglia sinistra
                </CardOpzione>
                <CardOpzione selezionato={maniglia === "destra"} onClick={() => setManiglia("destra")}>
                  Maniglia destra ▶
                </CardOpzione>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: RISULTATO */}
        {step === "risultato" && risultato && (
          <div className="space-y-5 print:space-y-3">
            <div className="print:hidden">
              <h2 className="text-xl font-bold mb-1">Schema porta — Produzione</h2>
              <p className="text-sm text-zinc-400">
                {descrizioneTipologia(tipologia)} • {descrizioneVetro(vetro)}
              </p>
            </div>

            {/* Schema SVG */}
            <div ref={svgRef} className="rounded-xl overflow-hidden border border-zinc-700">
              <SchemaSvg dimensioni={risultato} />
            </div>

            {/* Avvisi */}
            {risultato.avvisi.length > 0 && (
              <div className="space-y-1.5">
                {risultato.avvisi.map((a, i) => (
                  <div key={i} className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2 text-xs text-amber-300">
                    {a}
                  </div>
                ))}
              </div>
            )}

            {/* Tabella dimensioni */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide">Dimensioni di produzione</h3>

              <div className="space-y-1.5">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-1">Vano muro</p>
                <RigaDimensione etichetta="Larghezza vano" valore={`${risultato.larghezzaVano} mm`} />
                <RigaDimensione etichetta="Altezza vano" valore={`${risultato.altezzaVano} mm`} />
                <RigaDimensione etichetta="Spessore muro" valore={`${risultato.spessoreMuro} mm`} />

                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-2">Controtelaio</p>
                <RigaDimensione etichetta="Larghezza controtelaio" valore={`${risultato.larghezzaControtelaio} mm`} />
                <RigaDimensione etichetta="Altezza controtelaio" valore={`${risultato.altezzaControtelaio} mm`} />
                <RigaDimensione etichetta="Spessore telaio" valore={`${risultato.spessoreTelaio} mm`} />

                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-2">Luce telaio (apertura netta)</p>
                <RigaDimensione etichetta="Larghezza luce" valore={`${risultato.larghezzaLuce} mm`} />
                <RigaDimensione etichetta="Altezza luce" valore={`${risultato.altezzaLuce} mm`} />

                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-2">Anta</p>
                <RigaDimensione etichetta="Larghezza anta" valore={`${risultato.larghezzaAnta} mm`} evidenziato />
                <RigaDimensione etichetta="Altezza anta" valore={`${risultato.altezzaAnta} mm`} evidenziato />
                <RigaDimensione etichetta="Misura standard suggerita" valore={`${risultato.larghezzaStandardSuggerita / 10}×${risultato.antaStandardSuggerita / 10} cm`} />

                {risultato.larghezzaFisso && (
                  <>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-2">Fisso laterale</p>
                    <RigaDimensione etichetta="Larghezza fisso" valore={`${risultato.larghezzaFisso} mm`} />
                    <RigaDimensione etichetta="Altezza fisso" valore={`${risultato.altezzaFisso} mm`} />
                  </>
                )}

                {risultato.altezzaSopraluce && (
                  <>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-2">Sopraluce</p>
                    <RigaDimensione etichetta="Larghezza sopraluce" valore={`${risultato.larghezzaSopraluce} mm`} />
                    <RigaDimensione etichetta="Altezza sopraluce" valore={`${risultato.altezzaSopraluce} mm`} />
                  </>
                )}

                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium pt-2">Apertura e finitura</p>
                <RigaDimensione etichetta="Apertura (cerniere)" valore={`Lato ${risultato.apertura}`} />
                <RigaDimensione etichetta="Verso apertura" valore={risultato.versoApertura === "verso" ? "Verso di me" : "Lontano da me"} />
                <RigaDimensione etichetta="Posizione maniglia" valore={`Lato ${risultato.posizioneManigliaPorta}`} />
                <RigaDimensione etichetta="Tipo vetro" valore={descrizioneVetro(risultato.tipoVetro)} />
              </div>
            </div>

            {/* Pulsanti export */}
            <div className="grid grid-cols-2 gap-3 print:hidden">
              <button
                type="button"
                onClick={esportaSVG}
                className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm font-medium hover:bg-zinc-700 transition"
              >
                <span>⬇</span> Scarica SVG
              </button>
              <button
                type="button"
                onClick={stampaPDF}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold hover:bg-amber-500 transition"
              >
                <span>🖨</span> Stampa / PDF
              </button>
            </div>

            {/* Nota produzione */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400">
              <p className="font-semibold text-zinc-300 mb-1">📋 Note per la produzione</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Le dimensioni anta includono giochi standard (3mm/lato, 6mm sotto)</li>
                <li>Il controtelaio va murato con verifica a bolla su tutti i lati</li>
                <li>Comunicare al produttore: misure luce controtelaio + spessore muro</li>
                <li>Verificare assenza impianti nel muro prima di installare fisso/sopraluce</li>
                <li>Le dimensioni sono orientative: verificare con scheda tecnica produttore</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Navigazione footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 px-4 py-4 print:hidden">
        <div className="max-w-lg mx-auto flex gap-3">
          {step !== "vano" && step !== "risultato" && (
            <button
              type="button"
              onClick={indietro}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3.5 text-sm font-medium hover:bg-zinc-700 transition"
            >
              ← Indietro
            </button>
          )}
          {step !== "risultato" && (
            <button
              type="button"
              onClick={avanti}
              disabled={!puoiAvanzare()}
              className={`flex-1 rounded-xl px-4 py-3.5 text-sm font-bold transition ${
                puoiAvanzare()
                  ? "bg-amber-500 hover:bg-amber-400 text-black"
                  : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {step === "opzioni" ? "Calcola porta →" : "Avanti →"}
            </button>
          )}
          {step === "risultato" && (
            <button
              type="button"
              onClick={reset}
              className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-3.5 text-sm font-bold transition"
            >
              + Nuova porta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function tipoIcona(t: TipologiaPorta): string {
  switch (t) {
    case "battente": return "🚪";
    case "battente_fisso": return "🚪⬜";
    case "battente_sopraluce": return "🚪🔲";
    case "battente_fisso_sopraluce": return "🚪⬜🔲";
    case "doppia_battente": return "🚪🚪";
    default: return "🚪";
  }
}

function tipoDescrizione(t: TipologiaPorta): string {
  switch (t) {
    case "battente": return "Anta singola che occupa tutta la larghezza del vano";
    case "battente_fisso": return "Anta + pannello fisso affiancato (per vani larghi)";
    case "battente_sopraluce": return "Anta + pannello fisso sopra (vetrato o cieco)";
    case "battente_fisso_sopraluce": return "Anta + fisso laterale + sopraluce";
    case "doppia_battente": return "Due ante che si aprono al centro";
    default: return "";
  }
}

function vetroIcona(v: TipoVetro): string {
  switch (v) {
    case "nessuno": return "🟫";
    case "intero": return "🟦";
    case "ovale": return "⬜";
    case "parziale": return "🔳";
    default: return "";
  }
}
