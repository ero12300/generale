"use client";

import * as React from "react";
import type { CalcoloPorta, ConfigurazionePorta } from "@/lib/door-engine";

/**
 * Renderer SVG dello schema porta a scala.
 * Origine (0,0) in alto a sinistra. Le misure sono in mm ma il viewBox è
 * scalato automaticamente in modo che il disegno finito occupi ~800×1100.
 */

interface Props {
  config: ConfigurazionePorta;
  calcolo: CalcoloPorta;
  className?: string;
  showQuote?: boolean;
  compact?: boolean;
}

const MARGINE = 140; // spazio per quote e didascalie

export const DoorSchema = React.forwardRef<SVGSVGElement, Props>(function DoorSchema(
  { config, calcolo, className, showQuote = true, compact = false },
  ref
) {
  const totL = calcolo.controtelaio.larghezzaMm;
  const totH = calcolo.controtelaio.altezzaMm;
  const lpL = calcolo.lucePassaggio.larghezzaMm;
  const lpH = calcolo.lucePassaggio.altezzaMm;

  const fissoLatL = calcolo.fissoLaterale.presente ? calcolo.fissoLaterale.larghezzaMm : 0;
  const fissoLatLato = calcolo.fissoLaterale.lato ?? "destro";
  const fissoSupH = calcolo.fissoSuperiore.presente ? calcolo.fissoSuperiore.altezzaMm : 0;

  const telaioSpess = 60; // mm — spessore visuale telaio
  const controtelaioSpess = 30; // mm — cornice controtelaio esterna

  const viewW = totL + MARGINE * 2;
  const viewH = totH + MARGINE * 2;

  const originX = MARGINE;
  const originY = MARGINE;

  // Posizione dell'anta principale nel controtelaio (rispetto all'origine del CT)
  const anta = {
    x:
      originX +
      telaioSpess +
      (fissoLatLato === "sinistro" ? fissoLatL : 0),
    y: originY + telaioSpess + fissoSupH,
    w: lpL,
    h: lpH,
  };

  const ovaleGeom = config.ovale.presente
    ? {
        cx: anta.x + anta.w / 2,
        cy: anta.y + anta.h * 0.35,
        rx: Math.min(anta.w * 0.35, config.ovale.larghezzaMm / 2),
        ry: Math.min(anta.h * 0.18, config.ovale.altezzaMm / 2),
      }
    : null;

  const specchiaturaGeom: { x: number; y: number; w: number; h: number }[] = [];
  if (config.specchiatura.presente) {
    const numeroPannelli = config.specchiatura.numeroPannelli;
    const forma = config.specchiatura.forma;
    const padX = anta.w * 0.14;
    const padY = anta.h * 0.1;

    if (forma === "verticale-alta") {
      const totalH = anta.h - padY * 2;
      for (let i = 0; i < numeroPannelli; i++) {
        const w = (anta.w - padX * 2) / numeroPannelli - (numeroPannelli > 1 ? 20 : 0);
        specchiaturaGeom.push({
          x: anta.x + padX + i * (w + (numeroPannelli > 1 ? 20 : 0)),
          y: anta.y + padY,
          w,
          h: totalH,
        });
      }
    } else if (forma === "quadrata") {
      const size = Math.min(anta.w - padX * 2, anta.h * 0.4);
      for (let i = 0; i < numeroPannelli; i++) {
        const w = (anta.w - padX * 2 - (numeroPannelli - 1) * 20) / numeroPannelli;
        specchiaturaGeom.push({
          x: anta.x + padX + i * (w + 20),
          y: anta.y + padY,
          w,
          h: Math.min(w, size),
        });
      }
    } else {
      // rettangolare — impilate verticalmente
      const totalH = anta.h - padY * 2 - (numeroPannelli - 1) * 24;
      const eachH = totalH / numeroPannelli;
      for (let i = 0; i < numeroPannelli; i++) {
        specchiaturaGeom.push({
          x: anta.x + padX,
          y: anta.y + padY + i * (eachH + 24),
          w: anta.w - padX * 2,
          h: eachH,
        });
      }
    }
  }

  // Simbolo apertura (arco che indica il verso)
  const cerniereSuDestra = calcolo.mano === "destra";
  const apreVersoOsservatore = calcolo.verso === "tirare";
  const cerniereX = cerniereSuDestra ? anta.x + anta.w : anta.x;
  const cerniereY = anta.y;
  const arcRadius = Math.min(anta.w, anta.h) * 0.92;
  const arcEndX = cerniereSuDestra ? cerniereX - arcRadius : cerniereX + arcRadius;
  const arcEndY = cerniereY + arcRadius;
  const sweep = cerniereSuDestra ? 0 : 1;
  const arcPath = `M ${cerniereX} ${cerniereY} L ${cerniereX} ${arcEndY} A ${arcRadius} ${arcRadius} 0 0 ${sweep} ${arcEndX} ${cerniereY} Z`;

  const maniglia = {
    x: cerniereSuDestra ? anta.x + 45 : anta.x + anta.w - 45,
    y: anta.y + anta.h * 0.5,
  };

  const fissoLatGeom = calcolo.fissoLaterale.presente
    ? {
        x:
          fissoLatLato === "sinistro"
            ? originX + telaioSpess
            : originX + telaioSpess + fissoLatL + lpL,
        y: originY + telaioSpess + fissoSupH,
        w: fissoLatL,
        h: lpH,
      }
    : null;

  const fissoSupGeom = calcolo.fissoSuperiore.presente
    ? {
        x: originX + telaioSpess,
        y: originY + telaioSpess,
        w: totL - telaioSpess * 2,
        h: fissoSupH,
      }
    : null;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${viewW} ${viewH}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Schema porta ${config.modello}, ${calcolo.siglaManoVerso}`}
    >
      <rect x={0} y={0} width={viewW} height={viewH} fill="#ffffff" />

      {/* Vano murario — tratteggio */}
      <rect
        x={originX - controtelaioSpess}
        y={originY - controtelaioSpess}
        width={totL + controtelaioSpess * 2}
        height={totH + controtelaioSpess * 2}
        fill="none"
        stroke="#a97b52"
        strokeWidth={5}
        strokeDasharray="20 12"
        opacity={0.6}
      />

      {/* Controtelaio */}
      <rect
        x={originX}
        y={originY}
        width={totL}
        height={totH}
        fill="#f3ede2"
        stroke="#7a4e2b"
        strokeWidth={4}
      />

      {/* Telaio interno (imbotte) */}
      <rect
        x={originX + telaioSpess}
        y={originY + telaioSpess}
        width={totL - telaioSpess * 2}
        height={totH - telaioSpess * 2}
        fill="#ffffff"
        stroke="#c9b892"
        strokeWidth={2}
      />

      {/* Fisso superiore */}
      {fissoSupGeom ? (
        <g>
          <rect
            x={fissoSupGeom.x}
            y={fissoSupGeom.y}
            width={fissoSupGeom.w}
            height={fissoSupGeom.h}
            fill={config.fissoSuperiore.vetrato ? "#dfe9f0" : "#e8dfcf"}
            stroke="#7a4e2b"
            strokeWidth={2}
          />
          {config.fissoSuperiore.vetrato ? (
            <line
              x1={fissoSupGeom.x + fissoSupGeom.w * 0.15}
              y1={fissoSupGeom.y + fissoSupGeom.h * 0.15}
              x2={fissoSupGeom.x + fissoSupGeom.w * 0.85}
              y2={fissoSupGeom.y + fissoSupGeom.h * 0.85}
              stroke="#8faed0"
              strokeWidth={1.5}
              opacity={0.6}
            />
          ) : null}
          <text
            x={fissoSupGeom.x + fissoSupGeom.w / 2}
            y={fissoSupGeom.y + fissoSupGeom.h / 2 + 8}
            fontSize={24}
            fill="#4a4a4a"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            SOPRALUCE
          </text>
        </g>
      ) : null}

      {/* Fisso laterale */}
      {fissoLatGeom ? (
        <g>
          <rect
            x={fissoLatGeom.x}
            y={fissoLatGeom.y}
            width={fissoLatGeom.w}
            height={fissoLatGeom.h}
            fill={config.fissoLaterale.vetrato ? "#dfe9f0" : "#e8dfcf"}
            stroke="#7a4e2b"
            strokeWidth={2}
          />
          {config.fissoLaterale.vetrato ? (
            <line
              x1={fissoLatGeom.x + fissoLatGeom.w * 0.1}
              y1={fissoLatGeom.y + fissoLatGeom.h * 0.1}
              x2={fissoLatGeom.x + fissoLatGeom.w * 0.9}
              y2={fissoLatGeom.y + fissoLatGeom.h * 0.5}
              stroke="#8faed0"
              strokeWidth={1.5}
              opacity={0.6}
            />
          ) : null}
          <text
            x={fissoLatGeom.x + fissoLatGeom.w / 2}
            y={fissoLatGeom.y + fissoLatGeom.h / 2}
            fontSize={22}
            fill="#4a4a4a"
            textAnchor="middle"
            fontFamily="sans-serif"
            transform={`rotate(-90 ${fissoLatGeom.x + fissoLatGeom.w / 2} ${fissoLatGeom.y + fissoLatGeom.h / 2})`}
          >
            FISSO LATERALE
          </text>
        </g>
      ) : null}

      {/* Anta */}
      <g>
        {/* Simbolo apertura */}
        <path
          d={arcPath}
          fill="none"
          stroke="#7a4e2b"
          strokeWidth={2}
          strokeDasharray="8 6"
          opacity={0.55}
        />
        {/* Anta */}
        <rect
          x={anta.x}
          y={anta.y}
          width={anta.w}
          height={anta.h}
          fill="#d9b98d"
          stroke="#7a4e2b"
          strokeWidth={3}
        />
        {/* Venatura legno */}
        <g clipPath="url(#antaClip)" opacity={0.35}>
          {Array.from({ length: 22 }).map((_, i) => (
            <line
              key={i}
              x1={anta.x}
              y1={anta.y + (i * anta.h) / 22}
              x2={anta.x + anta.w}
              y2={anta.y + (i * anta.h) / 22 + 4}
              stroke="#7a4e2b"
              strokeWidth={0.6}
            />
          ))}
        </g>
        <clipPath id="antaClip">
          <rect x={anta.x} y={anta.y} width={anta.w} height={anta.h} />
        </clipPath>

        {/* Specchiatura */}
        {specchiaturaGeom.map((s, i) => (
          <g key={i}>
            <rect
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              fill="#dfe9f0"
              stroke="#7a4e2b"
              strokeWidth={2}
            />
            <line
              x1={s.x + s.w * 0.15}
              y1={s.y + s.h * 0.15}
              x2={s.x + s.w * 0.85}
              y2={s.y + s.h * 0.85}
              stroke="#8faed0"
              strokeWidth={1.5}
              opacity={0.7}
            />
          </g>
        ))}

        {/* Ovale */}
        {ovaleGeom ? (
          <g>
            <ellipse
              cx={ovaleGeom.cx}
              cy={ovaleGeom.cy}
              rx={ovaleGeom.rx}
              ry={ovaleGeom.ry}
              fill="#dfe9f0"
              stroke="#7a4e2b"
              strokeWidth={2.5}
            />
            <line
              x1={ovaleGeom.cx - ovaleGeom.rx * 0.6}
              y1={ovaleGeom.cy - ovaleGeom.ry * 0.5}
              x2={ovaleGeom.cx + ovaleGeom.rx * 0.6}
              y2={ovaleGeom.cy + ovaleGeom.ry * 0.5}
              stroke="#8faed0"
              strokeWidth={1.5}
              opacity={0.7}
            />
          </g>
        ) : null}

        {/* Maniglia */}
        <g>
          <circle cx={maniglia.x} cy={maniglia.y} r={8} fill="#1a1a1a" />
          <rect
            x={cerniereSuDestra ? maniglia.x - 4 : maniglia.x - 30}
            y={maniglia.y - 4}
            width={34}
            height={8}
            rx={3}
            fill="#1a1a1a"
          />
        </g>

        {/* Cerniere */}
        {[0.15, 0.5, 0.85].map((frac, i) => (
          <rect
            key={i}
            x={cerniereSuDestra ? cerniereX - 12 : cerniereX - 6}
            y={anta.y + anta.h * frac - 15}
            width={18}
            height={30}
            fill="#1a1a1a"
            rx={2}
          />
        ))}
      </g>

      {/* Freccia verso apertura */}
      <g>
        <text
          x={anta.x + anta.w / 2}
          y={anta.y + anta.h + 45}
          fontSize={24}
          fill="#7a4e2b"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight={600}
        >
          {calcolo.siglaManoVerso} — {apreVersoOsservatore ? "TIRARE" : "SPINGERE"}
        </text>
      </g>

      {/* Quote */}
      {showQuote ? (
        <g fontFamily="sans-serif" fontSize={22} fill="#4a4a4a">
          {/* Quota larghezza vano */}
          <line
            x1={originX - controtelaioSpess}
            y1={originY - 60}
            x2={originX + totL + controtelaioSpess}
            y2={originY - 60}
            stroke="#a97b52"
            strokeWidth={1.5}
          />
          <line
            x1={originX - controtelaioSpess}
            y1={originY - 70}
            x2={originX - controtelaioSpess}
            y2={originY - 50}
            stroke="#a97b52"
            strokeWidth={1.5}
          />
          <line
            x1={originX + totL + controtelaioSpess}
            y1={originY - 70}
            x2={originX + totL + controtelaioSpess}
            y2={originY - 50}
            stroke="#a97b52"
            strokeWidth={1.5}
          />
          <text
            x={originX + totL / 2}
            y={originY - 70}
            textAnchor="middle"
            fontWeight={600}
            fill="#7a4e2b"
          >
            Vano {calcolo.vano.larghezzaMm} mm
          </text>

          {/* Quota altezza vano */}
          <line
            x1={originX - 70}
            y1={originY - controtelaioSpess}
            x2={originX - 70}
            y2={originY + totH + controtelaioSpess}
            stroke="#a97b52"
            strokeWidth={1.5}
          />
          <text
            x={originX - 90}
            y={originY + totH / 2}
            textAnchor="middle"
            fontWeight={600}
            fill="#7a4e2b"
            transform={`rotate(-90 ${originX - 90} ${originY + totH / 2})`}
          >
            Vano {calcolo.vano.altezzaMm} mm
          </text>

          {/* Anta larghezza */}
          {!compact ? (
            <>
              <text
                x={anta.x + anta.w / 2}
                y={anta.y + anta.h / 2 - 6}
                textAnchor="middle"
                fontSize={20}
                fill="#3a1e0a"
                fontWeight={600}
              >
                ANTA
              </text>
              <text
                x={anta.x + anta.w / 2}
                y={anta.y + anta.h / 2 + 20}
                textAnchor="middle"
                fontSize={18}
                fill="#3a1e0a"
              >
                {calcolo.anta.larghezzaMm} × {calcolo.anta.altezzaMm} mm
              </text>
            </>
          ) : null}

          {/* Legenda controtelaio */}
          <text
            x={originX + totL + 20}
            y={originY + 24}
            fontSize={18}
            fill="#7a4e2b"
          >
            Controtelaio
          </text>
          <text
            x={originX + totL + 20}
            y={originY + 48}
            fontSize={18}
            fill="#7a4e2b"
          >
            {calcolo.controtelaio.larghezzaMm}×{calcolo.controtelaio.altezzaMm} mm
          </text>
        </g>
      ) : null}
    </svg>
  );
});
