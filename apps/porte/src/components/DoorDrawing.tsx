import type { SchedaProduzione } from "@/lib/door/types";

/**
 * Prospetto quotato + pianta con verso di apertura.
 * Vista convenzionale: si guarda la porta dal lato di rilievo
 * (il lato indicato in scheda per cerniere e maniglia).
 */

const INK = "#1e293b";
const ACCENT = "#b45309";
const GLASS = "#7dd3fc";
const MUTED = "#94a3b8";

interface Props {
  scheda: SchedaProduzione;
  id?: string;
}

export function DoorDrawing({ scheda, id }: Props) {
  const { config, ante, fisso, sopraluce, lucePassaggio } = scheda;
  const { vano } = config;
  const isScorrevole =
    config.tipologia === "scorrevole_scomparsa" || config.tipologia === "scorrevole_esterno";

  // Scala: tutto in mm dentro il viewBox, con margini per quote e pianta.
  const MARGIN = 320;
  const W = vano.larghezza + MARGIN * 2;
  const ox = MARGIN; // origine X del vano
  const oy = MARGIN * 0.6; // origine Y del vano (alto)
  const fondo = oy + vano.altezza; // pavimento

  const sopraluceH = sopraluce ? sopraluce.altezza : 0;
  const telaioTop = oy + sopraluceH;
  const gap = 40; // spessore grafico telaio

  // Zona ante (al netto di eventuale fianco fisso)
  const fissoW = fisso?.larghezza ?? 0;
  const fissoASinistra = fisso?.lato === "sinistra";
  const anteX = ox + (fissoASinistra ? fissoW : 0);
  const anteW = vano.larghezza - fissoW;

  const cerniereADestra = scheda.latoCerniere === "destra";

  const strokeQ = 6;
  const fontQ = 110;

  /** Riduce il font finché il testo sta nella larghezza disponibile (stima 0.55·em per carattere). */
  function fitFont(testo: string, maxWidth: number, base: number) {
    const stimata = testo.length * base * 0.55;
    return stimata <= maxWidth ? base : Math.max(60, Math.floor(maxWidth / (testo.length * 0.55)));
  }

  function quotaOrizzontale(x1: number, x2: number, y: number, testo: string) {
    return (
      <g stroke={MUTED} strokeWidth={strokeQ} fill={MUTED}>
        <line x1={x1} y1={y - 30} x2={x1} y2={y + 30} />
        <line x1={x2} y1={y - 30} x2={x2} y2={y + 30} />
        <line x1={x1} y1={y} x2={x2} y2={y} />
        <text
          x={(x1 + x2) / 2}
          y={y - 45}
          textAnchor="middle"
          fontSize={fontQ}
          stroke="none"
          fontFamily="ui-monospace, monospace"
        >
          {testo}
        </text>
      </g>
    );
  }

  function quotaVerticale(x: number, y1: number, y2: number, testo: string) {
    return (
      <g stroke={MUTED} strokeWidth={strokeQ} fill={MUTED}>
        <line x1={x - 30} y1={y1} x2={x + 30} y2={y1} />
        <line x1={x - 30} y1={y2} x2={x + 30} y2={y2} />
        <line x1={x} y1={y1} x2={x} y2={y2} />
        <text
          x={x + 50}
          y={(y1 + y2) / 2}
          fontSize={fontQ}
          stroke="none"
          fontFamily="ui-monospace, monospace"
          transform={`rotate(90 ${x + 50} ${(y1 + y2) / 2})`}
          textAnchor="middle"
        >
          {testo}
        </text>
      </g>
    );
  }

  // ── Prospetto: ante ──────────────────────────────────────────────
  const anteRects: React.ReactNode[] = [];
  const antaH = telaioTop + gap;
  const antaBottom = fondo;
  const manigliaY = fondo - 1050;

  if (config.tipologia === "doppia_battente" && ante.length === 2) {
    const principale = ante[0];
    const semifissa = ante[1];
    const principaleADestra = cerniereADestra;
    const wTot = principale.larghezza + semifissa.larghezza;
    const scala = (anteW - gap * 2) / wTot;
    const wP = principale.larghezza * scala;
    const wS = semifissa.larghezza * scala;
    const xP = principaleADestra ? anteX + gap + wS : anteX + gap;
    const xS = principaleADestra ? anteX + gap : anteX + gap + wP;
    anteRects.push(
      <g key="ante2">
        <rect x={xP} y={antaH} width={wP} height={antaBottom - antaH} fill="#fff" stroke={INK} strokeWidth={10} />
        <rect x={xS} y={antaH} width={wS} height={antaBottom - antaH} fill="#f8fafc" stroke={INK} strokeWidth={10} strokeDasharray="60 30" />
        <text x={xS + wS / 2} y={(antaH + antaBottom) / 2} textAnchor="middle" fontSize={fontQ * 0.9} fill={MUTED} fontFamily="system-ui">
          semifissa
        </text>
      </g>
    );
  } else {
    anteRects.push(
      <rect
        key="anta1"
        x={anteX + gap}
        y={antaH}
        width={anteW - gap * 2}
        height={antaBottom - antaH}
        fill="#fff"
        stroke={INK}
        strokeWidth={10}
      />
    );
  }

  // Cerniere (3 tacche) e maniglia
  const latoCernX = cerniereADestra ? anteX + anteW - gap : anteX + gap;
  const latoManX = cerniereADestra ? anteX + gap + 90 : anteX + anteW - gap - 90;
  const cerniereY = [antaH + 250, (antaH + antaBottom) / 2, antaBottom - 250];

  // Vetro / oblò sull'anta principale
  const antaCX = anteX + anteW / 2;
  const vetroW = Math.min(anteW * 0.42, 420);
  const vetroH = (antaBottom - antaH) * 0.62;

  // ── Pianta ───────────────────────────────────────────────────────
  const muroTh = 140;
  const hingeX = cerniereADestra ? anteX + anteW - gap : anteX + gap;
  const freeX = cerniereADestra ? anteX + gap : anteX + anteW - gap;
  const raggio = Math.abs(freeX - hingeX);
  // "Spingere": l'anta si allontana dall'osservatore (in alto nella pianta).
  const spingere = config.verso === "spingere";
  // Spazio riservato sopra/sotto la pianta per l'arco di apertura.
  const spazioSopra = !isScorrevole && spingere ? raggio + 200 : 200;
  const spazioSotto = !isScorrevole && !spingere ? raggio + 200 : isScorrevole ? 450 : 200;
  const piantaTitoloY = fondo + 480;
  const piantaY = piantaTitoloY + spazioSopra;
  const arcoEndY = spingere ? piantaY + muroTh / 2 - raggio : piantaY + muroTh / 2 + raggio;
  const sweep = spingere ? (cerniereADestra ? 1 : 0) : cerniereADestra ? 0 : 1;
  const footerY = piantaY + muroTh + spazioSotto + 150;
  const H = footerY + 120;

  return (
    <svg
      id={id}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Schema porta: ${scheda.aperturaDescrizione}`}
      style={{ width: "100%", height: "auto", background: "#fff", borderRadius: 12 }}
    >
      <defs>
        <pattern id="muro" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="120" stroke="#cbd5e1" strokeWidth="14" />
        </pattern>
        <pattern id="vetro" width="140" height="140" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="140" stroke={GLASS} strokeWidth="10" />
        </pattern>
      </defs>

      {/* Muro intorno al vano */}
      <rect x={ox - 200} y={oy - 200} width={vano.larghezza + 400} height={vano.altezza + 200} fill="url(#muro)" stroke={INK} strokeWidth={8} />
      <rect x={ox} y={oy} width={vano.larghezza} height={vano.altezza} fill="#fff" stroke={INK} strokeWidth={10} />

      {/* Sopraluce */}
      {sopraluce && (
        <g>
          <rect
            x={ox + gap}
            y={oy + gap}
            width={vano.larghezza - gap * 2}
            height={sopraluceH - gap}
            fill={sopraluce.tipo === "vetrato" ? "url(#vetro)" : "#f1f5f9"}
            stroke={INK}
            strokeWidth={10}
          />
          <text x={ox + vano.larghezza / 2} y={oy + sopraluceH / 2 + 40} textAnchor="middle" fontSize={fontQ * 0.9} fill={INK} fontFamily="system-ui">
            sopraluce {sopraluce.tipo}
          </text>
        </g>
      )}

      {/* Telaio zona porta */}
      <rect x={ox} y={telaioTop} width={vano.larghezza} height={fondo - telaioTop} fill="none" stroke={INK} strokeWidth={12} />

      {/* Fianco fisso */}
      {fisso && (
        <g>
          <rect
            x={fissoASinistra ? ox + gap : ox + vano.larghezza - fissoW + gap}
            y={telaioTop + gap}
            width={fissoW - gap * 2}
            height={fondo - telaioTop - gap}
            fill="#f1f5f9"
            stroke={INK}
            strokeWidth={10}
          />
          <text
            x={(fissoASinistra ? ox : ox + vano.larghezza - fissoW) + fissoW / 2}
            y={(telaioTop + fondo) / 2}
            textAnchor="middle"
            fontSize={fontQ * 0.9}
            fill={MUTED}
            fontFamily="system-ui"
            transform={`rotate(-90 ${(fissoASinistra ? ox : ox + vano.larghezza - fissoW) + fissoW / 2} ${(telaioTop + fondo) / 2})`}
          >
            fisso {fisso.larghezza} mm
          </text>
        </g>
      )}

      {anteRects}

      {/* Vetro */}
      {config.opzioni.vetro && (
        <rect
          x={antaCX - vetroW / 2}
          y={antaH + 200}
          width={vetroW}
          height={vetroH}
          fill="url(#vetro)"
          stroke={INK}
          strokeWidth={8}
        />
      )}

      {/* Oblò */}
      {config.opzioni.oblo && (
        <ellipse
          cx={antaCX}
          cy={antaH + (antaBottom - antaH) * 0.32}
          rx={Math.min(anteW * 0.16, 170)}
          ry={Math.min((antaBottom - antaH) * 0.14, 300)}
          fill="url(#vetro)"
          stroke={INK}
          strokeWidth={8}
        />
      )}

      {/* Cerniere e maniglia (non per scorrevoli) */}
      {!isScorrevole && (
        <g>
          {cerniereY.map((y) => (
            <rect key={y} x={latoCernX - 25} y={y - 60} width={50} height={120} fill={ACCENT} stroke={INK} strokeWidth={6} />
          ))}
          <circle cx={latoManX} cy={manigliaY} r={40} fill={ACCENT} stroke={INK} strokeWidth={8} />
          <line
            x1={latoManX}
            y1={manigliaY}
            x2={latoManX + (cerniereADestra ? 130 : -130)}
            y2={manigliaY}
            stroke={ACCENT}
            strokeWidth={26}
            strokeLinecap="round"
          />
          <text
            x={latoManX}
            y={manigliaY + 180}
            textAnchor={cerniereADestra ? "start" : "end"}
            fontSize={fontQ * 0.85}
            fill={ACCENT}
            fontFamily="system-ui"
            fontWeight={700}
          >
            maniglia
          </text>
        </g>
      )}

      {/* Freccia scorrimento per scorrevoli */}
      {isScorrevole && (
        <g stroke={ACCENT} strokeWidth={24} fill="none" strokeLinecap="round">
          <line
            x1={antaCX - 300}
            y1={(antaH + antaBottom) / 2}
            x2={antaCX + 300}
            y2={(antaH + antaBottom) / 2}
          />
          <polyline
            points={
              cerniereADestra
                ? `${antaCX + 150},${(antaH + antaBottom) / 2 - 150} ${antaCX + 300},${(antaH + antaBottom) / 2} ${antaCX + 150},${(antaH + antaBottom) / 2 + 150}`
                : `${antaCX - 150},${(antaH + antaBottom) / 2 - 150} ${antaCX - 300},${(antaH + antaBottom) / 2} ${antaCX - 150},${(antaH + antaBottom) / 2 + 150}`
            }
          />
        </g>
      )}

      {/* Quote */}
      {quotaOrizzontale(ox, ox + vano.larghezza, oy - 130, `vano ${vano.larghezza}`)}
      {quotaVerticale(ox - 130, oy, fondo, `vano ${vano.altezza}`)}
      {quotaOrizzontale(
        anteX + gap,
        anteX + anteW - gap,
        fondo + 160,
        config.tipologia === "doppia_battente"
          ? `ante ${ante[0].larghezza} + ${ante[1]?.larghezza ?? 0}`
          : `anta ${ante[0].larghezza}`
      )}
      {quotaVerticale(ox + vano.larghezza + 130, antaH, antaBottom, `anta ${ante[0].altezza}`)}

      {/* Pianta */}
      <g>
        <text
          x={ox - 200}
          y={piantaTitoloY}
          fontSize={fitFont(`Pianta — ${scheda.aperturaDescrizione}`, vano.larghezza + 400, fontQ)}
          fill={INK}
          fontFamily="system-ui"
          fontWeight={700}
        >
          Pianta — {scheda.aperturaDescrizione}
        </text>
        {/* Muri laterali */}
        <rect x={ox - 200} y={piantaY} width={(fissoASinistra ? anteX : ox) - (ox - 200)} height={muroTh} fill="url(#muro)" stroke={INK} strokeWidth={8} />
        <rect
          x={anteX + anteW}
          y={piantaY}
          width={ox + vano.larghezza + 200 - (anteX + anteW) + (fissoASinistra ? 0 : 0)}
          height={muroTh}
          fill="url(#muro)"
          stroke={INK}
          strokeWidth={8}
        />
        {fisso && (
          <rect
            x={fissoASinistra ? ox : ox + vano.larghezza - fissoW}
            y={piantaY + muroTh / 2 - 20}
            width={fissoW}
            height={40}
            fill="#94a3b8"
            stroke={INK}
            strokeWidth={6}
          />
        )}
        {isScorrevole ? (
          <g>
            <rect
              x={cerniereADestra ? anteX + anteW * 0.35 : anteX - anteW * 0.35}
              y={piantaY + muroTh / 2 - 22}
              width={anteW}
              height={44}
              fill="#fff"
              stroke={INK}
              strokeWidth={8}
            />
            <g stroke={ACCENT} strokeWidth={20} fill="none" strokeLinecap="round">
              <line x1={antaCX - 250} y1={piantaY + muroTh + 170} x2={antaCX + 250} y2={piantaY + muroTh + 170} />
              <polyline
                points={
                  cerniereADestra
                    ? `${antaCX + 130},${piantaY + muroTh + 70} ${antaCX + 250},${piantaY + muroTh + 170} ${antaCX + 130},${piantaY + muroTh + 270}`
                    : `${antaCX - 130},${piantaY + muroTh + 70} ${antaCX - 250},${piantaY + muroTh + 170} ${antaCX - 130},${piantaY + muroTh + 270}`
                }
              />
            </g>
          </g>
        ) : (
          <g>
            {/* Anta chiusa */}
            <rect x={anteX + gap} y={piantaY + muroTh / 2 - 22} width={anteW - gap * 2} height={44} fill="#fff" stroke={INK} strokeWidth={8} />
            {/* Arco di apertura */}
            <path
              d={`M ${freeX} ${piantaY + muroTh / 2} A ${raggio} ${raggio} 0 0 ${sweep} ${hingeX} ${arcoEndY}`}
              fill="none"
              stroke={ACCENT}
              strokeWidth={14}
              strokeDasharray="70 50"
            />
            {/* Anta aperta */}
            <line x1={hingeX} y1={piantaY + muroTh / 2} x2={hingeX} y2={arcoEndY} stroke={INK} strokeWidth={30} strokeLinecap="round" />
            <circle cx={hingeX} cy={piantaY + muroTh / 2} r={35} fill={ACCENT} />
            <text
              x={hingeX + (cerniereADestra ? -60 : 60)}
              y={piantaY + muroTh / 2 + (spingere ? -raggio / 2 : raggio / 2)}
              fontSize={fontQ * 0.85}
              fill={ACCENT}
              fontFamily="system-ui"
              fontWeight={700}
              textAnchor={cerniereADestra ? "end" : "start"}
            >
              {config.verso === "spingere" ? "spinge" : "tira"}
            </text>
          </g>
        )}
        <text
          x={ox - 200}
          y={footerY}
          fontSize={fitFont(
            `Luce passaggio ${lucePassaggio.larghezza} × ${lucePassaggio.altezza} mm — vista dal lato di rilievo`,
            vano.larghezza + 400,
            fontQ * 0.8
          )}
          fill={MUTED}
          fontFamily="system-ui"
        >
          Luce passaggio {lucePassaggio.larghezza} × {lucePassaggio.altezza} mm — vista dal lato di rilievo
        </text>
      </g>
    </svg>
  );
}
