import type { DoorConfigurationResult } from "@deal-desk/types";

const COLORS = {
  wall: "#3f3f46",
  frame: "#71717a",
  leaf: "#d97706",
  fixed: "#52525b",
  gap: "#27272a",
  dim: "#fbbf24",
  text: "#fafafa",
  muted: "#a1a1aa",
};

export function buildDoorSchemaSvg(result: DoorConfigurationResult): string {
  const pad = 80;
  const gapLabelH = result.fixedPanel ? 36 : 0;
  const totalW = result.clearOpening.widthMm;
  const totalH = result.clearOpening.heightMm;
  const scale = Math.min(520 / totalW, 360 / totalH, 0.55);
  const drawW = totalW * scale;
  const drawH = totalH * scale;
  const svgW = drawW + pad * 2;
  const svgH = drawH + pad * 2 + gapLabelH + 48;
  const ox = pad;
  const oy = pad;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">`,
    `<rect width="100%" height="100%" fill="#09090b"/>`,
    `<text x="${svgW / 2}" y="28" fill="${COLORS.text}" font-family="system-ui,sans-serif" font-size="14" font-weight="600" text-anchor="middle">${escapeXml(result.input.roomName)} — ${escapeXml(result.modelLabel)}</text>`,
    `<text x="${svgW / 2}" y="46" fill="${COLORS.muted}" font-family="system-ui,sans-serif" font-size="11" text-anchor="middle">Vista frontale con quote produzione (mm)</text>`
  );

  // Foro muro
  parts.push(
    `<rect x="${ox}" y="${oy}" width="${drawW}" height="${drawH}" fill="none" stroke="${COLORS.wall}" stroke-width="2" stroke-dasharray="8 4"/>`,
    dimH(ox - 28, oy, drawW, totalW, "foro"),
    dimV(ox + drawW + 18, oy, drawH, totalH, "foro")
  );

  // Luce passaggio (inset frame allowance visually ~4%)
  const frameInsetX = ((totalW - result.frame.passageWidthMm) / totalW) * drawW * 0.5;
  const frameInsetY = ((totalH - result.frame.passageHeightMm) / totalH) * drawH * 0.5;
  const px = ox + frameInsetX;
  const py = oy + frameInsetY;
  const pw = drawW - frameInsetX * 2;
  const ph = drawH - frameInsetY * 2;

  parts.push(
    `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="none" stroke="${COLORS.frame}" stroke-width="1.5"/>`,
    dimH(px, py + ph + 14, pw, result.frame.passageWidthMm, "luce")
  );

  const leafDrawW = (result.leaf.widthMm / result.frame.passageWidthMm) * pw;
  const leafDrawH = (result.leaf.heightMm / result.frame.passageHeightMm) * ph;
  const leafY = py + ph - leafDrawH;

  if (result.fixedPanel) {
    const fixedDrawW = (result.fixedPanel.widthMm / result.frame.passageWidthMm) * pw;
    const gapDrawW = (result.fixedPanel.leafGapMm / result.frame.passageWidthMm) * pw;
    const fixedOnLeft = result.fixedPanel.side === "left";

    const fixedX = fixedOnLeft ? px : px + pw - fixedDrawW;
    const gapX = fixedOnLeft ? px + fixedDrawW : px + pw - fixedDrawW - gapDrawW;
    const leafX = fixedOnLeft ? px + fixedDrawW + gapDrawW : px;

    parts.push(
      `<rect x="${fixedX}" y="${leafY}" width="${fixedDrawW}" height="${leafDrawH}" fill="${COLORS.fixed}" stroke="#a1a1aa" stroke-width="1"/>`,
      `<text x="${fixedX + fixedDrawW / 2}" y="${leafY + leafDrawH / 2}" fill="${COLORS.text}" font-size="10" text-anchor="middle" dominant-baseline="middle">Fisso</text>`,
      dimH(fixedX, leafY - 12, fixedDrawW, result.fixedPanel.widthMm, "fisso")
    );

    if (gapDrawW > 0.5 || result.fixedPanel.leafGapMm > 0) {
      parts.push(
        `<rect x="${gapX}" y="${leafY}" width="${Math.max(gapDrawW, 2)}" height="${leafDrawH}" fill="${COLORS.gap}" stroke="#52525b" stroke-width="0.5" stroke-dasharray="3 2"/>`,
        `<text x="${gapX + Math.max(gapDrawW, 2) / 2}" y="${leafY + leafDrawH + 22}" fill="${COLORS.muted}" font-size="9" text-anchor="middle">aria ${result.fixedPanel.leafGapMm}</text>`,
        dimH(gapX, leafY + leafDrawH + 8, Math.max(gapDrawW, 2), result.fixedPanel.leafGapMm, "aria")
      );
    }

    parts.push(
      `<rect x="${leafX}" y="${leafY}" width="${leafDrawW}" height="${leafDrawH}" fill="${COLORS.leaf}" fill-opacity="0.35" stroke="${COLORS.leaf}" stroke-width="1.5"/>`,
      `<text x="${leafX + leafDrawW / 2}" y="${leafY + leafDrawH / 2}" fill="${COLORS.text}" font-size="10" text-anchor="middle" dominant-baseline="middle">Anta</text>`,
      dimH(leafX, py - 12, leafDrawW, result.leaf.widthMm, "anta")
    );

    drawOpeningArc(parts, leafX, leafY, leafDrawW, leafDrawH, result.openingDirection);
  } else {
    const leafX = result.openingDirection === "right" ? px + pw - leafDrawW : px;
    parts.push(
      `<rect x="${leafX}" y="${leafY}" width="${leafDrawW}" height="${leafDrawH}" fill="${COLORS.leaf}" fill-opacity="0.35" stroke="${COLORS.leaf}" stroke-width="1.5"/>`,
      `<text x="${leafX + leafDrawW / 2}" y="${leafY + leafDrawH / 2}" fill="${COLORS.text}" font-size="10" text-anchor="middle" dominant-baseline="middle">Anta</text>`,
      dimH(leafX, py - 12, leafDrawW, result.leaf.widthMm, "anta")
    );
    drawOpeningArc(parts, leafX, leafY, leafDrawW, leafDrawH, result.openingDirection);
  }

  dimV(px - 14, leafY, leafDrawH, result.leaf.heightMm, "anta H");

  parts.push(
    `<text x="${ox}" y="${svgH - 12}" fill="${COLORS.muted}" font-family="system-ui,sans-serif" font-size="10">Apertura: ${result.openingDirection === "right" ? "destra" : "sinistra"} · Maniglia: ${sideLabel(result.handleSide)}</text>`,
    `</svg>`
  );

  return parts.join("\n");
}

