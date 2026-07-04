"use client";

import type { DimensioniPorta } from "@/lib/porte/types";

interface SchemaSvgProps {
  dimensioni: DimensioniPorta;
  className?: string;
}

const SCALA = 0.18; // scala di rendering
const MARGIN = 60;
const FONT_SIZE = 11;
const FONT_SIZE_SMALL = 9;
const COLORE_TELAIO = "#64748b";
const COLORE_ANTA = "#d97706";
const COLORE_VETRO = "#93c5fd";
const COLORE_FISSO = "#6b7280";
const COLORE_SOPRALUCE = "#6b7280";
const COLORE_TESTO = "#f1f5f9";
const COLORE_QUOTA = "#94a3b8";
const COLORE_ARCO = "#f59e0b";

function mm(v: number) {
  return `${v} mm`;
}

function Quota({
  x1, y1, x2, y2, label, vertical = false
}: {
  x1: number; y1: number; x2: number; y2: number; label: string; vertical?: boolean
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORE_QUOTA} strokeWidth={0.5} strokeDasharray="3,2" />
      <line x1={x1} y1={y1 - (vertical ? 6 : 0)} x2={x1 + (vertical ? 0 : 0)} y2={y1 + (vertical ? 0 : 6)} stroke={COLORE_QUOTA} strokeWidth={0.5} />
      <line x1={x2} y1={y2 - (vertical ? 6 : 0)} x2={x2 + (vertical ? 0 : 0)} y2={y2 + (vertical ? 0 : 6)} stroke={COLORE_QUOTA} strokeWidth={0.5} />
      <text
        x={mx}
        y={my + (vertical ? 0 : -4)}
        textAnchor="middle"
        dominantBaseline={vertical ? "middle" : "auto"}
        fontSize={FONT_SIZE_SMALL}
        fill={COLORE_QUOTA}
        transform={vertical ? `rotate(-90, ${mx}, ${my})` : undefined}
      >
        {label}
      </text>
    </g>
  );
}

