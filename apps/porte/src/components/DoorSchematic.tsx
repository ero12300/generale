"use client";

import type { DoorCalculationResult, DoorOptions } from "@/lib/doorTypes";

interface DoorSchematicProps {
  result: DoorCalculationResult;
  options: DoorOptions;
  printMode?: boolean;
}

export function DoorSchematic({ result, options, printMode = false }: DoorSchematicProps) {
  const SVG_W = 340;
  const SVG_H = 460;
  const MARGIN = 48;

  const drawW = SVG_W - MARGIN * 2;
  const drawH = SVG_H - MARGIN * 2 - 30;

  // Scale factor based on wall hole dimensions
  const totalW = result.luce_muraria_l + (options.hasFisso && result.fisso_l ? result.fisso_l + 10 : 0);
  const scaleX = drawW / totalW;
  const scaleY = drawH / result.luce_muraria_h;
  const scale = Math.min(scaleX, scaleY);

  const doorDrawW = result.luce_muraria_l * scale;
  const doorDrawH = result.luce_muraria_h * scale;

  const hasFisso = options.hasFisso && result.fisso_l !== null;
  const fissoDrawW = hasFisso ? (result.fisso_l ?? 0) * scale : 0;

  const totalDrawW = doorDrawW + (hasFisso ? fissoDrawW + 5 : 0);
  const startX = MARGIN + (drawW - totalDrawW) / 2;
  const startY = MARGIN;

  let antaStartX = startX;
  let fissoStartX = startX;

  if (hasFisso) {
    if (options.fissoSide === "sinistra") {
      fissoStartX = startX;
      antaStartX = startX + fissoDrawW + 5;
    } else {
      antaStartX = startX;
      fissoStartX = startX + doorDrawW + 5;
    }
  }

  const antaDrawW = result.anta_l * scale;
  const antaDrawH = result.anta_h * scale;
  const antaStartY = startY + doorDrawH - antaDrawH;

  // Tolleranze gap per disegno
  const gapLato = result.giunto_morto_lato * scale;
  const gapAlto = result.giunto_morto_alto * scale;
  const gapPavimento = result.giunto_pavimento * scale;

  const antaX = antaStartX + result.profilo_telaio * scale + gapLato;
  const antaY = startY + result.profilo_telaio * scale + gapAlto;

  // Handle position
  const handleOnRight = options.handleSide === "destra";
  const handleX = handleOnRight
    ? antaX + antaDrawW - 12
    : antaX + 8;
  const handleY = antaY + antaDrawH * 0.45;

  // Arc for opening direction
  const isRight = options.openingDirection === "destra";
  const isInward = options.openingVerse === "interno";

  const arcX = isRight ? antaX : antaX + antaDrawW;
  const arcRadius = antaDrawW * 0.85;

  // Colors
  const c = {
    wall: "#3f3f46",
    wallFill: "#27272a",
    frame: "#52525b",
    frameFill: "#1c1c1f",
    door: "#d97706",
    doorFill: "#451a03",
    glass: "#1d4ed8",
    glassFill: "#1e3a5f",
    oval: "#6d28d9",
    text: printMode ? "#111" : "#fafafa",
    textMuted: printMode ? "#555" : "#a1a1aa",
    dim: printMode ? "#333" : "#71717a",
    arc: "#f59e0b",
    handle: "#f59e0b",
    bg: printMode ? "white" : "#0f0f11",
  };

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      width="100%"
      style={{ maxWidth: "100%", background: c.bg, borderRadius: 12 }}
      aria-label="Schema tecnico porta"
    >
      {/* Wall background */}
      <rect x={startX - 8} y={startY - 8} width={totalDrawW + 16} height={doorDrawH + 16} fill={c.wallFill} rx={4} />

      {/* Door frame (telaio) — main opening */}
      <rect
        x={antaStartX}
        y={startY}
        width={doorDrawW}
        height={doorDrawH}
        fill={c.frameFill}
        stroke={c.frame}
        strokeWidth={2}
      />

      {/* Fixed panel if present */}
      {hasFisso && (
        <>
          <rect
            x={fissoStartX}
            y={startY}
            width={fissoDrawW}
            height={doorDrawH}
            fill={c.frameFill}
            stroke={c.frame}
            strokeWidth={2}
          />
          {/* Fisso label */}
          <text
            x={fissoStartX + fissoDrawW / 2}
            y={startY + doorDrawH / 2}
            textAnchor="middle"
            fontSize={9}
            fill={c.textMuted}
          >
            FISSO
          </text>
          {/* Fisso dimension label */}
          <text
            x={fissoStartX + fissoDrawW / 2}
            y={startY + doorDrawH / 2 + 14}
            textAnchor="middle"
            fontSize={8}
            fill={c.dim}
          >
            {result.fisso_l} mm
          </text>
        </>
      )}

      {/* Door anta */}
      <rect
        x={antaX}
        y={antaY}
        width={antaDrawW}
        height={antaDrawH}
        fill={c.doorFill}
        stroke={c.door}
        strokeWidth={1.5}
        rx={1}
      />

      {/* Mostra / glass panel at top */}
      {options.hasMostra && antaDrawH > 80 && (
        <>
          <rect
            x={antaX + antaDrawW * 0.12}
            y={antaY + antaDrawH * 0.04}
            width={antaDrawW * 0.76}
            height={antaDrawH * 0.28}
            fill={c.glassFill}
            stroke={c.glass}
            strokeWidth={1}
            rx={2}
          />
          <text
            x={antaX + antaDrawW / 2}
            y={antaY + antaDrawH * 0.04 + antaDrawH * 0.14 + 4}
            textAnchor="middle"
            fontSize={7}
            fill={c.glass}
          >
            MOSTRA
          </text>
        </>
      )}

      {/* Ovale decorativo */}
      {options.hasOvale && antaDrawH > 60 && (
        <ellipse
          cx={antaX + antaDrawW / 2}
          cy={antaY + antaDrawH * (options.hasMostra ? 0.7 : 0.5)}
          rx={antaDrawW * 0.22}
          ry={antaDrawH * 0.12}
          fill={c.glassFill}
          stroke={c.oval}
          strokeWidth={1}
        />
      )}

      {/* Bussola (portellino oblò) */}
      {options.hasBussola && antaDrawH > 60 && (
        <>
          <circle
            cx={antaX + antaDrawW / 2}
            cy={antaY + antaDrawH * 0.82}
            r={antaDrawW * 0.12}
            fill={c.glassFill}
            stroke="#10b981"
            strokeWidth={1}
          />
          <text
            x={antaX + antaDrawW / 2}
            y={antaY + antaDrawH * 0.82 + 4}
            textAnchor="middle"
            fontSize={6}
            fill="#10b981"
          >
            BUSS.
          </text>
        </>
      )}

      {/* Opening arc */}
      <path
        d={
          isRight
            ? `M ${arcX} ${antaY + antaDrawH} A ${arcRadius} ${arcRadius} 0 0 1 ${arcX + arcRadius} ${antaY + antaDrawH}`
            : `M ${arcX} ${antaY + antaDrawH} A ${arcRadius} ${arcRadius} 0 0 0 ${arcX - arcRadius} ${antaY + antaDrawH}`
        }
        fill="none"
        stroke={c.arc}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.6}
      />

      {/* Hinge marks */}
      {[0.2, 0.5, 0.8].map((ratio, i) => {
        const hx = isRight ? antaX : antaX + antaDrawW - 4;
        const hy = antaY + antaDrawH * ratio;
        return (
          <rect
            key={i}
            x={hx}
            y={hy - 5}
            width={4}
            height={10}
            fill={c.arc}
            rx={1}
          />
        );
      })}

      {/* Handle */}
      <rect
        x={handleX - 3}
        y={handleY - 10}
        width={5}
        height={20}
        fill={c.handle}
        rx={2}
      />
      <circle cx={handleOnRight ? handleX + 2 : handleX - 2} cy={handleY} r={4} fill={c.handle} />

      {/* === DIMENSION LABELS === */}

      {/* Width of wall opening */}
      <line
        x1={antaStartX}
        y1={startY + doorDrawH + 24}
        x2={antaStartX + doorDrawW}
        y2={startY + doorDrawH + 24}
        stroke={c.dim}
        strokeWidth={1}
      />
      <line x1={antaStartX} y1={startY + doorDrawH + 20} x2={antaStartX} y2={startY + doorDrawH + 28} stroke={c.dim} strokeWidth={1} />
      <line x1={antaStartX + doorDrawW} y1={startY + doorDrawH + 20} x2={antaStartX + doorDrawW} y2={startY + doorDrawH + 28} stroke={c.dim} strokeWidth={1} />
      <text
        x={antaStartX + doorDrawW / 2}
        y={startY + doorDrawH + 20}
        textAnchor="middle"
        fontSize={8}
        fill={c.textMuted}
      >
        LM {result.luce_muraria_l} mm
      </text>

      {/* Height of wall opening */}
      <line
        x1={antaStartX - 24}
        y1={startY}
        x2={antaStartX - 24}
        y2={startY + doorDrawH}
        stroke={c.dim}
        strokeWidth={1}
      />
      <line x1={antaStartX - 28} y1={startY} x2={antaStartX - 20} y2={startY} stroke={c.dim} strokeWidth={1} />
      <line x1={antaStartX - 28} y1={startY + doorDrawH} x2={antaStartX - 20} y2={startY + doorDrawH} stroke={c.dim} strokeWidth={1} />
      <text
        x={antaStartX - 30}
        y={startY + doorDrawH / 2}
        textAnchor="middle"
        fontSize={8}
        fill={c.textMuted}
        transform={`rotate(-90, ${antaStartX - 30}, ${startY + doorDrawH / 2})`}
      >
        LM {result.luce_muraria_h} mm
      </text>

      {/* Anta width label */}
      <text
        x={antaX + antaDrawW / 2}
        y={antaY + antaDrawH / 2 - 10}
        textAnchor="middle"
        fontSize={9}
        fontWeight="bold"
        fill={c.door}
      >
        ANTA
      </text>
      <text
        x={antaX + antaDrawW / 2}
        y={antaY + antaDrawH / 2 + 6}
        textAnchor="middle"
        fontSize={8}
        fill={c.door}
      >
        {result.anta_l} × {result.anta_h}
      </text>

      {/* Opening info bottom */}
      <text
        x={SVG_W / 2}
        y={SVG_H - 28}
        textAnchor="middle"
        fontSize={9}
        fill={c.textMuted}
      >
        Apertura {options.openingDirection.toUpperCase()} · {options.openingVerse === "interno" ? "Verso interno" : "Verso esterno"}
      </text>
      <text
        x={SVG_W / 2}
        y={SVG_H - 14}
        textAnchor="middle"
        fontSize={9}
        fill={c.textMuted}
      >
        Maniglia {options.handleSide.toUpperCase()} · {options.doorType === "battente" ? "Battente" : options.doorType === "scorrevole" ? "Scorrevole" : "Complanare"}
      </text>
    </svg>
  );
}
