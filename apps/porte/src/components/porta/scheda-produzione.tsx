import * as React from "react";
import type { Ordine } from "@/lib/types";
import { MODELLI, VETRI } from "@/lib/modelli-porta";
import { formatoCm, formatoData, formatoMm } from "@/lib/utils";
import { SchemaPorta } from "./schema-svg";

/**
 * Vista scheda produzione pronta per la stampa (PDF via browser print).
 * Formato ottimizzato per A4 con margini contenuti.
 */
export function SchedaProduzione({ ordine }: { ordine: Ordine }) {
  const modello = MODELLI.find((m) => m.id === ordine.modello);
  const vetro = VETRI.find((v) => v.id === ordine.opzioni.vetro);
  const c = ordine.calcolo;
  const o = ordine.opzioni;

  return (
    <div className="scheda-produzione text-slate-900">
      <header className="scheda-header">
        <div>
          <div className="scheda-brand">PortePro</div>
          <div className="scheda-title">Scheda di produzione porta</div>
        </div>
        <div className="scheda-meta">
          <div>
            <strong>Ordine:</strong> {ordine.riferimento}
          </div>
          <div>
            <strong>Cliente:</strong> {ordine.cliente}
          </div>
          {ordine.ambiente && (
            <div>
              <strong>Ambiente:</strong> {ordine.ambiente}
            </div>
          )}
          <div>
            <strong>Data:</strong> {formatoData(ordine.creatoIl)}
          </div>
          <div className="scheda-id">ID: {ordine.id.slice(0, 12)}</div>
        </div>
      </header>

      <section className="scheda-grid">
        <div className="scheda-svg">
          <SchemaPorta
            dimensioni={ordine.dimensioni}
            opzioni={ordine.opzioni}
            calcolo={c}
            colore="chiaro"
            scala="estesa"
          />
        </div>
        <div className="scheda-tabelle">
          <table>
            <caption>Foro muro (input)</caption>
            <tbody>
              <tr>
                <td>Larghezza foro</td>
                <td>{formatoCm(ordine.dimensioni.foroLarghezzaCm)}</td>
              </tr>
              <tr>
                <td>Altezza foro</td>
                <td>{formatoCm(ordine.dimensioni.foroAltezzaCm)}</td>
              </tr>
              <tr>
                <td>Spessore muro finito</td>
                <td>{formatoCm(ordine.dimensioni.spessoreMuroCm)}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <caption>Anta (produzione)</caption>
            <tbody>
              <tr>
                <td>Larghezza anta</td>
                <td>
                  <strong>{formatoCm(c.anta.larghezzaCm)}</strong>
                </td>
              </tr>
              <tr>
                <td>Altezza anta</td>
                <td>
                  <strong>{formatoCm(c.anta.altezzaCm)}</strong>
                </td>
              </tr>
              <tr>
                <td>Spessore anta</td>
                <td>{formatoMm(c.anta.spessoreMm)}</td>
              </tr>
              <tr>
                <td>Vetro</td>
                <td>{vetro?.nome}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <caption>Telaio (stipite)</caption>
            <tbody>
              <tr>
                <td>Larghezza</td>
                <td>{formatoCm(c.telaio.larghezzaCm)}</td>
              </tr>
              <tr>
                <td>Altezza</td>
                <td>{formatoCm(c.telaio.altezzaCm)}</td>
              </tr>
              <tr>
                <td>Profondità consigliata</td>
                <td>{formatoMm(c.telaio.profondita.consigliatoMm)}</td>
              </tr>
              <tr>
                <td>Range profondità</td>
                <td>
                  {formatoMm(c.telaio.profondita.minMm)} –{" "}
                  {formatoMm(c.telaio.profondita.maxMm)}
                </td>
              </tr>
              <tr>
                <td>Battuta</td>
                <td>{formatoMm(c.telaio.battutaMm)}</td>
              </tr>
            </tbody>
          </table>

          <table>
            <caption>Coprifilo</caption>
            <tbody>
              <tr>
                <td>Tipo</td>
                <td>{c.coprifilo.tipo}</td>
              </tr>
              {c.coprifilo.tipo !== "nessuno" && (
                <>
                  <tr>
                    <td>Larghezza</td>
                    <td>{formatoMm(c.coprifilo.larghezzaMm)}</td>
                  </tr>
                  <tr>
                    <td>Spessore</td>
                    <td>{formatoMm(c.coprifilo.spessoreMm)}</td>
                  </tr>
                  {c.coprifilo.telescopicoRangeMm && (
                    <tr>
                      <td>Range telescopico</td>
                      <td>
                        {c.coprifilo.telescopicoRangeMm[0]}–
                        {c.coprifilo.telescopicoRangeMm[1]} mm
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>

          {c.fisso && (
            <table>
              <caption>Pannello fisso</caption>
              <tbody>
                <tr>
                  <td>Larghezza fisso</td>
                  <td>{formatoCm(c.fisso.larghezzaCm)}</td>
                </tr>
                <tr>
                  <td>Altezza fisso</td>
                  <td>{formatoCm(c.fisso.altezzaCm)}</td>
                </tr>
                <tr>
                  <td>Posizione</td>
                  <td>{o.maniglia === "destra" ? "Sinistra (SX)" : "Destra (DX)"}</td>
                </tr>
              </tbody>
            </table>
          )}

          {c.sopraluce && (
            <table>
              <caption>Sopraluce</caption>
              <tbody>
                <tr>
                  <td>Larghezza</td>
                  <td>{formatoCm(c.sopraluce.larghezzaCm)}</td>
                </tr>
                <tr>
                  <td>Altezza</td>
                  <td>{formatoCm(c.sopraluce.altezzaCm)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="scheda-specifiche">
        <h3>Specifiche funzionali</h3>
        <div className="scheda-specifiche-grid">
          <div>
            <span className="lbl">Modello</span>
            <span className="val">{modello?.nome}</span>
          </div>
          <div>
            <span className="lbl">Cerniere</span>
            <span className="val">
              {o.maniglia === "destra" ? "Lato SX" : "Lato DX"} (3 cerniere)
            </span>
          </div>
          <div>
            <span className="lbl">Maniglia</span>
            <span className="val">Lato {o.maniglia === "destra" ? "DX" : "SX"}</span>
          </div>
          <div>
            <span className="lbl">Verso apertura</span>
            <span className="val">{o.versoApertura === "spinta" ? "Spinge" : "Tira"}</span>
          </div>
          <div>
            <span className="lbl">Sistema bussola</span>
            <span className="val">{o.bussola ? "Sì" : "No"}</span>
          </div>
          <div>
            <span className="lbl">Fisso laterale</span>
            <span className="val">{o.fisso ? `Sì (${o.fissoLarghezzaCm} cm)` : "No"}</span>
          </div>
          <div>
            <span className="lbl">Sopraluce</span>
            <span className="val">
              {o.sopraluce ? `Sì (${o.sopraluceAltezzaCm} cm)` : "No"}
            </span>
          </div>
          <div>
            <span className="lbl">Vetro</span>
            <span className="val">{vetro?.nome}</span>
          </div>
          <div>
            <span className="lbl">Luce netta di passaggio</span>
            <span className="val">
              <strong>{formatoCm(c.luceNettaCm)}</strong>
            </span>
          </div>
          <div>
            <span className="lbl">Ingombro totale</span>
            <span className="val">
              {formatoCm(c.ingombroTotaleLarghezzaCm)} × {formatoCm(c.ingombroTotaleAltezzaCm)}
            </span>
          </div>
        </div>
      </section>

      {ordine.note && (
        <section className="scheda-note">
          <h3>Note di produzione</h3>
          <p>{ordine.note}</p>
        </section>
      )}

      {c.avvertenze.length > 0 && (
        <section className="scheda-avvertenze">
          <h3>Avvertenze</h3>
          <ul>
            {c.avvertenze.map((av, i) => (
              <li key={i} className={`liv-${av.livello}`}>
                <strong>[{av.livello.toUpperCase()}]</strong> {av.messaggio}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="scheda-footer">
        <span>
          Calcolo basato su standard italiani (DM 236/1989). Verifica sempre le tolleranze
          di posa con il produttore.
        </span>
        <span>PortePro · Generato automaticamente</span>
      </footer>
    </div>
  );
}
