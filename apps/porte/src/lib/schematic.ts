import type { CalculatedDoor } from "./types";
import { formatMmRaw, getHingeLabel } from "./door-engine";
import { SYSTEM_LABELS } from "./door-models";

const SVG_NS = "http://www.w3.org/2000/svg";

interface SchematicOptions {
  showDimensions?: boolean;
  scale?: number;
}

/**
 * Genera schema tecnico SVG della porta per produzione.
 * Vista frontale con quote, cerniere, maniglia, display e oblò.
 */
export function generateDoorSchematicSvg(
  door: CalculatedDoor,
  options: SchematicOptions = {},
): string {
  const { showDimensions = true, scale = 0.15 } = options;

  const pw = door.panelWidthMm;
  const ph = door.panelHeightMm;
  const fw = door.frameOuterWidthMm;
  const fh = door.frameOuterHeightMm;

  const margin = 120;
  const svgW = fw * scale + margin * 2;
  const svgH = fh * scale + margin * 2 + 80;

  const ox = margin;
  const oy = margin;

  const frameW = fw * scale;
  const frameH = fh * scale;
  const panelW = pw * scale;
  const panelH = ph * scale;
  const panelX = ox + (frameW - panelW) / 2;
  const panelY = oy + (frameH - panelH) / 2;

  const parts: string[] = [];

  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(
    `<svg xmlns="${SVG_NS}" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" style="font-family: system-ui, sans-serif;">`,
  );

  // Titolo
  parts.push(`<text x="${svgW / 2}" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1a1a2e">${escapeXml(door.model.name)}</text>`);
  parts.push(`<text x="${svgW / 2}" y="42" text-anchor="middle" font-size="10" fill="#555">${escapeXml(door.openingLabel)} — ${escapeXml(door.handleLabel)}</text>`);

  // Telaio esterno
  parts.push(`<rect x="${ox}" y="${oy}" width="${frameW}" height="${frameH}" fill="#e8e4dc" stroke="#333" stroke-width="2" rx="2"/>`);

  // Anta / pannello
  parts.push(`<rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" fill="#f5f0e8" stroke="#333" stroke-width="1.5"/>`);

  // Display (vetro rettangolare centrale)
  if (door.model.features.hasDisplay) {
    const dw = panelW * 0.45;
    const dh = panelH * 0.35;
    const dx = panelX + (panelW - dw) / 2;
    const dy = panelY + panelH * 0.25;
    parts.push(`<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" fill="#b8d4e8" stroke="#4a7a9b" stroke-width="1" opacity="0.8"/>`);
    parts.push(`<text x="${dx + dw / 2}" y="${dy + dh / 2 + 4}" text-anchor="middle" font-size="8" fill="#4a7a9b">DISPLAY</text>`);
  }

  // Oblò ovale
  if (door.model.features.hasOval) {
    const ow = panelW * 0.25;
    const oh = panelH * 0.12;
    const ocx = panelX + panelW / 2;
    const ocy = panelY + panelH * 0.12;
    parts.push(`<ellipse cx="${ocx}" cy="${ocy}" rx="${ow / 2}" ry="${oh / 2}" fill="#c8dce8" stroke="#4a7a9b" stroke-width="1" opacity="0.8"/>`);
    parts.push(`<text x="${ocx}" y="${ocy + 3}" text-anchor="middle" font-size="7" fill="#4a7a9b">OVALE</text>`);
  }

  // Anta fissa laterale (bussola)
  if (door.model.features.hasFixedPanel && door.model.system === "bussola") {
    const fixedW = panelW * 0.35;
    parts.push(`<rect x="${panelX}" y="${panelY}" width="${fixedW}" height="${panelH}" fill="#ddd8d0" stroke="#666" stroke-width="1" stroke-dasharray="4,2"/>`);
    parts.push(`<text x="${panelX + fixedW / 2}" y="${panelY + panelH / 2}" text-anchor="middle" font-size="7" fill="#666" transform="rotate(-90, ${panelX + fixedW / 2}, ${panelY + panelH / 2})">FISSA</text>`);
  }

  // Cerniere
  if (door.hingeSide) {
    const hingeX = door.hingeSide === "right" ? panelX + panelW - 4 : panelX;
    for (let i = 0; i < 3; i++) {
      const hy = panelY + panelH * (0.15 + i * 0.35);
      parts.push(`<rect x="${hingeX}" y="${hy - 6}" width="8" height="12" fill="#888" stroke="#333" stroke-width="0.5" rx="1"/>`);
    }
    parts.push(`<text x="${door.hingeSide === "right" ? panelX + panelW + 14 : panelX - 14}" y="${panelY + panelH / 2}" text-anchor="${door.hingeSide === "right" ? "start" : "end"}" font-size="8" fill="#c45c26" transform="rotate(-90, ${door.hingeSide === "right" ? panelX + panelW + 14 : panelX - 14}, ${panelY + panelH / 2})">${escapeXml(getHingeLabel(door.hingeSide))}</text>`);
  }

  // Maniglia
  if (door.handleSide) {
    const handleX = door.handleSide === "right" ? panelX + panelW - 20 : panelX + 20;
    const handleY = panelY + (door.model.handleHeightMm / ph) * panelH;
    parts.push(`<circle cx="${handleX}" cy="${handleY}" r="5" fill="none" stroke="#c45c26" stroke-width="2"/>`);
    parts.push(`<line x1="${handleX}" y1="${handleY - 8}" x2="${handleX}" y2="${handleY + 8}" stroke="#c45c26" stroke-width="2"/>`);
    parts.push(`<text x="${handleX}" y="${handleY + 20}" text-anchor="middle" font-size="8" fill="#c45c26">${escapeXml(door.handleLabel)}</text>`);
  }

  // Freccia apertura
  if (door.openingDirection) {
    const arcCx = door.hingeSide === "right" ? panelX + panelW : panelX;
    const arcCy = panelY + panelH * 0.7;
    const sweep = door.openingDirection.includes("tirare") ? 1 : 0;
    parts.push(`<path d="M ${arcCx} ${arcCy} A ${panelW * 0.6} ${panelW * 0.6} 0 0 ${sweep} ${arcCx + (door.hingeSide === "left" ? panelW * 0.5 : -panelW * 0.5)} ${arcCy - panelW * 0.3}" fill="none" stroke="#2d6a4f" stroke-width="1.5" stroke-dasharray="5,3"/>`);
  }

  // Quote dimensionali
  if (showDimensions) {
    const dimY = oy + frameH + 30;
    drawDimensionLine(parts, ox, dimY, ox + frameW, dimY, formatMmRaw(fw));
    drawDimensionLine(parts, panelX, dimY + 20, panelX + panelW, dimY + 20, formatMmRaw(pw));

    const dimX = ox + frameW + 20;
    drawVerticalDimension(parts, dimX, oy, oy + frameH, formatMmRaw(fh));
    drawVerticalDimension(parts, dimX + 30, panelY, panelY + panelH, formatMmRaw(ph));
  }

  // Riepilogo tecnico
  const infoY = svgH - 10;
  const info = [
    `Foro muro: ${formatMmRaw(door.wallOpening.widthMm)} × ${formatMmRaw(door.wallOpening.heightMm)}`,
    `Lavoro morto: -${door.deadWork.widthMm}/-${door.deadWork.heightMm} mm`,
    `Sistema: ${SYSTEM_LABELS[door.model.system] ?? door.model.system}`,
    `Spessore anta: ${door.model.panelThicknessMm} mm`,
  ].join("  |  ");
  parts.push(`<text x="${svgW / 2}" y="${infoY}" text-anchor="middle" font-size="8" fill="#666">${escapeXml(info)}</text>`);

  parts.push("</svg>");
  return parts.join("\n");
}

