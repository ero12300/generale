import type { RisultatoCalcolo } from "@/lib/door/types";

interface DoorSchemeProps {
  r: RisultatoCalcolo;
}

/**
 * Schema tecnico (prospetto) della porta disegnato in SVG.
 * Il sistema di coordinate del viewBox è espresso in millimetri
 * più un margine fisso per le quote.
 */
export function DoorScheme({ r }: DoorSchemeProps) {
  const Lf = r.foroMuro.larghezza;
  const Hf = r.foroMuro.altezza;

  const padL = 320;
  const padT = 220;
  const padR = 160;
  const padB = 320;

  const vbW = Lf + padL + padR;
  const vbH = Hf + padT + padB;

  // Rettangolo foro muro.
  const fx = padL;
  const fy = padT;

  // Luce di passaggio (centrata in larghezza, appoggiata a pavimento).
  const lp = r.lucePassaggio;
  const lx = fx + (Lf - lp.larghezza) / 2;
  const ly = fy + (Hf - lp.altezza);

  // Suddivisione luce: eventuale sopraluce in alto.
  const traverso = r.deduzioni.traversoIntermedio;
  const sopraH = r.sopraluce ? r.sopraluce.altezza : 0;
  const portaTop = ly + (r.sopraluce ? sopraH + traverso : 0);
  const portaH = ly + lp.altezza - portaTop;

  // Suddivisione luce: eventuale fisso laterale.
  const montante = r.deduzioni.montanteIntermedio;
  const fissoW = r.fisso ? r.fisso.larghezza : 0;
  // Il fisso è collocato sul lato opposto alle cerniere per convenzione grafica.
  const fissoSuCerniere = false;
  const antaAreaW = lp.larghezza - (r.fisso ? fissoW + montante : 0);
  const antaAreaX = r.fisso && !fissoSuCerniere ? lx : lx + (r.fisso ? fissoW + montante : 0);
  const fissoX = r.fisso && !fissoSuCerniere ? lx + antaAreaW + montante : lx;

  const cernSinistra = r.mano.latoCerniere === "sinistra";

  const stroke = "#1e293b";
  const thin = "#94a3b8";
  const dim = "#2563eb";
  const glass = "#dbeafe";

  const fontS = 62;
  const fontM = 74;

  function leafSwing(x: number, w: number, top: number, h: number, hingeLeft: boolean, key: string) {
    const left = x;
    const right = x + w;
    const bottom = top + h;
    const midY = top + h / 2;
    const hingeX = hingeLeft ? left : right;
    const handleX = hingeLeft ? right : left;
    // Diagonali tratteggiate del verso di apertura.
    const swing = `M ${hingeX} ${top} L ${handleX} ${midY} L ${hingeX} ${bottom}`;
    // Cerniere (3 tacche sul lato cerniere).
    const hingeMarks = [top + h * 0.12, midY, bottom - h * 0.12].map((cy, i) => (
      <rect
        key={`${key}-h${i}`}
        x={hingeX - 14}
        y={cy - 34}
        width={28}
        height={68}
        fill={stroke}
        rx={4}
      />
    ));
    // Maniglia sul lato opposto, ~1000 mm da pavimento.
    const handleY = bottom - 1000;
    const handleClampedY = Math.max(top + 60, Math.min(handleY, bottom - 60));
    return (
      <g key={key}>
        <rect x={left} y={top} width={w} height={h} fill="#ffffff" stroke={stroke} strokeWidth={8} />
        <path d={swing} fill="none" stroke={thin} strokeWidth={6} strokeDasharray="26 22" />
        {hingeMarks}
        <rect
          x={hingeLeft ? handleX - 60 : handleX + 32}
          y={handleClampedY - 12}
          width={28}
          height={90}
          rx={8}
          fill="#0f172a"
        />
        {r.accessori.vetro ? (
          <rect
            x={left + w * 0.18}
            y={top + h * 0.12}
            width={w * 0.64}
            height={h * 0.5}
            fill={glass}
            stroke={thin}
            strokeWidth={5}
            rx={10}
          />
        ) : null}
        {r.accessori.ovale ? (
          <ellipse
            cx={left + w / 2}
            cy={top + h * 0.32}
            rx={w * 0.2}
            ry={h * 0.12}
            fill={glass}
            stroke={stroke}
            strokeWidth={6}
          />
        ) : null}
      </g>
    );
  }

  function dimLineH(x1: number, x2: number, y: number, label: string, color = dim) {
    return (
      <g>
        <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={5} />
        <line x1={x1} y1={y - 26} x2={x1} y2={y + 26} stroke={color} strokeWidth={5} />
        <line x1={x2} y1={y - 26} x2={x2} y2={y + 26} stroke={color} strokeWidth={5} />
        <text
          x={(x1 + x2) / 2}
          y={y - 22}
          fill={color}
          fontSize={fontM}
          textAnchor="middle"
          fontWeight={600}
        >
          {label}
        </text>
      </g>
    );
  }

  function dimLineV(y1: number, y2: number, x: number, label: string, color = dim) {
    return (
      <g>
        <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={5} />
        <line x1={x - 26} y1={y1} x2={x + 26} y2={y1} stroke={color} strokeWidth={5} />
        <line x1={x - 26} y1={y2} x2={x + 26} y2={y2} stroke={color} strokeWidth={5} />
        <text
          x={x - 24}
          y={(y1 + y2) / 2}
          fill={color}
          fontSize={fontM}
          textAnchor="middle"
          fontWeight={600}
          transform={`rotate(-90 ${x - 24} ${(y1 + y2) / 2})`}
        >
          {label}
        </text>
      </g>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Schema porta ${r.mano.verso}, ${r.sistemaNome}`}
    >
      <rect x={0} y={0} width={vbW} height={vbH} fill="#ffffff" />

      {/* Foro muro */}
      <rect x={fx} y={fy} width={Lf} height={Hf} fill="#f1f5f9" stroke={stroke} strokeWidth={10} />
      {/* Muratura tratteggio ai lati */}
      <rect x={fx - 60} y={fy} width={60} height={Hf} fill="#e2e8f0" stroke={thin} strokeWidth={4} />
      <rect x={fx + Lf} y={fy} width={60} height={Hf} fill="#e2e8f0" stroke={thin} strokeWidth={4} />

      {/* Luce di passaggio */}
      <rect x={lx} y={ly} width={lp.larghezza} height={lp.altezza} fill="#ffffff" stroke={thin} strokeWidth={6} />

      {/* Sopraluce */}
      {r.sopraluce ? (
        <g>
          <rect x={lx} y={ly} width={lp.larghezza} height={sopraH} fill={r.accessori.vetro ? glass : "#f8fafc"} stroke={stroke} strokeWidth={6} />
          <text x={lx + lp.larghezza / 2} y={ly + sopraH / 2 + 20} fill="#475569" fontSize={fontS} textAnchor="middle">
            SOPRALUCE
          </text>
        </g>
      ) : null}

      {/* Fisso laterale */}
      {r.fisso ? (
        <g>
          <rect x={fissoX} y={portaTop} width={fissoW} height={portaH} fill={r.accessori.vetro ? glass : "#f8fafc"} stroke={stroke} strokeWidth={6} />
          <text
            x={fissoX + fissoW / 2}
            y={portaTop + portaH / 2}
            fill="#475569"
            fontSize={fontS}
            textAnchor="middle"
            transform={`rotate(-90 ${fissoX + fissoW / 2} ${portaTop + portaH / 2})`}
          >
            FISSO
          </text>
        </g>
      ) : null}

      {/* Anta / e */}
      {r.numeroAnte === 2
        ? [
            leafSwing(antaAreaX, antaAreaW / 2, portaTop, portaH, true, "left"),
            leafSwing(antaAreaX + antaAreaW / 2, antaAreaW / 2, portaTop, portaH, false, "right"),
          ]
        : leafSwing(antaAreaX, antaAreaW, portaTop, portaH, cernSinistra, "single")}

      {/* Quote */}
      {dimLineH(fx, fx + Lf, fy - 90, `Foro ${Lf}`)}
      {dimLineV(fy, fy + Hf, fx - 120, `Foro H ${Hf}`)}
      {dimLineH(lx, lx + lp.larghezza, fy + Hf + padB - 210, `Luce ${lp.larghezza}`)}
      {dimLineH(antaAreaX, antaAreaX + (r.numeroAnte === 2 ? antaAreaW / 2 : antaAreaW), fy + Hf + padB - 70, `Anta ${r.anta.larghezza}`, "#0f172a")}
      {dimLineV(fy, fy + Hf, fx + Lf + padR - 30, `Anta H ${r.anta.altezza}`, "#0f172a")}

      {/* Etichette lato */}
      <text x={cernSinistra ? fx + 20 : fx + Lf - 20} y={fy + Hf + 130} fill="#1e293b" fontSize={fontS} fontWeight={700} textAnchor={cernSinistra ? "start" : "end"}>
        {`CERNIERE ${r.mano.latoCerniere.toUpperCase()}`}
      </text>
      <text x={cernSinistra ? fx + Lf - 20 : fx + 20} y={fy + Hf + 130} fill="#2563eb" fontSize={fontS} fontWeight={700} textAnchor={cernSinistra ? "end" : "start"}>
        {`MANIGLIA ${r.mano.latoManiglia.toUpperCase()}`}
      </text>
    </svg>
  );
}
