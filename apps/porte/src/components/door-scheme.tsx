import type { RisultatoPorta } from "@/lib/door/types";

interface Props {
  risultato: RisultatoPorta;
}

/**
 * Schema di produzione in vista prospetto (elevation).
 * Il sistema di coordinate del viewBox è in millimetri reali del foro muro,
 * così le proporzioni corrispondono alla porta effettiva.
 */
export function DoorScheme({ risultato }: Props) {
  const { foro, telaioEsterno, anta, antaFissa, sopraluce, oblo, input } = risultato;

  const W = foro.larghezzaMm;
  const H = foro.altezzaMm;
  const padX = W * 0.16;
  const padTop = H * 0.08;
  const padBottom = H * 0.1;

  const stroke = Math.max(6, W / 130);
  const font = Math.max(70, H / 22);

  // Telaio esterno centrato in larghezza, appoggiato a terra (fondo del foro).
  const teW = telaioEsterno.larghezzaMm;
  const teH = telaioEsterno.altezzaMm;
  const teX = (W - teW) / 2;
  const teY = H - teH;

  // Banda sopraluce (in alto), poi blocco ante
  const sopraH = sopraluce ? sopraluce.altezzaMm + (risultato.parametri.traversoSopraluceMm ?? 0) : 0;
  const anteTop = teY + sopraH;
  const anteH = teH - sopraH;

  const cerniereSinistra = input.latoCerniere === "sinistra";

  // Suddivisione larghezza tra anta fissa (lato maniglia) e anta mobile (lato cerniere)
  const totLuceW = teW;
  const fissaW = antaFissa ? antaFissa.larghezzaMm + risultato.parametri.montanteCentraleMm : 0;
  const mobileW = totLuceW - fissaW;

  // Se cerniere a sinistra: anta mobile a sinistra, fissa a destra. Viceversa.
  const mobileX = cerniereSinistra ? teX : teX + fissaW;
  const fissaX = cerniereSinistra ? teX + mobileW : teX;

  // Bordi utili dell'anta mobile
  const leafLeft = mobileX;
  const leafRight = mobileX + mobileW;
  const leafTop = anteTop;
  const leafBottom = teY + teH;
  const leafMidY = (leafTop + leafBottom) / 2;

  const hingeX = cerniereSinistra ? leafLeft : leafRight;
  const handleX = cerniereSinistra ? leafRight : leafLeft;
  const apexX = hingeX;

  // Simbolo DIN (triangolo prospetto): apice sul lato cerniere, base sul lato maniglia.
  // Solido = a tirare (verso l'osservatore), tratteggiato = a spingere.
  const openingSolid = input.versoApertura === "tiro";
  const trianglePoints = `${apexX},${leafMidY} ${handleX},${leafTop} ${handleX},${leafBottom}`;

  // Cerniere: 3 tacche sul lato cerniere
  const cerniereY = [leafTop + anteH * 0.12, leafMidY, leafBottom - anteH * 0.12];
  const hingeW = teW * 0.05;

  // Maniglia
  const handleY = leafMidY;
  const handleDir = cerniereSinistra ? -1 : 1; // rientra verso l'interno dell'anta
  const handleLen = teW * 0.09;

  const viewBox = `${-padX} ${-padTop} ${W + 2 * padX} ${H + padTop + padBottom}`;

  return (
    <svg
      viewBox={viewBox}
      width="100%"
      role="img"
      aria-label={`Schema porta ${risultato.din}, ${risultato.descrizioneApertura}`}
      style={{ maxHeight: "62vh", display: "block" }}
    >
      {/* Foro muro */}
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill="none"
        stroke="#7d8ea0"
        strokeWidth={stroke}
        strokeDasharray={`${stroke * 4} ${stroke * 3}`}
      />
      {/* Pavimento */}
      <line x1={-padX * 0.6} y1={H} x2={W + padX * 0.6} y2={H} stroke="#7d8ea0" strokeWidth={stroke} />

      {/* Telaio esterno */}
      <rect x={teX} y={teY} width={teW} height={teH} fill="#182029" stroke="#e7c07a" strokeWidth={stroke * 1.4} />

      {/* Sopraluce */}
      {sopraluce && (
        <>
          <rect x={teX} y={teY} width={teW} height={sopraluce.altezzaMm} fill="#0f3b52" stroke="#7fb8d6" strokeWidth={stroke} />
          <text x={teX + teW / 2} y={teY + sopraluce.altezzaMm / 2} fontSize={font} fill="#cfe6f2" textAnchor="middle" dominantBaseline="central">
            SOPRALUCE
          </text>
          <line x1={teX} y1={anteTop} x2={teX + teW} y2={anteTop} stroke="#e7c07a" strokeWidth={stroke} />
        </>
      )}

      {/* Anta fissa */}
      {antaFissa && (
        <>
          <rect x={fissaX} y={anteTop} width={fissaW} height={anteH} fill="#12303a" stroke="#8fd0c4" strokeWidth={stroke} />
          <text x={fissaX + fissaW / 2} y={leafMidY} fontSize={font} fill="#cdeee7" textAnchor="middle" dominantBaseline="central">
            FISSA
          </text>
        </>
      )}

      {/* Anta mobile */}
      <rect x={leafLeft} y={leafTop} width={mobileW} height={anteH} fill="#20303f" stroke="#38c07f" strokeWidth={stroke * 1.2} />

      {/* Simbolo apertura DIN */}
      <polygon
        points={trianglePoints}
        fill="none"
        stroke={openingSolid ? "#38c07f" : "#f2a33c"}
        strokeWidth={stroke}
        strokeDasharray={openingSolid ? undefined : `${stroke * 3} ${stroke * 2}`}
      />

      {/* Cerniere */}
      {cerniereY.map((cy, i) => (
        <rect
          key={i}
          x={cerniereSinistra ? hingeX - hingeW / 2 : hingeX - hingeW / 2}
          y={cy - hingeW}
          width={hingeW}
          height={hingeW * 2}
          fill="#e7c07a"
        />
      ))}

      {/* Maniglia */}
      <g>
        <circle cx={handleX + handleDir * handleLen * 0.4} cy={handleY} r={hingeW * 0.7} fill="#f2a33c" />
        <rect
          x={cerniereSinistra ? handleX - handleLen : handleX}
          y={handleY - hingeW * 0.35}
          width={handleLen}
          height={hingeW * 0.7}
          fill="#f2a33c"
        />
      </g>

      {/* Oblò */}
      {oblo && oblo.forma !== "nessuno" && (
        (() => {
          const cx = (leafLeft + leafRight) / 2;
          const cy = leafTop + anteH * 0.32;
          if (oblo.forma === "rettangolare") {
            return (
              <rect
                x={cx - oblo.larghezzaMm / 2}
                y={cy - oblo.altezzaMm / 2}
                width={oblo.larghezzaMm}
                height={oblo.altezzaMm}
                fill="#0f3b52"
                stroke="#7fb8d6"
                strokeWidth={stroke}
              />
            );
          }
          return (
            <ellipse
              cx={cx}
              cy={cy}
              rx={oblo.larghezzaMm / 2}
              ry={(oblo.forma === "tondo" ? oblo.larghezzaMm : oblo.altezzaMm) / 2}
              fill="#0f3b52"
              stroke="#7fb8d6"
              strokeWidth={stroke}
            />
          );
        })()
      )}

      {/* Vetro (specchiatura) senza oblò */}
      {input.opzioni.vetro && (!oblo || oblo.forma === "nessuno") && (
        <rect
          x={leafLeft + mobileW * 0.18}
          y={leafTop + anteH * 0.12}
          width={mobileW * 0.64}
          height={anteH * 0.42}
          fill="#0f3b52"
          stroke="#7fb8d6"
          strokeWidth={stroke}
          strokeDasharray={`${stroke * 2} ${stroke * 2}`}
        />
      )}

      {/* Quote foro (larghezza in alto, altezza a sinistra) */}
      <text x={W / 2} y={-padTop * 0.35} fontSize={font} fill="#9fb0c0" textAnchor="middle">
        Foro {Math.round(W / 10)} cm
      </text>
      <text
        x={-padX * 0.5}
        y={H / 2}
        fontSize={font}
        fill="#9fb0c0"
        textAnchor="middle"
        transform={`rotate(-90 ${-padX * 0.5} ${H / 2})`}
      >
        Foro {Math.round(H / 10)} cm
      </text>

      {/* Etichetta anta + DIN */}
      <text x={(leafLeft + leafRight) / 2} y={leafBottom + padBottom * 0.5} fontSize={font} fill="#38c07f" textAnchor="middle">
        ANTA {Math.round(anta.larghezzaMm / 10)}×{Math.round(anta.altezzaMm / 10)} · {risultato.din}
      </text>
    </svg>
  );
}
