import type { ConfigurazionePorta, RisultatoCalcolo } from "@/lib/tipi";
import { ETICHETTE_MODELLO } from "@/lib/calcolo";
import { DisegnoPianta } from "./DisegnoPianta";
import { DisegnoProspetto } from "./DisegnoProspetto";

interface Props {
  config: ConfigurazionePorta;
  risultato: RisultatoCalcolo;
}

function mm(n: number): string {
  return `${n} mm`;
}

function dim(d: { larghezza: number; altezza: number } | null): string {
  return d ? `${d.larghezza} × ${d.altezza} mm` : "—";
}

function Riga({ nome, valore, forte }: { nome: string; valore: string; forte?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-slate-200 py-1.5">
      <dt className="text-[13px] text-slate-500">{nome}</dt>
      <dd className={`text-right font-mono text-[13px] ${forte ? "font-bold text-tecnico" : "text-inchiostro"}`}>
        {valore}
      </dd>
    </div>
  );
}

/** Scheda tecnica di produzione: dati ordine + schema quotato. */
export function SchedaProduzione({ config, risultato: r }: Props) {
  const dataOggi = new Date().toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="print-area rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-2 border-b-2 border-inchiostro pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-tecnico">
            Scheda di produzione
          </p>
          <h2 className="text-xl font-bold">{config.commessa || "Commessa senza nome"}</h2>
          <p className="text-sm text-slate-500">
            {ETICHETTE_MODELLO[config.modello]} · {r.ferramenta.descrizioneApertura}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-mono font-bold">{dataOggi}</p>
          <p className={r.ok ? "font-semibold text-ok" : "font-semibold text-errore"}>
            {r.ok ? "PRONTA PER PRODUZIONE" : "NON PRODUCIBILE"}
          </p>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <section aria-label="Prospetto frontale">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Prospetto (vista frontale, quote in mm)
          </h3>
          <DisegnoProspetto config={config} risultato={r} />
        </section>

        <div className="flex flex-col gap-5">
          <section aria-label="Pianta">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pianta (verso di apertura)
            </h3>
            <DisegnoPianta config={config} risultato={r} />
          </section>
        </div>
      </div>

      <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
        <dl>
          <h3 className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Misure</h3>
          <Riga nome="Foro muro (vano vuoto)" valore={dim({ larghezza: config.foroMuro.larghezza, altezza: config.foroMuro.altezza })} />
          <Riga nome="Spessore muro" valore={mm(config.foroMuro.spessoreMuro)} />
          <Riga nome="Anta apribile" valore={dim(r.anta)} forte />
          {r.antaSemifissa && <Riga nome="Anta semifissa" valore={dim(r.antaSemifissa)} forte />}
          <Riga nome="Luce netta passaggio" valore={dim(r.lucePassaggio)} />
          <Riga nome="Esterno telaio" valore={dim(r.esternoTelaio)} />
          <Riga nome="Controtelaio (opera morta)" valore={dim(r.controtelaio)} />
          {r.ingombroScorrevole && <Riga nome="Ingombro scorrevole" valore={dim(r.ingombroScorrevole)} />}
          {r.misuraStandard && (
            <Riga
              nome="Misura standard"
              valore={r.misuraStandard.esatta ? "Sì, a magazzino" : `Su misura (std ${r.misuraStandard.larghezza}×${r.misuraStandard.altezza})`}
            />
          )}
        </dl>

        <dl>
          <h3 className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ferramenta e accessori
          </h3>
          <Riga nome="Verso di apertura" valore={r.ferramenta.descrizioneApertura} forte />
          <Riga nome="Cardini / cerniere" valore={r.ferramenta.latoCerniere ? `${r.ferramenta.numeroCerniere} pz — lato ${r.ferramenta.latoCerniere}` : "Nessuna (scorrevole)"} />
          <Riga nome="Maniglia" valore={r.ferramenta.latoManiglia ? `Lato ${r.ferramenta.latoManiglia}, h ${mm(r.ferramenta.altezzaManiglia)}` : config.modello === "ventola" ? "Placca di spinta su entrambi i lati" : "Maniglia incassata"} />
          <Riga nome="Fisso laterale" valore={r.pannelloFisso ? `${dim(r.pannelloFisso)} — lato ${r.pannelloFisso.lato}` : "No"} />
          <Riga nome="Display (sopraluce vetro)" valore={r.vetroDisplay ? `Sì — taglio vetro ${dim(r.vetroDisplay)}` : "No"} />
          <Riga
            nome="Oblò"
            valore={
              r.oblo
                ? `${r.oblo.forma === "tondo" ? "Tondo Ø" : "Quadro"} ${r.oblo.dimensione} mm, centro a ${mm(r.oblo.altezzaCentro)} da terra`
                : "No"
            }
          />
          <Riga
            nome="Telaio"
            valore={
              r.telaio.allargamentiNecessari
                ? `Con allargamenti (muro ${mm(r.telaio.spessoreMuro)})`
                : r.telaio.fuoriStandard
                  ? `Su misura (muro ${mm(r.telaio.spessoreMuro)})`
                  : `Standard (muro ${mm(r.telaio.spessoreMuro)})`
            }
          />
        </dl>
      </div>

      {(r.errori.length > 0 || r.avvisi.length > 0) && (
        <section className="mt-4 space-y-1.5" aria-label="Note di produzione">
          {r.errori.map((e) => (
            <p key={e} className="rounded-lg bg-red-50 px-3 py-1.5 text-[13px] font-medium text-errore">
              ✕ {e}
            </p>
          ))}
          {r.avvisi.map((a) => (
            <p key={a} className="rounded-lg bg-amber-50 px-3 py-1.5 text-[13px] font-medium text-avviso">
              ⚠ {a}
            </p>
          ))}
        </section>
      )}

      <footer className="mt-4 border-t border-slate-200 pt-2 text-[11px] text-slate-400">
        Detrazioni applicate: −100 mm in larghezza (80 telaio + 20 posa) e −50 mm in altezza (40 telaio +
        10 posa) dal foro muro. Documento generato con PortaLab — verificare le misure in cantiere prima
        della messa in produzione.
      </footer>
    </div>
  );
}
