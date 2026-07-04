"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, Download, FileJson, Printer, Save } from "lucide-react";
import type { SchedaProduzione } from "@/lib/door/types";
import { TIPOLOGIA_LABEL } from "@/lib/door/types";
import { DoorDrawing } from "./DoorDrawing";
import { Card, KV } from "./ui";

const SVG_ID = "schema-porta-svg";

function scarica(nomeFile: string, contenuto: string, mime: string) {
  const blob = new Blob([contenuto], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeFile;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(nome: string) {
  return nome.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "porta";
}

export function SchedaView({
  scheda,
  onSalva,
  salvata,
}: {
  scheda: SchedaProduzione;
  onSalva: () => void;
  salvata: boolean;
}) {
  const [esportato, setEsportato] = useState<string | null>(null);

  const esportaJson = useCallback(() => {
    scarica(`scheda-${slug(scheda.config.nome)}.json`, JSON.stringify(scheda, null, 2), "application/json");
    setEsportato("JSON scaricato.");
  }, [scheda]);

  const esportaSvg = useCallback(() => {
    const el = document.getElementById(SVG_ID);
    if (!el) return;
    const src = `<?xml version="1.0" encoding="UTF-8"?>\n${el.outerHTML}`;
    scarica(`schema-${slug(scheda.config.nome)}.svg`, src, "image/svg+xml");
    setEsportato("Schema SVG scaricato.");
  }, [scheda]);

  const dataIt = new Date(scheda.generataIl).toLocaleString("it-IT", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="print-area space-y-4" aria-live="polite">
      <Card title="Scheda di produzione">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold">{scheda.config.nome}</h3>
          <span className="font-mono text-xs text-muted">{dataIt}</span>
        </div>
        <dl>
          <KV k="Modello" v={scheda.modello.nome} />
          <KV k="Tipologia" v={TIPOLOGIA_LABEL[scheda.config.tipologia]} />
          <KV k="Apertura" v={scheda.aperturaDescrizione} strong />
          <KV k="Cerniere / scorrimento" v={`lato ${scheda.latoCerniere}`} />
          {scheda.config.tipologia !== "scorrevole_scomparsa" &&
            scheda.config.tipologia !== "scorrevole_esterno" && (
              <KV k="Maniglia" v={`lato ${scheda.latoManiglia}`} strong />
            )}
        </dl>
      </Card>

      <Card title="Quote calcolate (mm)">
        <dl>
          <KV
            k="Vano muro (rilievo)"
            v={`${scheda.config.vano.larghezza} × ${scheda.config.vano.altezza} — muro ${scheda.config.vano.spessoreMuro}`}
          />
          <KV
            k="Falso telaio (opera morta)"
            v={`${scheda.falsoTelaio.larghezza} × ${scheda.falsoTelaio.altezza} — prof. ${scheda.falsoTelaio.profondita}`}
          />
          <KV k="Telaio finito" v={`${scheda.telaio.larghezza} × ${scheda.telaio.altezza}`} />
          {scheda.ante.map((a) => (
            <KV
              key={a.ruolo}
              k={scheda.ante.length > 1 ? `Anta ${a.ruolo}` : "Anta"}
              v={`${a.larghezza} × ${a.altezza} — sp. ${a.spessore}`}
              strong={a.ruolo === "principale"}
            />
          ))}
          {scheda.fisso && (
            <KV k={`Fianco fisso (${scheda.fisso.lato})`} v={`${scheda.fisso.larghezza} × ${scheda.fisso.altezza}`} />
          )}
          {scheda.sopraluce && (
            <KV
              k={`Sopraluce ${scheda.sopraluce.tipo}`}
              v={`${scheda.sopraluce.larghezza} × ${scheda.sopraluce.altezza}`}
            />
          )}
          <KV k="Luce di passaggio" v={`${scheda.lucePassaggio.larghezza} × ${scheda.lucePassaggio.altezza}`} />
          {scheda.ingombroControtelaio && (
            <KV
              k="Ingombro controtelaio"
              v={`${scheda.ingombroControtelaio.larghezza} × ${scheda.ingombroControtelaio.altezza}`}
            />
          )}
          {scheda.lunghezzaBinario && <KV k="Binario a vista" v={`${scheda.lunghezzaBinario}`} />}
          {scheda.misuraStandardVicina && (
            <KV k="Compatibile standard" v={scheda.misuraStandardVicina} />
          )}
          <KV
            k="Dotazioni anta"
            v={
              [
                scheda.config.opzioni.vetro ? "vetro" : null,
                scheda.config.opzioni.oblo ? "oblò" : null,
              ]
                .filter(Boolean)
                .join(" + ") || "cieca"
            }
          />
        </dl>
      </Card>

      {scheda.avvisi.length > 0 && (
        <Card title="Note per la produzione">
          <ul className="space-y-2">
            {scheda.avvisi.map((a) => (
              <li key={a} className="flex gap-2 text-sm">
                <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Schema quotato">
        <DoorDrawing scheda={scheda} id={SVG_ID} />
      </Card>

      <div className="no-print grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Printer className="h-4 w-4" aria-hidden /> Stampa / PDF
        </button>
        <button
          type="button"
          onClick={onSalva}
          disabled={salvata}
          className="flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-3 font-semibold text-primary transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Save className="h-4 w-4" aria-hidden /> {salvata ? "In archivio" : "Salva"}
        </button>
        <button
          type="button"
          onClick={esportaSvg}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted transition-colors hover:text-foreground"
        >
          <Download className="h-4 w-4" aria-hidden /> Schema SVG
        </button>
        <button
          type="button"
          onClick={esportaJson}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted transition-colors hover:text-foreground"
        >
          <FileJson className="h-4 w-4" aria-hidden /> Dati JSON
        </button>
      </div>
      {esportato && (
        <p className="no-print text-center text-sm text-green-500" role="status">
          {esportato}
        </p>
      )}
      <p className="text-center text-[11px] leading-relaxed text-muted">
        Documento di lavoro per la produzione: verificare sempre il rilievo in cantiere prima della messa in macchina.
      </p>
    </div>
  );
}