export function buildBatchSchemaSvg(
  projectName: string,
  doors: DoorConfigurationResult[]
): string {
  const blocks = doors.map(
    (door, index) =>
      `<!-- Porta ${index + 1}: ${door.input.roomName} -->\n${buildDoorSchemaSvg(door)}`
  );
  return blocks.join("\n\n");
}

function drawOpeningArc(
  parts: string[],
  x: number,
  y: number,
  w: number,
  h: number,
  direction: "left" | "right"
) {
  const hingeX = direction === "right" ? x + w : x;
  const hingeY = y;
  const r = Math.min(w, h) * 0.85;
  const sweep = direction === "right" ? 1 : 0;
  parts.push(
    `<path d="M ${hingeX} ${hingeY} A ${r} ${r} 0 0 ${sweep} ${hingeX + (direction === "right" ? -r : r)} ${hingeY + r}" fill="none" stroke="${COLORS.dim}" stroke-width="1" stroke-dasharray="4 3"/>`
  );
}

function dimH(x: number, y: number, length: number, valueMm: number, _label: string) {
  const y2 = y + 6;
  return [
    `<line x1="${x}" y1="${y}" x2="${x + length}" y2="${y}" stroke="${COLORS.dim}" stroke-width="1"/>`,
    `<line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y2}" stroke="${COLORS.dim}" stroke-width="1"/>`,
    `<line x1="${x + length}" y1="${y - 4}" x2="${x + length}" y2="${y2}" stroke="${COLORS.dim}" stroke-width="1"/>`,
    `<text x="${x + length / 2}" y="${y - 6}" fill="${COLORS.dim}" font-size="10" text-anchor="middle">${valueMm}</text>`,
  ].join("\n");
}

function dimV(x: number, y: number, length: number, valueMm: number, _label: string) {
  return [
    `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + length}" stroke="${COLORS.dim}" stroke-width="1"/>`,
    `<line x1="${x - 4}" y1="${y}" x2="${x + 4}" y2="${y}" stroke="${COLORS.dim}" stroke-width="1"/>`,
    `<line x1="${x - 4}" y1="${y + length}" x2="${x + 4}" y2="${y + length}" stroke="${COLORS.dim}" stroke-width="1"/>`,
    `<text x="${x - 8}" y="${y + length / 2}" fill="${COLORS.dim}" font-size="10" text-anchor="end" dominant-baseline="middle">${valueMm}</text>`,
  ].join("\n");
}

function sideLabel(side: "left" | "right" | "center") {
  if (side === "left") return "sinistra";
  if (side === "right") return "destra";
  return "centro";
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
