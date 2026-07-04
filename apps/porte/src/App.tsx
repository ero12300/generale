import { useEffect, useMemo, useState } from "react";
import SchemaPorta from "./components/SchemaPorta";
import { calcolaPorta, etichettaVerso } from "./domain/calcolo";
import { LISTA_MODELLI, MODELLI } from "./domain/modelli";
import type { Commessa, InputPorta } from "./domain/types";
import { archivio } from "./services/archivio";
import { esportaJson, stampaScheda } from "./services/esporta";

const INPUT_INIZIALE: InputPorta = {
  modello: "battente-classic",
  foroL: 900,
  foroH: 2100,
  spessoreMuro: 105,
  numeroAnte: 1,
  tipoAntaSecondaria: "compasso",
  ripartizione: "simmetrica",
  verso: "destra",
  movimento: "spingere",
  conOblo: false,
  formaOblo: "tondo",
  conVetrina: false,
};

type Vista = "configura" | "scheda" | "archivio";

function CampoNumero({
  id,
  label,
  value,
  min,
  max,
  suffisso,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  suffisso: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="campo" htmlFor={id}>
      <span className="campo-label">{label}</span>
      <span className="campo-input">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={Number.isNaN(value) ? "" : value}
          min={min}
          max={max}
          step={1}
          onChange={(e) => onChange(e.target.valueAsNumber)}
        />
        <span className="suffisso">{suffisso}</span>
      </span>
    </label>
  );
}

