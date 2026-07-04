import type { ConfigurazionePorta, RisultatoPorta } from "@/lib/door-engine";
import { mmConCm, dimensioni } from "@/lib/formato";
import { DoorSchematic } from "./door-schematic";

interface SchedaProduzioneProps {
  config: ConfigurazionePorta;
  risultato: RisultatoPorta;
  codice: string;
  data: string;
}

function Riga({ voce, valore }: { voce: string; valore: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-steel/10 py-1.5">
      <dt className="text-sm text-steel/70">{voce}</dt>
      <dd className="text-right text-sm font-semibold">{valore}</dd>
    </div>
  );
}

const ETICHETTA_SOPRALUCE: Record<string, string> = {
  fisso: "Fisso",
  compasso: "Apribile a compasso",
};

export function SchedaProduzione({ config, risultato, codice, data }: SchedaProduzioneProps) {
  const posizioneFisso =
    config.fissoPosizione === "entrambi"
      ? "sinistra + destra"
      : config.fissoPosizione;

  return (
    <div className="print-area card p-4 sm:p-6" data-testid="scheda-produzione">
      <header className="mb-4 flex items-start justify-between gap-3 border-b-2 border-ink pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-brass">
            Scheda di produzione
          </p>
          <h2 className="text-xl font-bold">
            {config.nome || "Porta senza nome"}
          </h2>
          <p className="text-xs text-steel/60">
            Codice {codice} · {data}
          </p>
        </div>
        <div className="rounded-xl bg-ink px-3 py-2 text-center text-paper">
          <p className="text-[10px] uppercase tracking-wider opacity-70">Anta</p>
          <p className="text-lg font-bold leading-tight">
            {risultato.anta.larghezza}×{risultato.anta.altezza}
          </p>
          <p className="text-[10px] opacity-70">mm</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <div className="mx-auto max-w-[420px]">
            <DoorSchematic config={config} risultato={risultato} quote />
          </div>
          <p className="mt-1 text-center text-[11px] text-steel/60">
            Prospetto visto dal lato di apertura (cerniere visibili) — misure in mm
          </p>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-brass">
              Misure di produzione
            </h3>
            <dl>
              <Riga voce="Anta (L × H)" valore={dimensioni(risultato.anta.larghezza, risultato.anta.altezza)} />
              <Riga voce="Spessore anta" valore={mmConCm(risultato.anta.spessore)} />
              <Riga voce="Esterno telaio (L × H)" valore={dimensioni(risultato.telaio.larghezza, risultato.telaio.altezza)} />
              <Riga voce="Luce netta passaggio" valore={dimensioni(risultato.luceNetta.larghezza, risultato.luceNetta.altezza)} />
              <Riga voce="Foro muro rilevato" valore={dimensioni(config.foroLarghezza, config.foroAltezza)} />
              <Riga voce="Spessore muro" valore={mmConCm(config.spessoreMuro)} />
              {risultato.misuraStandard && (
                <Riga voce="Misura commerciale" valore={risultato.misuraStandard} />
              )}
            </dl>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-brass">
              Apertura
            </h3>
            <dl>
              <Riga voce="Senso di apertura" valore={risultato.etichettaApertura} />
              <Riga voce="Cerniere" valore={`Lato ${risultato.latoCerniere}`} />
              <Riga voce="Maniglia" valore={`Lato ${risultato.latoManiglia}`} />
            </dl>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-brass">
              Composizione
            </h3>
            <dl>
              <Riga voce="Modello" valore={config.modello === "interna" ? "Porta interna" : "Porta d'ingresso"} />
              <Riga
                voce="Fisso laterale"
                valore={
                  risultato.fisso
                    ? `${risultato.numeroFissi} × ${dimensioni(risultato.fisso.larghezza, risultato.fisso.altezza)} (${posizioneFisso})`
                    : "No"
                }
              />
              <Riga
                voce="Sopraluce"
                valore={
                  risultato.sopraluce
                    ? `${ETICHETTA_SOPRALUCE[risultato.sopraluce.tipo]} — ${dimensioni(risultato.sopraluce.larghezza, risultato.sopraluce.altezza)}`
                    : "No"
                }
              />
              <Riga voce="Display vetrato" valore={config.vetroDisplay ? "Sì" : "No"} />
              <Riga voce="Oblò ovale" valore={config.oblo ? "Sì" : "No"} />
            </dl>
          </section>
        </div>
      </div>

      {risultato.avvisi.length > 0 && (
        <section className="mt-4">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-brass">Note</h3>
          <ul className="space-y-1">
            {risultato.avvisi.map((a) => (
              <li
                key={a.codice}
                className={`text-xs ${
                  a.livello === "errore"
                    ? "text-err"
                    : a.livello === "avviso"
                      ? "text-warn"
                      : "text-steel/70"
                }`}
              >
                {a.livello === "errore" ? "⛔" : a.livello === "avviso" ? "⚠" : "ℹ"} {a.messaggio}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-4">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-brass">
          Dettaglio calcolo (opera morta)
        </h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-steel/20 text-steel/60">
              <th className="py-1 pr-2 font-semibold">Voce</th>
              <th className="py-1 pr-2 font-semibold">Formula</th>
              <th className="py-1 text-right font-semibold">Risultato</th>
            </tr>
          </thead>
          <tbody>
            {risultato.dettaglioCalcolo.map((r) => (
              <tr key={r.voce} className="border-b border-steel/10">
                <td className="py-1 pr-2 font-medium">{r.voce}</td>
                <td className="py-1 pr-2 text-steel/70">{r.formula}</td>
                <td className="py-1 text-right font-semibold">{r.risultato}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-4 border-t border-steel/20 pt-2 text-[10px] text-steel/50">
        Documento tecnico generato da PortaPro. Verificare le misure in cantiere prima della messa
        in produzione. Aria di posa {config.giochi.ariaLaterale} mm/lato, battuta {config.giochi.battuta} mm,
        gioco pavimento {config.giochi.giocoPavimento} mm.
      </footer>
    </div>
  );
}
