import type { SchedaProduzione } from "../domain/types";

interface Props {
  scheda: SchedaProduzione;
}

/**
 * Schema tecnico frontale della porta, vista dal lato a spingere.
 * Disegna foro muro, telaio, ante, cerniere, maniglia, arco di apertura,
 * oblò/vetrina e quote principali.
 */
export default function SchemaPorta({ scheda }: Props) {
  const { input, oblo, vetrina } = scheda;

  // area disegno in unità mm, con margini per le quote
  const margine = 260;
  const vbW = input.foroL + margine * 2;
  const vbH = input.foroH + margine * 2;
  const x0 = margine;
  const y0 = margine * 0.6;
  const pavimentoY = y0 + input.foroH;

  const spessoreTelaio = Math.round(
    (input.foroL - scheda.luceTelaioL) / 2,
  );
  const telaioX = x0 + spessoreTelaio;
  const telaioY = y0 + (input.foroH - scheda.luceTelaioH);
  const luceL = scheda.luceTelaioL;
  const luceH = scheda.luceTelaioH;

  const cerniereADestra = scheda.latoCerniere === "destra";

  // larghezze delle luci coperte dalle ante (proporzionali alle larghezze anta)
  const dueAnte = scheda.ante.length === 2;
  const sommaAnte = scheda.ante.reduce((a, b) => a + b.larghezza, 0);
  const lucePrincipale = dueAnte
    ? Math.round((luceL * scheda.ante[0].larghezza) / sommaAnte)
    : luceL;
  const luceSecondaria = luceL - lucePrincipale;

  // l'anta principale è sul lato cerniere
  const principaleX = cerniereADestra ? telaioX + luceSecondaria : telaioX;
  const secondariaX = cerniereADestra ? telaioX : telaioX + lucePrincipale;

  const manigliaOffset = 90;
  const manigliaX = cerniereADestra
    ? principaleX + manigliaOffset
    : principaleX + lucePrincipale - manigliaOffset;
  const manigliaY = pavimentoY - scheda.altezzaManiglia;

  const cerniereX = cerniereADestra ? telaioX + luceL : telaioX;
  const quoteCerniere = [0.12, 0.5, 0.88]
    .slice(0, scheda.numeroCerniere)
    .map((f) => telaioY + luceH * f);

  // arco di apertura dell'anta principale (pianta semplificata sotto il prospetto)
  const arcoR = lucePrincipale;
  const arcoCx = cerniereADestra ? principaleX + lucePrincipale : principaleX;
  const arcoY = pavimentoY + 150;
  const arcoSweep = cerniereADestra ? 0 : 1;
  const arcoEndX = cerniereADestra ? arcoCx - arcoR : arcoCx + arcoR;

  const centroAntaPrincipaleX = principaleX + lucePrincipale / 2;

  const fontQ = Math.max(44, Math.round(vbW / 26));
  const fontS = Math.round(fontQ * 0.78);

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH + 380}`}
      role="img"
      aria-label={`Schema porta: foro muro ${input.foroL} per ${input.foroH} millimetri, apertura ${scheda.latoCerniere}`}
      className="schema-svg"
    >
      {/* muro */}
      <rect
        x={x0 - 120}
        y={y0 - 120}
        width={input.foroL + 240}
        height={input.foroH + 120}
        fill="var(--sch-muro)"
      />
      {/* foro muro */}
      <rect x={x0} y={y0} width={input.foroL} height={input.foroH} fill="var(--sch-sfondo)" />
      {/* telaio */}
      <rect
        x={x0}
        y={y0}
        width={input.foroL}
        height={input.foroH}
        fill="none"
        stroke="var(--sch-telaio)"
        strokeWidth={10}
      />
      <rect
        x={telaioX}
        y={telaioY}
        width={luceL}
        height={luceH}
        fill="none"
        stroke="var(--sch-telaio)"
        strokeWidth={8}
      />

      {/* anta principale */}
      <rect
        x={principaleX}
        y={telaioY}
        width={lucePrincipale}
        height={luceH}
        fill="var(--sch-anta)"
        stroke="var(--sch-linea)"
        strokeWidth={6}
      />
      {/* anta secondaria */}
      {dueAnte && (
        <>
          <rect
            x={secondariaX}
            y={telaioY}
            width={luceSecondaria}
            height={luceH}
            fill={
              scheda.ante[1].ruolo === "fissa" ? "var(--sch-anta-fissa)" : "var(--sch-anta-2)"
            }
            stroke="var(--sch-linea)"
            strokeWidth={6}
          />
          <text
            x={secondariaX + luceSecondaria / 2}
            y={telaioY + luceH / 2}
            textAnchor="middle"
            fontSize={fontS}
            fill="var(--sch-testo)"
            transform={`rotate(-90 ${secondariaX + luceSecondaria / 2} ${telaioY + luceH / 2})`}
          >
            {scheda.ante[1].ruolo === "fissa" ? "ANTA FISSA" : "ANTA A COMPASSO"}
          </text>
        </>
      )}

      {/* oblò */}
      {oblo && (
        <ellipse
          cx={centroAntaPrincipaleX}
          cy={pavimentoY - oblo.quotaCentroDaPavimento}
          rx={oblo.larghezza / 2}
          ry={oblo.altezza / 2}
          fill="var(--sch-vetro)"
          stroke="var(--sch-linea)"
          strokeWidth={6}
        />
      )}
      {/* vetrina */}
      {vetrina && (
        <rect
          x={centroAntaPrincipaleX - vetrina.larghezza / 2}
          y={pavimentoY - vetrina.quotaInferioreDaPavimento - vetrina.altezza}
          width={vetrina.larghezza}
          height={vetrina.altezza}
          fill="var(--sch-vetro)"
          stroke="var(--sch-linea)"
          strokeWidth={6}
        />
      )}

      {/* cerniere */}
      {quoteCerniere.map((cy, i) => (
        <rect
          key={i}
          x={cerniereX - 18}
          y={cy - 55}
          width={36}
          height={110}
          rx={8}
          fill="var(--sch-accento)"
        />
      ))}

      {/* maniglia */}
      <circle cx={manigliaX} cy={manigliaY} r={26} fill="var(--sch-accento)" />
      <rect
        x={cerniereADestra ? manigliaX : manigliaX - 110}
        y={manigliaY - 13}
        width={110}
        height={26}
        rx={12}
        fill="var(--sch-accento)"
      />

      {/* pavimento */}
      <line
        x1={x0 - 200}
        y1={pavimentoY}
        x2={x0 + input.foroL + 200}
        y2={pavimentoY}
        stroke="var(--sch-linea)"
        strokeWidth={10}
      />

      {/* arco apertura in pianta */}
      <line
        x1={arcoCx}
        y1={arcoY}
        x2={arcoEndX}
        y2={arcoY}
        stroke="var(--sch-quota)"
        strokeWidth={6}
        strokeDasharray="24 18"
      />
      <path
        d={`M ${arcoEndX} ${arcoY} A ${arcoR} ${arcoR} 0 0 ${arcoSweep} ${arcoCx} ${arcoY + arcoR * 0.55}`}
        fill="none"
        stroke="var(--sch-quota)"
        strokeWidth={6}
        strokeDasharray="24 18"
      />
      <text
        x={arcoCx + (cerniereADestra ? -arcoR / 2 : arcoR / 2)}
        y={arcoY + arcoR * 0.42}
        textAnchor="middle"
        fontSize={fontQ}
        fill="var(--sch-quota)"
      >
        apre a {scheda.latoCerniere === "destra" ? "DX" : "SX"} ({input.movimento})
      </text>

      {/* quota larghezza foro muro */}
      <g stroke="var(--sch-quota)" strokeWidth={5} fill="var(--sch-quota)">
        <line x1={x0} y1={y0 - 150} x2={x0 + input.foroL} y2={y0 - 150} />
        <line x1={x0} y1={y0 - 180} x2={x0} y2={y0 - 120} />
        <line x1={x0 + input.foroL} y1={y0 - 180} x2={x0 + input.foroL} y2={y0 - 120} />
      </g>
      <text
        x={x0 + input.foroL / 2}
        y={y0 - 190}
        textAnchor="middle"
        fontSize={fontQ}
        fill="var(--sch-quota)"
      >
        FM {input.foroL} mm
      </text>

      {/* quota altezza foro muro */}
      <g stroke="var(--sch-quota)" strokeWidth={5}>
        <line x1={x0 - 150} y1={y0} x2={x0 - 150} y2={pavimentoY} />
        <line x1={x0 - 180} y1={y0} x2={x0 - 120} y2={y0} />
        <line x1={x0 - 180} y1={pavimentoY} x2={x0 - 120} y2={pavimentoY} />
      </g>
      <text
        x={x0 - 190}
        y={y0 + input.foroH / 2}
        textAnchor="middle"
        fontSize={fontQ}
        fill="var(--sch-quota)"
        transform={`rotate(-90 ${x0 - 190} ${y0 + input.foroH / 2})`}
      >
        FM {input.foroH} mm
      </text>

      {/* quota anta principale */}
      <text
        x={centroAntaPrincipaleX}
        y={telaioY + luceH * 0.32}
        textAnchor="middle"
        fontSize={fontS}
        fill="var(--sch-testo)"
      >
        anta {scheda.ante[0].larghezza}×{scheda.ante[0].altezza}
      </text>

      {/* etichetta maniglia */}
      <text
        x={manigliaX}
        y={manigliaY + 110}
        textAnchor="middle"
        fontSize={fontS}
        fill="var(--sch-quota)"
      >
        maniglia {scheda.latoManiglia === "destra" ? "DX" : "SX"} · H {scheda.altezzaManiglia}
      </text>
    </svg>
  );
}