function Segmento<T extends string | number>({
  legenda,
  opzioni,
  valore,
  onChange,
}: {
  legenda: string;
  opzioni: { valore: T; etichetta: string }[];
  valore: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="segmento">
      <legend>{legenda}</legend>
      <div className="segmento-opzioni" role="radiogroup" aria-label={legenda}>
        {opzioni.map((o) => (
          <button
            key={String(o.valore)}
            type="button"
            role="radio"
            aria-checked={valore === o.valore}
            className={valore === o.valore ? "seg attivo" : "seg"}
            onClick={() => onChange(o.valore)}
          >
            {o.etichetta}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Interruttore({
  id,
  label,
  checked,
  disabled,
  nota,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  nota?: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className={disabled ? "interruttore disabilitato" : "interruttore"} htmlFor={id}>
      <span>
        <span className="interruttore-label">{label}</span>
        {nota && <span className="interruttore-nota">{nota}</span>}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="levetta" aria-hidden="true" />
    </label>
  );
}

export default function App() {
  const [input, setInput] = useState<InputPorta>(INPUT_INIZIALE);
  const [vista, setVista] = useState<Vista>("configura");
  const [riferimento, setRiferimento] = useState("");
  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [salvata, setSalvata] = useState(false);

  useEffect(() => {
    setCommesse(archivio.lista());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [vista]);

  const modello = MODELLI[input.modello];
  const esito = useMemo(() => calcolaPorta(input), [input]);

  function aggiorna<K extends keyof InputPorta>(campo: K, valore: InputPorta[K]) {
    setSalvata(false);
    setInput((prev) => {
      const next = { ...prev, [campo]: valore };
      // riallinea opzioni non ammesse dal modello scelto
      const m = MODELLI[next.modello];
      if (!m.consenteOblo) next.conOblo = false;
      if (!m.consenteVetrina) next.conVetrina = false;
      if (!m.consenteDueAnte) next.numeroAnte = 1;
      return next;
    });
  }

  function salvaCommessa() {
    if (!esito.ok) return;
    archivio.salva(riferimento, input);
    setCommesse(archivio.lista());
    setSalvata(true);
  }

  function caricaCommessa(c: Commessa) {
    setInput(c.input);
    setRiferimento(c.riferimento);
    setSalvata(false);
    setVista("scheda");
  }

  function eliminaCommessa(id: string) {
    archivio.elimina(id);
    setCommesse(archivio.lista());
  }

  const rangeL = input.numeroAnte === 1 ? [modello.minL1, modello.maxL1] : [modello.minL2, modello.maxL2];

  return (
    <div className="app">
      <header className="testata no-print">
        <h1>
          Porta<span>Pro</span>
        </h1>
        <p>Dal foro muro alla porta pronta per la produzione</p>
      </header>

      <nav className="tabs no-print" aria-label="Navigazione principale">
        <button
          className={vista === "configura" ? "tab attivo" : "tab"}
          aria-current={vista === "configura"}
          onClick={() => setVista("configura")}
        >
          1 · Misure
        </button>
        <button
          className={vista === "scheda" ? "tab attivo" : "tab"}
          aria-current={vista === "scheda"}
          onClick={() => setVista("scheda")}
        >
          2 · Scheda
        </button>
        <button
          className={vista === "archivio" ? "tab attivo" : "tab"}
          aria-current={vista === "archivio"}
          onClick={() => setVista("archivio")}
        >
          Archivio ({commesse.length})
        </button>
      </nav>

      {vista === "configura" && (
        <main className="contenuto no-print">
          <section className="card">
            <h2>Modello porta</h2>
            <div className="modelli" role="radiogroup" aria-label="Modello porta">
              {LISTA_MODELLI.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={input.modello === m.id}
                  className={input.modello === m.id ? "modello attivo" : "modello"}
                  onClick={() => aggiorna("modello", m.id)}
                >
                  <strong>{m.nome}</strong>
                  <span>{m.descrizione}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Foro muro (vano)</h2>
            <p className="aiuto">
              Misura la luce minima del vano in 3 punti e inserisci il valore più piccolo, dal
              pavimento finito.
            </p>
            <CampoNumero
              id="foroL"
              label={`Larghezza foro (${rangeL[0]}–${rangeL[1]})`}
              value={input.foroL}
              min={rangeL[0]}
              max={rangeL[1]}
              suffisso="mm"
              onChange={(v) => aggiorna("foroL", v)}
            />
            <CampoNumero
              id="foroH"
              label={`Altezza foro (${modello.minH}–${modello.maxH})`}
              value={input.foroH}
              min={modello.minH}
              max={modello.maxH}
              suffisso="mm"
              onChange={(v) => aggiorna("foroH", v)}
            />
            <CampoNumero
              id="spessoreMuro"
              label="Spessore muro finito"
              value={input.spessoreMuro}
              min={80}
              max={500}
              suffisso="mm"
              onChange={(v) => aggiorna("spessoreMuro", v)}
            />
          </section>

          <section className="card">
            <h2>Configurazione ante</h2>
            <Segmento
              legenda="Numero ante"
              opzioni={[
                { valore: 1 as const, etichetta: "1 anta" },
                { valore: 2 as const, etichetta: "2 ante" },
              ]}
              valore={input.numeroAnte}
              onChange={(v) => aggiorna("numeroAnte", v)}
            />
            {input.numeroAnte === 2 && (
              <>
                <Segmento
                  legenda="Anta secondaria"
                  opzioni={[
                    { valore: "compasso" as const, etichetta: "A compasso (semifissa)" },
                    { valore: "fissa" as const, etichetta: "Fissa" },
                  ]}
                  valore={input.tipoAntaSecondaria}
                  onChange={(v) => aggiorna("tipoAntaSecondaria", v)}
                />
                <Segmento
                  legenda="Ripartizione ante"
                  opzioni={[
                    { valore: "simmetrica" as const, etichetta: "Simmetrica ½ + ½" },
                    { valore: "asimmetrica" as const, etichetta: "Asimmetrica ⅔ + ⅓" },
                  ]}
                  valore={input.ripartizione}
                  onChange={(v) => aggiorna("ripartizione", v)}
                />
              </>
            )}
          </section>

          <section className="card">
            <h2>Verso di apertura</h2>
            <p className="aiuto">
              Guarda la porta dal lato a spingere: il verso è il lato delle cerniere. La maniglia
              va sul lato opposto.
            </p>
            <Segmento
              legenda="Verso (lato cerniere)"
              opzioni={[
                { valore: "destra" as const, etichetta: "Destra (DX)" },
                { valore: "sinistra" as const, etichetta: "Sinistra (SX)" },
              ]}
              valore={input.verso}
              onChange={(v) => aggiorna("verso", v)}
            />
            <Segmento
              legenda="Movimento"
              opzioni={[
                { valore: "spingere" as const, etichetta: "A spingere" },
                { valore: "tirare" as const, etichetta: "A tirare" },
              ]}
              valore={input.movimento}
              onChange={(v) => aggiorna("movimento", v)}
            />
            <p className="riepilogo-verso">
              Apertura: <strong>{etichettaVerso(input)}</strong> · Maniglia a{" "}
              <strong>{input.verso === "destra" ? "sinistra" : "destra"}</strong>
            </p>
          </section>

          <section className="card">
            <h2>Vetri e oblò</h2>
            <Interruttore
              id="oblo"
              label="Oblò"
              nota={
                modello.consenteOblo
                  ? "Vetro tondo oppure ovale nell'anta principale"
                  : "Non disponibile per questo modello"
              }
              checked={input.conOblo}
              disabled={!modello.consenteOblo}
              onChange={(v) => aggiorna("conOblo", v)}
            />
            {input.conOblo && (
              <Segmento
                legenda="Forma oblò"
                opzioni={[
                  { valore: "tondo" as const, etichetta: "Tondo" },
                  { valore: "ovale" as const, etichetta: "Ovale" },
                ]}
                valore={input.formaOblo}
                onChange={(v) => aggiorna("formaOblo", v)}
              />
            )}
            <Interruttore
              id="vetrina"
              label="Vetrina / display"
              nota={
                modello.consenteVetrina
                  ? "Specchiatura vetrata rettangolare nell'anta principale"
                  : "Non disponibile per questo modello"
              }
              checked={input.conVetrina}
              disabled={!modello.consenteVetrina}
              onChange={(v) => aggiorna("conVetrina", v)}
            />
          </section>

          {!esito.ok && (
            <section className="card errore" role="alert">
              <h2>Correggi prima di continuare</h2>
              <ul>
                {esito.errori.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </section>
          )}

          <button
            type="button"
            className="cta"
            disabled={!esito.ok}
            onClick={() => setVista("scheda")}
          >
            Genera scheda porta →
          </button>
        </main>
      )}

      {vista === "scheda" && (
        <main className="contenuto">
          {!esito.ok || !esito.scheda ? (
            <section className="card errore no-print" role="alert">
              <h2>Configurazione non valida</h2>
              <ul>
                {esito.errori.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <button type="button" className="cta" onClick={() => setVista("configura")}>
                ← Torna alle misure
              </button>
            </section>
          ) : (
            <>
              <section className="card stampabile">
                <div className="intestazione-scheda">
                  <h2>Scheda di produzione</h2>
                  <label className="campo campo-testo" htmlFor="rif">
                    <span className="campo-label">Riferimento commessa</span>
                    <input
                      id="rif"
                      type="text"
                      placeholder="es. Cantiere Rossi — piano 2"
                      value={riferimento}
                      onChange={(e) => {
                        setRiferimento(e.target.value);
                        setSalvata(false);
                      }}
                    />
                  </label>
                </div>

                <SchemaPorta scheda={esito.scheda} />

                <table className="tabella">
                  <caption>Distinta misure (mm) — {esito.scheda.modello.nome}</caption>
                  <tbody>
                    <tr>
                      <th scope="row">Foro muro (FM)</th>
                      <td>
                        {input.foroL} × {input.foroH} · muro {input.spessoreMuro}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Controtelaio / opera morta</th>
                      <td>
                        {esito.scheda.controtelaioL} × {esito.scheda.controtelaioH}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Luce netta telaio</th>
                      <td>
                        {esito.scheda.luceTelaioL} × {esito.scheda.luceTelaioH}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Luce di passaggio</th>
                      <td>
                        {esito.scheda.lucePassaggioL} × {esito.scheda.lucePassaggioH}
                      </td>
                    </tr>
                    {esito.scheda.ante.map((a) => (
                      <tr key={a.ruolo}>
                        <th scope="row">Anta {a.ruolo}</th>
                        <td>
                          {a.larghezza} × {a.altezza} × sp. {a.spessore}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <th scope="row">Verso apertura</th>
                      <td>{etichettaVerso(input)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Cerniere</th>
                      <td>
                        n. {esito.scheda.numeroCerniere} — lato{" "}
                        {esito.scheda.latoCerniere === "destra" ? "DX" : "SX"}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Maniglia</th>
                      <td>
                        lato {esito.scheda.latoManiglia === "destra" ? "DX" : "SX"} — H{" "}
                        {esito.scheda.altezzaManiglia} da pavimento
                      </td>
                    </tr>
                    {esito.scheda.oblo && (
                      <tr>
                        <th scope="row">Oblò ({esito.scheda.oblo.forma})</th>
                        <td>
                          {esito.scheda.oblo.larghezza} × {esito.scheda.oblo.altezza} — centro a{" "}
                          {esito.scheda.oblo.quotaCentroDaPavimento} da pavimento
                        </td>
                      </tr>
                    )}
                    {esito.scheda.vetrina && (
                      <tr>
                        <th scope="row">Vetrina / display</th>
                        <td>
                          {esito.scheda.vetrina.larghezza} × {esito.scheda.vetrina.altezza} — da{" "}
                          {esito.scheda.vetrina.quotaInferioreDaPavimento} da pavimento
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {esito.scheda.avvertenze.length > 0 && (
                  <div className="avvertenze">
                    <h3>Avvertenze di produzione</h3>
                    <ul>
                      {esito.scheda.avvertenze.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="disclaimer">
                  Documento generato da PortaPro — verificare le misure in opera prima della messa
                  in produzione.
                </p>
              </section>

              <div className="azioni no-print">
                <button type="button" className="cta secondaria" onClick={() => setVista("configura")}>
                  ← Modifica
                </button>
                <button type="button" className="cta secondaria" onClick={salvaCommessa}>
                  {salvata ? "✓ Salvata" : "Salva in archivio"}
                </button>
                <button
                  type="button"
                  className="cta secondaria"
                  onClick={() => esportaJson(esito.scheda!, riferimento)}
                >
                  Esporta JSON
                </button>
                <button type="button" className="cta" onClick={stampaScheda}>
                  Esporta PDF / Stampa
                </button>
              </div>
            </>
          )}
        </main>
      )}

      {vista === "archivio" && (
        <main className="contenuto no-print">
          <section className="card">
            <h2>Commesse salvate</h2>
            {commesse.length === 0 ? (
              <p className="aiuto">
                Nessuna commessa salvata. Genera una scheda e usa “Salva in archivio”.
              </p>
            ) : (
              <ul className="lista-commesse">
                {commesse.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="commessa" onClick={() => caricaCommessa(c)}>
                      <strong>{c.riferimento}</strong>
                      <span>
                        {MODELLI[c.input.modello].nome} · FM {c.input.foroL}×{c.input.foroH} ·{" "}
                        {etichettaVerso(c.input)}
                      </span>
                      <span className="data">
                        {new Date(c.creataIl).toLocaleString("it-IT")}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="elimina"
                      aria-label={`Elimina commessa ${c.riferimento}`}
                      onClick={() => eliminaCommessa(c.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
