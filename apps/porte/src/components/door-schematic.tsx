"use client";

import type { DoorResult } from "@/lib/types";

/**
 * Schema tecnico della porta in elevazione (vista frontale).
 * Convenzione tecnica del verso di apertura: il triangolo ha il vertice sul
 * lato delle cerniere; linee piene = la porta si apre verso chi guarda (tira),
 * linee tratteggiate = si apre in allontanamento (spinge).
 * Per scorrevoli viene mostrata la freccia di scorrimento (e il vano a
 * scomparsa tratteggiato).
 */
export function DoorSchematic({ result }: { result: DoorResult }) {
  const { input } = result;
  const PAD = 130;

  const foroW = input.foroLarghezza;
  const foroH = input.foroAltezza;
  const isSwing =
    input.tipoApertura === "battente" || input.tipoApertura === "compasso";
  const isPocket = input.tipoApertura === "scomparsa";
  const isSlide = input.tipoApertura === "scorrevole_esterno";

  // Larghezza area di disegno (per scorrevoli/scomparsa serve spazio laterale).
  const contentW = isSwing ? foroW : result.ingombroTotale.larghezza;
  const contentH = Math.max(foroH, result.ingombroTotale.altezza);

  const vbW = contentW + PAD * 2;
  const vbH = contentH + PAD * 2 + 90;

  const ink = "#12161c";
  const muted = "#5c6773";
  const accent = "#c2410c";
  const line = "#c7cfd8";
  const glass = "#dbeafe";

  // Riquadro foro/luce centrato in alto.
  const foroX = PAD + (contentW - foroW) / 2;
  const foroY = PAD;

  // Telaio interno (per battente) o coincidente col foro per gli altri.
  const telW = isSwing ? result.telaio.larghezza : foroW;
  const telH = isSwing ? result.telaio.altezza : foroH;
  const telX = foroX + (foroW - telW) / 2;
  const telY = foroY + (foroH - telH) / 2;

  const hingeRight = input.verso === "dx";
  const fs = Math.round(vbW / 24);

  // ---- Geometria anta mobile ----
  let leafX = telX;
  let leafY = telY;
  let leafW = result.anta.larghezza;
  let leafH = result.anta.altezza;

  const fixed = result.antaFissa;

  if (isSwing) {
    // reveal tra telaio e anta
    leafW = result.anta.larghezza;
    leafH = result.anta.altezza;
    leafY = telY + (telH - leafH) / 2;
    if (fixed) {
      // Anta fissa sul lato cerniere; anta mobile verso la maniglia.
      if (hingeRight) {
        leafX = telX + (telW - leafW) - 20;
      } else {
        leafX = telX + 20;
      }
    } else {
      leafX = telX + (telW - leafW) / 2;
    }
  } else if (isSlide) {
    // Anta sovrapposta al foro, parcheggia sul lato "verso".
    leafW = result.anta.larghezza;
    leafH = result.anta.altezza;
    leafY = foroY - 15;
    leafX = hingeRight ? foroX + foroW - leafW + 10 : foroX - 10;
  } else if (isPocket) {
    leafW = result.anta.larghezza;
    leafH = result.anta.altezza;
    leafY = foroY;
    leafX = foroX + (foroW - leafW) / 2;
  }

  const midY = leafY + leafH / 2;
  const hingeX = hingeRight ? leafX + leafW : leafX;
  const handleX = hingeRight ? leafX : leafX + leafW;
  const handleInset = hingeRight ? leafX + 60 : leafX + leafW - 60;

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      className="h-auto w-full"
      role="img"
      aria-label="Schema tecnico della porta"
    >
      <rect x="0" y="0" width={vbW} height={vbH} fill="#ffffff" />

      {/* Foro muro / luce di passaggio */}
      <rect
        x={foroX}
        y={foroY}
        width={foroW}
        height={foroH}
        fill="none"
        stroke={line}
        strokeWidth={6}
        strokeDasharray="24 16"
      />

      {/* Vano a scomparsa (controtelaio) */}
      {isPocket ? (
        <rect
          x={hingeRight ? foroX + foroW : foroX - foroW}
          y={foroY}
          width={foroW}
          height={foroH}
          fill="#f1f5f9"
          stroke={line}
          strokeWidth={5}
          strokeDasharray="18 12"
        />
      ) : null}

      {/* Telaio (battente) */}
      {isSwing ? (
        <rect
          x={telX}
          y={telY}
          width={telW}
          height={telH}
          fill="none"
          stroke={muted}
          strokeWidth={7}
        />
      ) : null}

      {/* Anta fissa */}
      {fixed && isSwing ? (
        <rect
          x={hingeRight ? telX + 20 : telX + telW - fixed.larghezza - 20}
          y={leafY}
          width={fixed.larghezza}
          height={fixed.altezza}
          fill="#f8fafc"
          stroke={muted}
          strokeWidth={5}
        />
      ) : null}

      {/* Anta mobile */}
      <rect
        x={leafX}
        y={leafY}
        width={leafW}
        height={leafH}
        rx={6}
        fill="#ffffff"
        stroke={ink}
        strokeWidth={8}
      />

      {/* Vetro / specchiatura */}
      {input.vetro ? (
        <rect
          x={leafX + leafW * 0.18}
          y={leafY + leafH * 0.1}
          width={leafW * 0.64}
          height={leafH * 0.42}
          rx={8}
          fill={glass}
          stroke="#93c5fd"
          strokeWidth={5}
        />
      ) : null}

      {/* Oblò */}
      {input.oblo === "tondo" ? (
        <circle
          cx={leafX + leafW / 2}
          cy={leafY + leafH * 0.32}
          r={Math.min(leafW, leafH) * 0.13}
          fill={glass}
          stroke="#93c5fd"
          strokeWidth={5}
        />
      ) : null}
      {input.oblo === "ovale" ? (
        <ellipse
          cx={leafX + leafW / 2}
          cy={leafY + leafH * 0.32}
          rx={leafW * 0.17}
          ry={leafH * 0.11}
          fill={glass}
          stroke="#93c5fd"
          strokeWidth={5}
        />
      ) : null}

      {/* Cerniere (lato apertura) */}
      {isSwing
        ? [0.16, 0.5, 0.84].map((t) => (
            <rect
              key={t}
              x={hingeX - 9}
              y={leafY + leafH * t - 34}
              width={18}
              height={68}
              rx={3}
              fill={accent}
            />
          ))
        : null}

      {/* Maniglia (lato opposto alle cerniere) */}
      {isSwing || isSlide ? (
        <g>
          <rect
            x={hingeRight ? handleInset : handleInset - 70}
            y={midY - 9}
            width={70}
            height={18}
            rx={9}
            fill={ink}
          />
        </g>
      ) : null}

      {/* Triangolo di apertura (battente/compasso) */}
      {isSwing ? (
        <g
          stroke={accent}
          strokeWidth={5}
          fill="none"
          strokeDasharray={input.spinta === "spinge" ? "20 14" : undefined}
        >
          <line x1={hingeX} y1={midY} x2={handleX} y2={leafY} />
          <line x1={hingeX} y1={midY} x2={handleX} y2={leafY + leafH} />
        </g>
      ) : null}

      {/* Freccia di scorrimento */}
      {isSlide || isPocket ? (
        <g stroke={accent} strokeWidth={6} fill="none">
          <line
            x1={leafX + leafW / 2}
            y1={leafY + leafH + 46}
            x2={hingeRight ? leafX + leafW + 120 : leafX - 120}
            y2={leafY + leafH + 46}
          />
          <polyline
            points={
              hingeRight
                ? `${leafX + leafW + 90},${leafY + leafH + 26} ${leafX + leafW + 120},${leafY + leafH + 46} ${leafX + leafW + 90},${leafY + leafH + 66}`
                : `${leafX - 90},${leafY + leafH + 26} ${leafX - 120},${leafY + leafH + 46} ${leafX - 90},${leafY + leafH + 66}`
            }
          />
        </g>
      ) : null}

      {/* Quota larghezza (anta) */}
      <g stroke={muted} strokeWidth={3} fill={muted}>
        <line x1={leafX} y1={leafY + leafH + 90} x2={leafX + leafW} y2={leafY + leafH + 90} />
        <line x1={leafX} y1={leafY + leafH + 78} x2={leafX} y2={leafY + leafH + 102} />
        <line
          x1={leafX + leafW}
          y1={leafY + leafH + 78}
          x2={leafX + leafW}
          y2={leafY + leafH + 102}
        />
      </g>
      <text
        x={leafX + leafW / 2}
        y={leafY + leafH + 90 + fs + 8}
        textAnchor="middle"
        fontSize={fs}
        fill={ink}
        fontWeight={700}
      >
        {result.anta.larghezza} mm
      </text>

      {/* Quota altezza (anta) */}
      <g stroke={muted} strokeWidth={3} fill={muted}>
        <line x1={leafX - 55} y1={leafY} x2={leafX - 55} y2={leafY + leafH} />
        <line x1={leafX - 67} y1={leafY} x2={leafX - 43} y2={leafY} />
        <line x1={leafX - 67} y1={leafY + leafH} x2={leafX - 43} y2={leafY + leafH} />
      </g>
      <text
        x={leafX - 70}
        y={midY}
        textAnchor="middle"
        fontSize={fs}
        fill={ink}
        fontWeight={700}
        transform={`rotate(-90 ${leafX - 70} ${midY})`}
      >
        {result.anta.altezza} mm
      </text>
    </svg>
  );
}
