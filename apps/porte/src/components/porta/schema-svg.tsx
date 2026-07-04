import * as React from "react";
import type { DimensioniInput, OpzioniPorta, RisultatoCalcolo } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  dimensioni: DimensioniInput;
  opzioni: OpzioniPorta;
  calcolo: RisultatoCalcolo;
  className?: string;
  scala?: "compatta" | "estesa";
  colore?: "chiaro" | "scuro";
}

/**
 * Genera lo schema tecnico bidimensionale della porta.
 *
 * Convenzioni:
 * - Vista frontale dall'esterno della stanza (verso apertura riferito al lato osservatore).
 * - Le cerniere sono sul lato opposto della maniglia.
 * - L'arco tratteggiato indica il senso di apertura (spinta o tira) e il lato.
 * - Il pannello fisso, quando presente, è a destra o sinistra a seconda del lato maniglia
 *   (per convenzione: il fisso sta sul lato opposto della maniglia, così la maniglia resta
 *   accessibile su porta principale). Il numero e la posizione sono comunque riportati in scheda.
 */
export function SchemaPorta({
  dimensioni,
  opzioni,
  calcolo,
  className,
  scala = "estesa",
  colore = "scuro",
}: Props) {
  const isChiaro = colore === "chiaro";
  const stroke = isChiaro ? "#0f172a" : "#e2e8f0";
  const strokeMuted = isChiaro ? "#475569" : "#94a3b8";
  const bg = isChiaro ? "#ffffff" : "#0b1220";
  const antaFill = isChiaro ? "#f1f5f9" : "#1e293b";
  const antaStroke = isChiaro ? "#334155" : "#cbd5e1";
  const telaioFill = isChiaro ? "#e2e8f0" : "#0f172a";
  const vetroFill = isChiaro ? "#bfdbfe" : "#1e3a8a";
  const vetroStroke = isChiaro ? "#2563eb" : "#60a5fa";
  const fissoFill = isChiaro ? "#f5f3ff" : "#312e81";
  const fissoStroke = isChiaro ? "#7c3aed" : "#a5b4fc";
  const testoQuota = isChiaro ? "#0f172a" : "#e2e8f0";
  const testoLabel = isChiaro ? "#334155" : "#cbd5e1";

  const larghezzaFisso = calcolo.fisso?.larghezzaCm ?? 0;
  const altezzaSopraluce = calcolo.sopraluce?.altezzaCm ?? 0;

  // Convertiamo cm in pixel virtuali per la viewBox (1 cm = 4 unità).
  const S = 4;
  const paddingSopra = 40;
  const paddingLati = 60;
  const paddingSotto = 90;

  const larghezzaTotale = calcolo.telaio.larghezzaCm + larghezzaFisso;
  const altezzaTotale = calcolo.telaio.altezzaCm + altezzaSopraluce;

  const w = larghezzaTotale * S + paddingLati * 2;
  const h = altezzaTotale * S + paddingSopra + paddingSotto;

  // Il fisso è posizionato sul lato opposto alla maniglia per non ostruirla.
  const fissoASinistra = opzioni.maniglia === "destra";

  const offsetPorta = fissoASinistra ? paddingLati + larghezzaFisso * S : paddingLati;
  const offsetFisso = fissoASinistra ? paddingLati : paddingLati + calcolo.telaio.larghezzaCm * S;

  const portaW = calcolo.telaio.larghezzaCm * S;
  const portaH = calcolo.telaio.altezzaCm * S;
  const antaMargin = ((calcolo.telaio.larghezzaCm - calcolo.anta.larghezzaCm) / 2) * S;
  const antaW = calcolo.anta.larghezzaCm * S;
  const antaH = calcolo.anta.altezzaCm * S;
  const antaX = offsetPorta + antaMargin;
  const antaY = paddingSopra + altezzaSopraluce * S + (portaH - antaH);

  // Cerniere sul lato opposto della maniglia.
  const cernieraASinistra = opzioni.maniglia === "destra";
  const cernieraX = cernieraASinistra ? antaX : antaX + antaW;
  const maniglaX = cernieraASinistra ? antaX + antaW - 12 : antaX + 12;
  const maniglaY = antaY + antaH / 2;

  // Arco di apertura
  const arcRadius = antaW;
  const arcCenterX = cernieraX;
  const arcCenterY = antaY + antaH;
  // Verso: spinta -> arco verso l'osservatore (linea intera); tira -> tratteggiato
  const isTira = opzioni.versoApertura === "tira";
  const arcSweep = cernieraASinistra ? 1 : 0;
  const arcEndX = cernieraASinistra ? arcCenterX + arcRadius : arcCenterX - arcRadius;
  const arcEndY = arcCenterY;
  const arcStartX = arcCenterX;
  const arcStartY = arcCenterY - arcRadius;
  const arcPath = `M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 0 ${arcSweep} ${arcEndX} ${arcEndY}`;

  return (
    <svg
      className={cn("w-full h-auto", className)}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Schema porta ${dimensioni.foroLarghezzaCm}×${dimensioni.foroAltezzaCm} cm, maniglia ${opzioni.maniglia}, apertura a ${opzioni.versoApertura}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: bg }}
    >
      <defs>
        <pattern id="mattoni" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill={isChiaro ? "#f8fafc" : "#0b1220"} />
          <path
            d="M0 0h24M0 6h24M0 12h24M0 0v12M12 0v6M6 6v6M18 6v6"
            stroke={strokeMuted}
            strokeWidth={0.5}
            opacity={0.4}
          />
        </pattern>
      </defs>

      {/* Muro esterno con pattern mattoni */}
      <rect x={0} y={0} width={w} height={h} fill="url(#mattoni)" opacity={0.35} />

      {/* Foro muro (sfondo bianco/scuro) */}
      <rect
        x={paddingLati - 8}
        y={paddingSopra - 8}
        width={larghezzaTotale * S + 16}
        height={altezzaTotale * S + 16}
        fill={bg}
        stroke={strokeMuted}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        rx={2}
      />

      {/* Sopraluce (se presente) */}
      {calcolo.sopraluce && (
        <g>
          <rect
            x={paddingLati}
            y={paddingSopra}
            width={larghezzaTotale * S}
            height={altezzaSopraluce * S}
            fill={vetroFill}
            fillOpacity={0.5}
            stroke={vetroStroke}
            strokeWidth={1.5}
          />
          <text
            x={paddingLati + (larghezzaTotale * S) / 2}
            y={paddingSopra + (altezzaSopraluce * S) / 2 + 4}
            fontSize="10"
            textAnchor="middle"
            fill={testoLabel}
          >
            Sopraluce {calcolo.sopraluce.altezzaCm} cm
          </text>
        </g>
      )}

      {/* Pannello fisso */}
      {calcolo.fisso && (
        <g>
          <rect
            x={offsetFisso}
            y={paddingSopra + altezzaSopraluce * S}
            width={larghezzaFisso * S}
            height={portaH}
            fill={fissoFill}
            stroke={fissoStroke}
            strokeWidth={1.5}
          />
          {/* Trama diagonale per distinguerlo visivamente da un vetro */}
          <line
            x1={offsetFisso}
            y1={paddingSopra + altezzaSopraluce * S}
            x2={offsetFisso + larghezzaFisso * S}
            y2={paddingSopra + altezzaSopraluce * S + portaH}
            stroke={fissoStroke}
            strokeWidth={1}
            opacity={0.5}
          />
          <line
            x1={offsetFisso + larghezzaFisso * S}
            y1={paddingSopra + altezzaSopraluce * S}
            x2={offsetFisso}
            y2={paddingSopra + altezzaSopraluce * S + portaH}
            stroke={fissoStroke}
            strokeWidth={1}
            opacity={0.5}
          />
          <text
            x={offsetFisso + (larghezzaFisso * S) / 2}
            y={paddingSopra + altezzaSopraluce * S + portaH / 2}
            fontSize="11"
            textAnchor="middle"
            fill={testoLabel}
            fontWeight="600"
          >
            FISSO
          </text>
          <text
            x={offsetFisso + (larghezzaFisso * S) / 2}
            y={paddingSopra + altezzaSopraluce * S + portaH / 2 + 16}
            fontSize="9"
            textAnchor="middle"
            fill={testoLabel}
          >
            {larghezzaFisso} cm
          </text>
        </g>
      )}

      {/* Telaio della porta */}
      <rect
        x={offsetPorta}
        y={paddingSopra + altezzaSopraluce * S}
        width={portaW}
        height={portaH}
        fill={telaioFill}
        stroke={antaStroke}
        strokeWidth={2}
      />

      {/* Anta */}
      <rect
        x={antaX}
        y={antaY}
        width={antaW}
        height={antaH}
        fill={antaFill}
        stroke={antaStroke}
        strokeWidth={1.5}
      />

      {/* Vetro nell'anta */}
      {opzioni.vetro === "rettangolare" && (
        <rect
          x={antaX + antaW * 0.25}
          y={antaY + antaH * 0.15}
          width={antaW * 0.5}
          height={antaH * 0.5}
          fill={vetroFill}
          fillOpacity={0.55}
          stroke={vetroStroke}
          strokeWidth={1.5}
        />
      )}
      {opzioni.vetro === "ovale" && (
        <ellipse
          cx={antaX + antaW / 2}
          cy={antaY + antaH * 0.35}
          rx={antaW * 0.22}
          ry={antaH * 0.15}
          fill={vetroFill}
          fillOpacity={0.55}
          stroke={vetroStroke}
          strokeWidth={1.5}
        />
      )}
      {opzioni.vetro === "tondo" && (
        <circle
          cx={antaX + antaW / 2}
          cy={antaY + antaH * 0.35}
          r={Math.min(antaW * 0.4, antaH * 0.15)}
          fill={vetroFill}
          fillOpacity={0.55}
          stroke={vetroStroke}
          strokeWidth={1.5}
        />
      )}

      {/* Cerniere */}
      {[0.15, 0.5, 0.85].map((frac, i) => (
        <circle
          key={i}
          cx={cernieraX}
          cy={antaY + antaH * frac}
          r={3}
          fill={vetroStroke}
          stroke={stroke}
          strokeWidth={1}
        />
      ))}

      {/* Maniglia */}
      <g>
        <rect
          x={maniglaX - 4}
          y={maniglaY - 1.5}
          width={8}
          height={3}
          fill={vetroStroke}
          rx={1}
        />
        <circle cx={maniglaX} cy={maniglaY} r={2} fill={vetroStroke} />
      </g>

      {/* Arco apertura */}
      <path
        d={arcPath}
        fill="none"
        stroke={vetroStroke}
        strokeWidth={1.5}
        strokeDasharray={isTira ? "5 4" : "0"}
        opacity={0.8}
      />
      <text
        x={cernieraASinistra ? cernieraX + arcRadius * 0.35 : cernieraX - arcRadius * 0.35}
        y={arcCenterY - arcRadius * 0.55}
        fontSize="10"
        fill={testoLabel}
        textAnchor="middle"
      >
        {opzioni.versoApertura === "spinta" ? "SPINGE" : "TIRA"}
      </text>

      {/* Quotatura larghezza foro muro */}
      {scala === "estesa" && (
        <g>
          <line
            x1={paddingLati}
            y1={h - 40}
            x2={paddingLati + larghezzaTotale * S}
            y2={h - 40}
            stroke={testoQuota}
            strokeWidth={1}
          />
          <line
            x1={paddingLati}
            y1={h - 45}
            x2={paddingLati}
            y2={h - 35}
            stroke={testoQuota}
            strokeWidth={1}
          />
          <line
            x1={paddingLati + larghezzaTotale * S}
            y1={h - 45}
            x2={paddingLati + larghezzaTotale * S}
            y2={h - 35}
            stroke={testoQuota}
            strokeWidth={1}
          />
          <text
            x={paddingLati + (larghezzaTotale * S) / 2}
            y={h - 20}
            fontSize="12"
            fill={testoQuota}
            textAnchor="middle"
            fontWeight="600"
          >
            Foro muro {larghezzaTotale} cm
          </text>

          {/* Quotatura altezza foro muro */}
          <line
            x1={20}
            y1={paddingSopra}
            x2={20}
            y2={paddingSopra + altezzaTotale * S}
            stroke={testoQuota}
            strokeWidth={1}
          />
          <line
            x1={15}
            y1={paddingSopra}
            x2={25}
            y2={paddingSopra}
            stroke={testoQuota}
            strokeWidth={1}
          />
          <line
            x1={15}
            y1={paddingSopra + altezzaTotale * S}
            x2={25}
            y2={paddingSopra + altezzaTotale * S}
            stroke={testoQuota}
            strokeWidth={1}
          />
          <text
            x={-((paddingSopra + altezzaTotale * S) / 2)}
            y={12}
            transform="rotate(-90)"
            fontSize="12"
            fill={testoQuota}
            textAnchor="middle"
            fontWeight="600"
          >
            H {altezzaTotale} cm
          </text>

          {/* Indicatori Sinistra / Destra */}
          <text
            x={paddingLati + 8}
            y={paddingSopra - 12}
            fontSize="11"
            fill={testoLabel}
            fontWeight="600"
          >
            SX
          </text>
          <text
            x={paddingLati + larghezzaTotale * S - 8}
            y={paddingSopra - 12}
            fontSize="11"
            fill={testoLabel}
            textAnchor="end"
            fontWeight="600"
          >
            DX
          </text>

          {/* Quotatura anta */}
          <text
            x={antaX + antaW / 2}
            y={antaY - 8}
            fontSize="10"
            fill={testoLabel}
            textAnchor="middle"
          >
            Anta {calcolo.anta.larghezzaCm} × {calcolo.anta.altezzaCm} cm
          </text>
        </g>
      )}

      {/* Legenda maniglia/cerniere in basso */}
      <g transform={`translate(${paddingLati}, ${h - 70})`}>
        <text fontSize="10" fill={testoLabel}>
          <tspan x={0} dy={0}>
            Cerniere: {opzioni.maniglia === "destra" ? "SX" : "DX"} • Maniglia:{" "}
            {opzioni.maniglia === "destra" ? "DX" : "SX"} • Apertura: {opzioni.versoApertura}
          </tspan>
        </text>
      </g>
    </svg>
  );
}
