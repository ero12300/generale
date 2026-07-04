"use client";

import * as React from "react";
import type { LatoCerniere, RisultatoCalcolo } from "@/lib/porte/types";

interface PortaSchemaProps {
  risultato: RisultatoCalcolo;
  cerniere: LatoCerniere;
  manovra: "spingere" | "tirare";
  /** Se true, ottimizzato per export (rimuove eventuali interazioni). */
  print?: boolean;
}

/**
 * Schema tecnico della porta in vista frontale.
 * Rappresenta in scala il foro muro con controtelaio (tratteggiato dentro
 * il muro), telaio, luce di passaggio, anta.
 *
 * Al centro/piede indica il verso di apertura come "arco quadrante" (planimetria
 * accanto al prospetto), la posizione della maniglia e la posizione
 * delle cerniere.
 */
export function PortaSchema({ risultato, cerniere, manovra }: PortaSchemaProps) {
  const isScorrevole =
    risultato.tipologia === "scorrevole_esterno" ||
    risultato.tipologia === "scorrevole_scomparsa";

  // Larghezza totale disegno: foro muro (o ingombro se scorrevole) + eventuale fisso.
  const fisso = risultato.fissoLaterale;
  const soprL = risultato.sopraluce;

  const baseW = isScorrevole
    ? risultato.ingombroParete?.larghezza ?? risultato.foroMuro.larghezza
    : risultato.foroMuro.larghezza;

  const totWmm =
    baseW +
    (fisso ? fisso.larghezza + 40 : 0);
  const totHmm =
    risultato.foroMuro.altezza + (soprL ? soprL.altezza + 40 : 0);

  // Viewport SVG proporzionale, con padding per annotazioni
  const VB_W = 900;
  const padX = 90;
  const padY = 60;
  const drawW = VB_W - 2 * padX;
  const scale = drawW / totWmm;
  const drawH = totHmm * scale;
  const VB_H = drawH + 2 * padY;

  // Origine (in coordinate SVG) del foro muro principale
  const origX = padX + (fisso && fisso.lato === "sx" ? (fisso.larghezza + 40) * scale : 0);
  const origY = padY + (soprL ? (soprL.altezza + 40) * scale : 0);
  const foroW = risultato.foroMuro.larghezza * scale;
  const foroH = risultato.foroMuro.altezza * scale;

  // Anta, telaio, controtelaio dentro il foro muro (centrati)
  const cti = risultato.controtelaio.presente
    ? risultato.controtelaio.interno
    : null;
  const cte = risultato.controtelaio.presente
    ? risultato.controtelaio.esterno
    : null;

  const rectCenter = (
    origX0: number,
    origY0: number,
    outerW: number,
    outerH: number,
    innerW: number,
    innerH: number
  ) => ({
    x: origX0 + (outerW - innerW) / 2,
    y: origY0 + (outerH - innerH),
    w: innerW,
    h: innerH,
  });

  // Controtelaio (esterno) tratteggiato dentro il foro muro
  const cteRect = cte
    ? rectCenter(origX, origY, foroW, foroH, cte.larghezza * scale, cte.altezza * scale)
    : null;
  // Controtelaio (interno)
  const ctiRect = cti
    ? rectCenter(origX, origY, foroW, foroH, cti.larghezza * scale, cti.altezza * scale)
    : null;
  // Telaio esterno
  const telE = risultato.telaio.esterno;
  const telaioRect = rectCenter(
    origX,
    origY,
    foroW,
    foroH,
    telE.larghezza * scale,
    telE.altezza * scale
  );
  // Anta (interno telaio)
  const ant = risultato.anta;
  const antRect = rectCenter(
    origX,
    origY,
    foroW,
    foroH,
    ant.larghezza * scale,
    ant.altezza * scale
  );

  // Fisso laterale (se presente)
  const fissoRect = fisso
    ? {
        x:
          fisso.lato === "sx"
            ? padX
            : origX + foroW + 40 * scale,
        y: origY + (foroH - fisso.altezza * scale),
        w: fisso.larghezza * scale,
        h: fisso.altezza * scale,
      }
    : null;

  // Sopraluce (se presente)
  const sopraluceRect = soprL
    ? {
        x: origX,
        y: padY,
        w: soprL.larghezza * scale,
        h: soprL.altezza * scale,
      }
    : null;

  // Colori
  const c = {
    muro: "#e2e8f0",
    muroBordo: "#94a3b8",
    controtelaio: "#f59e0b",
    telaio: "#0f172a",
    anta: "#dbeafe",
    antaBordo: "#1d4ed8",
    fisso: "#e0f2fe",
    fissoBordo: "#0369a1",
    quota: "#475569",
    apertura: "#dc2626",
    obloFill: "#f1f5f9",
  };

  // Coordinate cerniere e maniglia sull'anta
  const cernX = cerniere === "sx" ? antRect.x : antRect.x + antRect.w;
  const manigliaX = cerniere === "sx" ? antRect.x + antRect.w - 24 : antRect.x + 24;
  const manigliaY = antRect.y + antRect.h * 0.55;

  // Arco di apertura (planimetria dell'anta a 90°): la posiziono in basso
  // rispetto all'anta, come quarto di cerchio
  const arcRadius = antRect.w;
  const arcCX = cernX;
  const arcCY = antRect.y + antRect.h;
  const arcEndX =
    cerniere === "sx" ? arcCX + arcRadius : arcCX - arcRadius;
  const arcEndY = arcCY - arcRadius * 0.35;
  const arcSweep = cerniere === "sx" ? 1 : 0;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      role="img"
      aria-label={`Schema porta ${risultato.tipologia}, verso ${risultato.versoApertura}`}
    >
      {/* Sfondo carta */}
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="white" />

      {/* MURO (foro muro) */}
      <rect
        x={origX}
        y={origY}
        width={foroW}
        height={foroH}
        fill={c.muro}
        stroke={c.muroBordo}
        strokeWidth={1.5}
      />
      <text
        x={origX + foroW / 2}
        y={origY - 8}
        textAnchor="middle"
        fontSize={12}
        fontWeight={600}
        fill={c.quota}
      >
        Foro muro {Math.round(risultato.foroMuro.larghezza)} × {Math.round(risultato.foroMuro.altezza)} mm
      </text>

      {/* Sopraluce */}
      {sopraluceRect && (
        <>
          <rect
            x={sopraluceRect.x}
            y={sopraluceRect.y}
            width={sopraluceRect.w}
            height={sopraluceRect.h}
            fill={c.fisso}
            stroke={c.fissoBordo}
            strokeWidth={1.5}
          />
          <line
            x1={sopraluceRect.x + 8}
            y1={sopraluceRect.y + 8}
            x2={sopraluceRect.x + sopraluceRect.w - 8}
            y2={sopraluceRect.y + sopraluceRect.h - 8}
            stroke={c.fissoBordo}
            strokeWidth={0.8}
            opacity={0.5}
          />
          <line
            x1={sopraluceRect.x + sopraluceRect.w - 8}
            y1={sopraluceRect.y + 8}
            x2={sopraluceRect.x + 8}
            y2={sopraluceRect.y + sopraluceRect.h - 8}
            stroke={c.fissoBordo}
            strokeWidth={0.8}
            opacity={0.5}
          />
          <text
            x={sopraluceRect.x + sopraluceRect.w / 2}
            y={sopraluceRect.y + sopraluceRect.h / 2 + 4}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={c.fissoBordo}
          >
            Sopraluce h {Math.round(soprL!.altezza)} mm
          </text>
        </>
      )}

      {/* Fisso laterale */}
      {fissoRect && (
        <>
          <rect
            x={fissoRect.x}
            y={fissoRect.y}
            width={fissoRect.w}
            height={fissoRect.h}
            fill={c.fisso}
            stroke={c.fissoBordo}
            strokeWidth={1.5}
          />
          <line
            x1={fissoRect.x + 8}
            y1={fissoRect.y + 8}
            x2={fissoRect.x + fissoRect.w - 8}
            y2={fissoRect.y + fissoRect.h - 8}
            stroke={c.fissoBordo}
            strokeWidth={0.8}
            opacity={0.5}
          />
          <text
            x={fissoRect.x + fissoRect.w / 2}
            y={fissoRect.y - 6}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={c.fissoBordo}
          >
            Fisso {fisso!.larghezza} mm
          </text>
        </>
      )}

      {/* CONTROTELAIO esterno (tratteggiato) */}
      {cteRect && (
        <rect
          x={cteRect.x}
          y={cteRect.y}
          width={cteRect.w}
          height={cteRect.h}
          fill="none"
          stroke={c.controtelaio}
          strokeWidth={2}
          strokeDasharray="6 4"
        />
      )}
      {ctiRect && (
        <rect
          x={ctiRect.x}
          y={ctiRect.y}
          width={ctiRect.w}
          height={ctiRect.h}
          fill="none"
          stroke={c.controtelaio}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.7}
        />
      )}

      {/* TELAIO fisso (visibile) */}
      <rect
        x={telaioRect.x}
        y={telaioRect.y}
        width={telaioRect.w}
        height={telaioRect.h}
        fill="none"
        stroke={c.telaio}
        strokeWidth={2.5}
      />

      {/* ANTA */}
      <rect
        x={antRect.x}
        y={antRect.y}
        width={antRect.w}
        height={antRect.h}
        fill={c.anta}
        stroke={c.antaBordo}
        strokeWidth={2}
      />

      {/* Pannellature stilizzate sull'anta (2 riquadri per anta piena) */}
      {risultato.tipologia !== "scorrevole_scomparsa" && (
        <>
          <rect
            x={antRect.x + antRect.w * 0.15}
            y={antRect.y + antRect.h * 0.08}
            width={antRect.w * 0.7}
            height={antRect.h * 0.4}
            fill="none"
            stroke={c.antaBordo}
            strokeWidth={0.8}
            opacity={0.5}
          />
          <rect
            x={antRect.x + antRect.w * 0.15}
            y={antRect.y + antRect.h * 0.52}
            width={antRect.w * 0.7}
            height={antRect.h * 0.4}
            fill="none"
            stroke={c.antaBordo}
            strokeWidth={0.8}
            opacity={0.5}
          />
        </>
      )}

      {/* Cerniere (3 rettangolini sul lato cerniere) */}
      {[0.15, 0.5, 0.85].map((frac, i) => (
        <rect
          key={i}
          x={cernX - 4}
          y={antRect.y + antRect.h * frac - 8}
          width={8}
          height={16}
          fill={c.telaio}
          rx={1}
        />
      ))}

      {/* Maniglia */}
      <g>
        <circle cx={manigliaX} cy={manigliaY} r={5} fill={c.telaio} />
        <rect
          x={cerniere === "sx" ? manigliaX - 16 : manigliaX}
          y={manigliaY - 2}
          width={16}
          height={4}
          fill={c.telaio}
          rx={1}
        />
      </g>

      {/* Oblò */}
      {risultato.oblo && (
        <g>
          {risultato.oblo.forma === "tondo" ? (
            <circle
              cx={antRect.x + antRect.w / 2}
              cy={antRect.y + antRect.h * 0.35}
              r={Math.min(antRect.w * 0.2, 34)}
              fill={c.obloFill}
              stroke={c.antaBordo}
              strokeWidth={1.5}
            />
          ) : (
            <ellipse
              cx={antRect.x + antRect.w / 2}
              cy={antRect.y + antRect.h * 0.35}
              rx={Math.min(antRect.w * 0.25, 44)}
              ry={Math.min(antRect.w * 0.15, 24)}
              fill={c.obloFill}
              stroke={c.antaBordo}
              strokeWidth={1.5}
            />
          )}
        </g>
      )}

      {/* Arco planimetrico apertura (mostra il verso a 90°) — solo per battente/pieghevole */}
      {(risultato.tipologia === "battente" ||
        risultato.tipologia === "filo_muro" ||
        risultato.tipologia === "pieghevole") && (
        <g opacity={0.85}>
          <path
            d={`M ${arcCX} ${arcCY} L ${arcCX} ${arcCY + arcRadius * 0.35} A ${arcRadius * 0.35} ${arcRadius * 0.35} 0 0 ${arcSweep} ${arcEndX} ${arcEndY} L ${arcCX} ${arcCY} Z`}
            fill={c.apertura}
            fillOpacity={0.08}
            stroke={c.apertura}
            strokeWidth={1.2}
            strokeDasharray={manovra === "tirare" ? "4 3" : "0"}
          />
          <text
            x={
              cerniere === "sx"
                ? arcCX + arcRadius * 0.15
                : arcCX - arcRadius * 0.15
            }
            y={arcCY + arcRadius * 0.28}
            textAnchor={cerniere === "sx" ? "start" : "end"}
            fontSize={10}
            fill={c.apertura}
            fontWeight={600}
          >
            {risultato.versoApertura}
          </text>
        </g>
      )}

      {/* Freccia scorrimento per scorrevoli */}
      {isScorrevole && (
        <g>
          <line
            x1={antRect.x - 20}
            y1={antRect.y + antRect.h + 20}
            x2={antRect.x + antRect.w + 20}
            y2={antRect.y + antRect.h + 20}
            stroke={c.apertura}
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <defs>
            <marker
              id="arrow"
              markerWidth={8}
              markerHeight={8}
              refX={4}
              refY={4}
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill={c.apertura} />
            </marker>
          </defs>
          <text
            x={antRect.x + antRect.w / 2}
            y={antRect.y + antRect.h + 34}
            textAnchor="middle"
            fontSize={10}
            fill={c.apertura}
            fontWeight={600}
          >
            Scorrimento — maniglia {risultato.posizioneManiglia.toUpperCase()}
          </text>
        </g>
      )}

      {/* Quote laterale altezza */}
      <g>
        <line
          x1={origX - 30}
          y1={origY}
          x2={origX - 30}
          y2={origY + foroH}
          stroke={c.quota}
          strokeWidth={1}
        />
        <line x1={origX - 34} y1={origY} x2={origX - 26} y2={origY} stroke={c.quota} strokeWidth={1} />
        <line
          x1={origX - 34}
          y1={origY + foroH}
          x2={origX - 26}
          y2={origY + foroH}
          stroke={c.quota}
          strokeWidth={1}
        />
        <text
          x={origX - 40}
          y={origY + foroH / 2}
          textAnchor="middle"
          transform={`rotate(-90, ${origX - 40}, ${origY + foroH / 2})`}
          fontSize={11}
          fontWeight={600}
          fill={c.quota}
        >
          H {Math.round(risultato.foroMuro.altezza)} mm
        </text>
      </g>

      {/* Legend piccola in basso */}
      <g fontSize={10} fill={c.quota}>
        <rect
          x={padX}
          y={VB_H - 32}
          width={12}
          height={8}
          fill="none"
          stroke={c.controtelaio}
          strokeDasharray="3 2"
          strokeWidth={1.5}
        />
        <text x={padX + 18} y={VB_H - 25}>
          Controtelaio
        </text>

        <rect
          x={padX + 130}
          y={VB_H - 32}
          width={12}
          height={8}
          fill="none"
          stroke={c.telaio}
          strokeWidth={2}
        />
        <text x={padX + 148} y={VB_H - 25}>
          Telaio
        </text>

        <rect
          x={padX + 230}
          y={VB_H - 32}
          width={12}
          height={8}
          fill={c.anta}
          stroke={c.antaBordo}
          strokeWidth={1.5}
        />
        <text x={padX + 248} y={VB_H - 25}>
          Anta
        </text>
      </g>
    </svg>
  );
}
