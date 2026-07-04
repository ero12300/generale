import { AlertTriangle, DoorOpen, Ruler } from "lucide-react";
import type { RisultatoCalcolo } from "@/lib/door/types";
import { dimLabel, mm } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DoorScheme } from "./door-scheme";

interface ResultPanelProps {
  r: RisultatoCalcolo;
  nomeProgetto: string;
  cliente: string;
}

function Riga({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={strong ? "text-sm font-bold text-slate-900" : "text-sm font-medium text-slate-800"}>
        {value}
      </span>
    </div>
  );
}

export function ResultPanel({ r, nomeProgetto, cliente }: ResultPanelProps) {
  const accessoriAttivi = [
    r.accessori.bussola && "Bussola (doppia anta)",
    r.accessori.fissoLaterale && "Fisso laterale",
    r.accessori.sopraluce && "Sopraluce",
    r.accessori.vetro && "Anta vetrata",
    r.accessori.ovale && "Ovale",
  ].filter(Boolean) as string[];

  return (
    <div className="print-area space-y-4">
      {/* Intestazione visibile solo in stampa */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">Scheda di produzione porta</h1>
        <p className="text-sm text-slate-600">
          {nomeProgetto ? `Progetto: ${nomeProgetto}` : "Progetto senza nome"}
          {cliente ? ` · Cliente: ${cliente}` : ""} · Generata il{" "}
          {new Date().toLocaleDateString("it-IT")}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="default" className="gap-1">
            <DoorOpen className="h-3.5 w-3.5" /> {r.sistemaNome}
          </Badge>
          <Badge variant={r.mano.verso === "destra" ? "warning" : "secondary"}>
            Porta {r.mano.verso.toUpperCase()}
          </Badge>
          <Badge variant="secondary">{r.mano.din}</Badge>
          {r.numeroAnte === 2 ? <Badge variant="secondary">2 ante</Badge> : null}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2">
          <DoorScheme r={r} />
        </div>
        <p className="mt-3 text-sm text-slate-600">{r.mano.descrizione}</p>
      </div>

      {r.avvisi.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="h-4 w-4" /> Avvisi
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800">
            {r.avvisi.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Ruler className="h-4 w-4 text-blue-600" /> Misure di produzione
          </p>
          <Riga label="Foro muro" value={dimLabel(r.foroMuro.larghezza, r.foroMuro.altezza)} />
          <Riga label="Spessore muro" value={mm(r.foroMuro.spessoreMuro)} />
          <Riga label="Controtelaio (ordine)" value={dimLabel(r.controtelaio.larghezza, r.controtelaio.altezza)} />
          <Riga label="Luce controtelaio" value={dimLabel(r.luceControtelaio.larghezza, r.luceControtelaio.altezza)} />
          <Riga label="Luce di passaggio" value={dimLabel(r.lucePassaggio.larghezza, r.lucePassaggio.altezza)} />
          <Riga label={r.numeroAnte === 2 ? "Anta (cad.)" : "Anta"} value={dimLabel(r.anta.larghezza, r.anta.altezza)} strong />
          {r.fisso ? <Riga label="Fisso laterale" value={dimLabel(r.fisso.larghezza, r.fisso.altezza)} /> : null}
          {r.sopraluce ? <Riga label="Sopraluce" value={dimLabel(r.sopraluce.larghezza, r.sopraluce.altezza)} /> : null}
          {r.ingombroParete ? <Riga label="Ingombro parete (scorr.)" value={mm(r.ingombroParete)} /> : null}
          {r.ingombroScomparsa ? (
            <Riga label="Ingombro scomparsa" value={dimLabel(r.ingombroScomparsa.larghezza, r.ingombroScomparsa.altezza)} />
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-slate-700">Verso &amp; ferramenta</p>
          <Riga label="Cerniere" value={r.mano.latoCerniere.toUpperCase()} />
          <Riga label="Maniglia" value={r.mano.latoManiglia.toUpperCase()} strong />
          <Riga label="Verso porta" value={r.mano.verso.toUpperCase()} strong />
          <Riga label="Apertura" value={r.mano.sensoApertura === "tiro" ? "Tiro" : "Spinta"} />
          <Riga label="Convenzione" value={r.mano.din} />
          <Riga label="N. ante" value={String(r.numeroAnte)} />
          <div className="mt-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Accessori</p>
            {accessoriAttivi.length ? (
              <div className="flex flex-wrap gap-1.5">
                {accessoriAttivi.map((a) => (
                  <Badge key={a} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Nessun accessorio</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        Le misure sono calcolate dal foro muro applicando le deduzioni del sistema selezionato. Verifica
        sempre le schede tecniche del produttore prima della messa in produzione. Documento generato a scopo
        operativo, non sostituisce il rilievo in cantiere.
      </p>
    </div>
  );
}