export function SchemaSvg({ dimensioni, className }: SchemaSvgProps) {
  const d = dimensioni;
  const S = SCALA;

  // Dimensioni in pixel (scala)
  const W_vano = d.larghezzaVano * S;
  const H_vano = d.altezzaVano * S;
  const W_ct = d.larghezzaControtelaio * S;
  const H_ct = d.altezzaControtelaio * S;
  const W_luce = d.larghezzaLuce * S;
  const H_luce = d.altezzaLuce * S;
  const W_anta = d.larghezzaAnta * S;
  const H_anta = d.altezzaAnta * S;

  const totalW = W_vano + MARGIN * 2 + 80;
  const totalH = H_vano + MARGIN * 2 + 80;

  // Posizioni
  const vanoX = MARGIN + 40;
  const vanoY = MARGIN + 40;

  // Offset controtelaio dentro vano
  const ctOffX = (W_vano - W_ct) / 2;
  const ctOffY = (H_vano - H_ct) / 2;
  const ctX = vanoX + ctOffX;
  const ctY = vanoY + ctOffY;

  // Offset luce dentro controtelaio
  const luceOffX = (W_ct - W_luce) / 2;
  const luceOffY = (H_ct - H_luce) / 2;
  const luceX = ctX + luceOffX;
  const luceY = ctY + luceOffY;

  // Anta: destra o sinistra determina dove è incernierata
  const aperturaDestra = d.apertura === "destra";
  const antaX = aperturaDestra ? luceX + 1.5 : luceX + W_luce - W_anta - 1.5;

  // Fisso laterale
  let fissoX = 0;
  let fissoW = 0;
  if (d.larghezzaFisso) {
    fissoW = d.larghezzaFisso * S;
    fissoX = aperturaDestra
      ? luceX + W_anta + 3 + 4  // fisso a destra dell'anta
      : luceX;                   // fisso a sinistra dell'anta
  }

  // Sopraluce
  let sopraluceY = 0;
  let sopraluceH = 0;
  if (d.altezzaSopraluce) {
    sopraluceH = d.altezzaSopraluce * S;
    sopraluceY = luceY;
  }

  // Arco di apertura
  const raggiArco = W_anta;
  const arcoCentroX = aperturaDestra ? antaX : antaX + W_anta;
  const arcoCentroY = luceY + H_anta + 3;

  // Path arco (90 gradi)
  let arcoPath = "";
  if (d.versoApertura === "verso") {
    if (aperturaDestra) {
      arcoPath = `M ${arcoCentroX + raggiArco} ${arcoCentroY} A ${raggiArco} ${raggiArco} 0 0 0 ${arcoCentroX} ${arcoCentroY - raggiArco}`;
    } else {
      arcoPath = `M ${arcoCentroX - raggiArco} ${arcoCentroY} A ${raggiArco} ${raggiArco} 0 0 1 ${arcoCentroX} ${arcoCentroY - raggiArco}`;
    }
  }

  // Vetro nell'anta
  function renderVetro() {
    const margin = 12;
    const vX = antaX + margin;
    const vW = W_anta - margin * 2;

    if (d.tipoVetro === "intero") {
      return (
        <rect
          x={vX}
          y={luceY + 3 + margin}
          width={vW}
          height={H_anta - margin * 2}
          fill={COLORE_VETRO}
          opacity={0.35}
          stroke={COLORE_VETRO}
          strokeWidth={0.5}
        />
      );
    }
    if (d.tipoVetro === "ovale") {
      const cx = antaX + W_anta / 2;
      const cy = luceY + 3 + H_anta * 0.4;
      const rx = vW * 0.3;
      const ry = H_anta * 0.28;
      return (
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={COLORE_VETRO}
          opacity={0.4}
          stroke={COLORE_VETRO}
          strokeWidth={0.5}
        />
      );
    }
    if (d.tipoVetro === "parziale") {
      return (
        <rect
          x={vX}
          y={luceY + 3 + H_anta * 0.5}
          width={vW}
          height={H_anta * 0.4}
          fill={COLORE_VETRO}
          opacity={0.35}
          stroke={COLORE_VETRO}
          strokeWidth={0.5}
        />
      );
    }
    return null;
  }

  // Posizione maniglia
  const manigliaX = d.posizioneManigliaPorta === "destra"
    ? antaX + W_anta - 8
    : antaX + 6;
  const manigliaY = luceY + 3 + H_anta * 0.45;

  // Freccia verso apertura
  const frecciaDir = d.versoApertura === "verso" ? "▼" : "▲";

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      className={className}
      style={{ background: "#0f172a", borderRadius: 8 }}
      aria-label="Schema tecnico porta"
    >
      {/* Sfondo muro */}
      <rect x={vanoX} y={vanoY} width={W_vano} height={H_vano} fill="#1e293b" stroke="#334155" strokeWidth={1} />

      {/* Hatching muro */}
      <defs>
        <pattern id="muro-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1" />
        </pattern>
        <pattern id="vetro-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="6" y2="6" stroke={COLORE_VETRO} strokeWidth="0.3" opacity={0.3} />
        </pattern>
      </defs>
      <rect x={vanoX} y={vanoY} width={W_vano} height={H_vano} fill="url(#muro-pattern)" />

      {/* Controtelaio */}
      <rect
        x={ctX} y={ctY}
        width={W_ct} height={H_ct}
        fill="#1e2a3a"
        stroke={COLORE_TELAIO}
        strokeWidth={2}
      />

      {/* Area luce (apertura) */}
      <rect
        x={luceX} y={luceY}
        width={W_luce} height={H_luce}
        fill="#0d1117"
        stroke={COLORE_TELAIO}
        strokeWidth={1}
        strokeDasharray="4,2"
      />

      {/* Arco di apertura */}
      {arcoPath && (
        <path d={arcoPath} fill="none" stroke={COLORE_ARCO} strokeWidth={1} strokeDasharray="4,2" opacity={0.6} />
      )}

      {/* Sopraluce */}
      {d.altezzaSopraluce && sopraluceH > 0 && (
        <>
          <rect
            x={luceX} y={sopraluceY}
            width={W_luce} height={sopraluceH}
            fill={COLORE_SOPRALUCE}
            opacity={0.25}
            stroke={COLORE_TELAIO}
            strokeWidth={1}
          />
          <rect
            x={luceX + 4} y={sopraluceY + 4}
            width={W_luce - 8} height={sopraluceH - 8}
            fill={COLORE_VETRO}
            opacity={0.2}
            stroke={COLORE_VETRO}
            strokeWidth={0.5}
          />
          <text x={luceX + W_luce / 2} y={sopraluceY + sopraluceH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={FONT_SIZE_SMALL} fill={COLORE_TESTO} opacity={0.7}>
            SOPRALUCE
          </text>
        </>
      )}

      {/* Fisso laterale */}
      {d.larghezzaFisso && fissoW > 0 && (
        <>
          <rect
            x={fissoX}
            y={luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0)}
            width={fissoW}
            height={d.altezzaFisso! * S}
            fill={COLORE_FISSO}
            opacity={0.3}
            stroke={COLORE_TELAIO}
            strokeWidth={1}
          />
          <text
            x={fissoX + fissoW / 2}
            y={luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0) + (d.altezzaFisso! * S) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={FONT_SIZE_SMALL}
            fill={COLORE_TESTO}
            opacity={0.7}
          >
            FISSO
          </text>
        </>
      )}

      {/* ANTA */}
      <rect
        x={antaX}
        y={luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0) + 1.5}
        width={W_anta}
        height={H_anta}
        fill={COLORE_ANTA}
        opacity={0.25}
        stroke={COLORE_ANTA}
        strokeWidth={1.5}
      />

      {/* Vetro nell'anta */}
      {renderVetro()}

      {/* Maniglia */}
      <circle cx={manigliaX} cy={manigliaY} r={3} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={0.5} />
      <line
        x1={manigliaX}
        y1={manigliaY - 3}
        x2={manigliaX}
        y2={manigliaY + 3}
        stroke="#cbd5e1"
        strokeWidth={1.5}
      />

      {/* Cernier (rettangolini sul lato cerniera) */}
      {[0.2, 0.5, 0.8].map((pct, i) => {
        const cernX = aperturaDestra ? antaX - 2 : antaX + W_anta - 2;
        const cernY = luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0) + 1.5 + H_anta * pct - 5;
        return (
          <rect
            key={i}
            x={cernX}
            y={cernY}
            width={4}
            height={10}
            fill="#94a3b8"
            stroke="#64748b"
            strokeWidth={0.5}
          />
        );
      })}

      {/* Freccia verso apertura */}
      <text
        x={antaX + W_anta / 2}
        y={luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0) + 1.5 + H_anta / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={18}
        fill={COLORE_ARCO}
        opacity={0.6}
      >
        {frecciaDir}
      </text>

      {/* QUOTE */}
      {/* Larghezza vano */}
      <Quota
        x1={vanoX}
        y1={vanoY - 20}
        x2={vanoX + W_vano}
        y2={vanoY - 20}
        label={mm(d.larghezzaVano)}
      />

      {/* Altezza vano */}
      <Quota
        x1={vanoX + W_vano + 20}
        y1={vanoY}
        x2={vanoX + W_vano + 20}
        y2={vanoY + H_vano}
        label={mm(d.altezzaVano)}
        vertical
      />

      {/* Larghezza anta */}
      <Quota
        x1={antaX}
        y1={vanoY + H_vano + 20}
        x2={antaX + W_anta}
        y2={vanoY + H_vano + 20}
        label={mm(d.larghezzaAnta)}
      />

      {/* Altezza anta */}
      <Quota
        x1={vanoX - 20}
        y1={luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0) + 1.5}
        x2={vanoX - 20}
        y2={luceY + (sopraluceH > 0 ? sopraluceH + 5 : 0) + 1.5 + H_anta}
        label={mm(d.altezzaAnta)}
        vertical
      />

      {/* Label apertura */}
      <text
        x={totalW / 2}
        y={totalH - 16}
        textAnchor="middle"
        fontSize={FONT_SIZE}
        fill={COLORE_QUOTA}
      >
        Apertura {d.apertura.toUpperCase()} • {d.versoApertura === "verso" ? "verso di me" : "lontano da me"} • Maniglia {d.posizioneManigliaPorta}
      </text>

      {/* Label tipologia */}
      <text
        x={totalW / 2}
        y={20}
        textAnchor="middle"
        fontSize={FONT_SIZE}
        fill={COLORE_TESTO}
        fontWeight="600"
      >
        SCHEMA PORTA — PRODUZIONE
      </text>
    </svg>
  );
}