function drawDimensionLine(
  parts: string[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
): void {
  parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="0.8"/>`);
  parts.push(`<line x1="${x1}" y1="${y1 - 4}" x2="${x1}" y2="${y1 + 4}" stroke="#333" stroke-width="0.8"/>`);
  parts.push(`<line x1="${x2}" y1="${y2 - 4}" x2="${x2}" y2="${y2 + 4}" stroke="#333" stroke-width="0.8"/>`);
  parts.push(`<text x="${(x1 + x2) / 2}" y="${y1 + 12}" text-anchor="middle" font-size="9" fill="#333">${escapeXml(label)}</text>`);
}

function drawVerticalDimension(
  parts: string[],
  x: number,
  y1: number,
  y2: number,
  label: string,
): void {
  parts.push(`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#333" stroke-width="0.8"/>`);
  parts.push(`<line x1="${x - 4}" y1="${y1}" x2="${x + 4}" y2="${y1}" stroke="#333" stroke-width="0.8"/>`);
  parts.push(`<line x1="${x - 4}" y1="${y2}" x2="${x + 4}" y2="${y2}" stroke="#333" stroke-width="0.8"/>`);
  parts.push(`<text x="${x + 8}" y="${(y1 + y2) / 2}" text-anchor="start" font-size="9" fill="#333" transform="rotate(90, ${x + 8}, ${(y1 + y2) / 2})">${escapeXml(label)}</text>`);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Scarica lo schema come file SVG */
export function downloadSchematicSvg(door: CalculatedDoor, filename?: string): void {
  const svg = generateDoorSchematicSvg(door);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `porta-${door.panelWidthMm}x${door.panelHeightMm}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Esporta dati tecnici in JSON per produzione */
export function exportProductionJson(door: CalculatedDoor): string {
  return JSON.stringify(
    {
      exportDate: new Date().toISOString(),
      model: door.model.name,
      system: door.model.system,
      features: door.model.features,
      wallOpening: door.wallOpening,
      deadWork: door.deadWork,
      dimensions: {
        panelWidthMm: door.panelWidthMm,
        panelHeightMm: door.panelHeightMm,
        frameOuterWidthMm: door.frameOuterWidthMm,
        frameOuterHeightMm: door.frameOuterHeightMm,
        passageWidthMm: door.passageWidthMm,
        passageHeightMm: door.passageHeightMm,
        panelThicknessMm: door.model.panelThicknessMm,
        handleHeightMm: door.model.handleHeightMm,
      },
      hardware: {
        openingDirection: door.openingDirection,
        openingLabel: door.openingLabel,
        handleSide: door.handleSide,
        handleLabel: door.handleLabel,
        hingeSide: door.hingeSide,
      },
    },
    null,
    2,
  );
}

export function downloadProductionJson(door: CalculatedDoor): void {
  const json = exportProductionJson(door);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `porta-${door.panelWidthMm}x${door.panelHeightMm}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
