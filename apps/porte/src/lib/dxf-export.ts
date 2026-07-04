import type { CalculatedDoor } from "./types";
import { formatMmRaw, getHingeLabel } from "./door-engine";
import { SYSTEM_LABELS } from "./door-models";

/** Layer CAD standard per produzione porte */
const LAYERS = {
  TELAIO: { name: "TELAIO", color: 7 },
  ANTA: { name: "ANTA", color: 7 },
  VETRO: { name: "VETRO", color: 4 },
  FISSA: { name: "FISSA", color: 8 },
  FERRAMENTA: { name: "FERRAMENTA", color: 1 },
  APERTURA: { name: "APERTURA", color: 3 },
  QUOTE: { name: "QUOTE", color: 2 },
  TESTO: { name: "TESTO", color: 7 },
} as const;

class DxfWriter {
  private readonly entities: string[] = [];
  private readonly layers = new Map<string, number>([["0", 7]]);

  registerLayer(name: string, color: number): void {
    this.layers.set(name, color);
  }

  private pair(code: number, value: string | number): void {
    this.entities.push(String(code), String(value));
  }

  line(x1: number, y1: number, x2: number, y2: number, layer: string): void {
    this.entities.push("0", "LINE");
    this.pair(8, layer);
    this.pair(10, fmt(x1));
    this.pair(20, fmt(y1));
    this.pair(30, "0");
    this.pair(11, fmt(x2));
    this.pair(21, fmt(y2));
    this.pair(31, "0");
  }

  rect(x: number, y: number, w: number, h: number, layer: string): void {
    this.line(x, y, x + w, y, layer);
    this.line(x + w, y, x + w, y + h, layer);
    this.line(x + w, y + h, x, y + h, layer);
    this.line(x, y + h, x, y, layer);
  }

  /** Rettangolo tratteggiato (segmenti) */
  rectDashed(x: number, y: number, w: number, h: number, layer: string): void {
    const dash = 40;
    const edges: [number, number, number, number][] = [
      [x, y, x + w, y],
      [x + w, y, x + w, y + h],
      [x + w, y + h, x, y + h],
      [x, y + h, x, y],
    ];
    for (const [x1, y1, x2, y2] of edges) {
      this.dashedLine(x1, y1, x2, y2, layer, dash);
    }
  }

  private dashedLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    layer: string,
    dashLen: number,
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) return;
    const ux = dx / len;
    const uy = dy / len;
    let pos = 0;
    let draw = true;
    while (pos < len) {
      const seg = Math.min(dashLen, len - pos);
      const sx = x1 + ux * pos;
      const sy = y1 + uy * pos;
      const ex = x1 + ux * (pos + seg);
      const ey = y1 + uy * (pos + seg);
      if (draw) this.line(sx, sy, ex, ey, layer);
      pos += seg;
      draw = !draw;
    }
  }

  circle(cx: number, cy: number, r: number, layer: string): void {
    this.entities.push("0", "CIRCLE");
    this.pair(8, layer);
    this.pair(10, fmt(cx));
    this.pair(20, fmt(cy));
    this.pair(30, "0");
    this.pair(40, fmt(r));
  }

  arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number, layer: string): void {
    this.entities.push("0", "ARC");
    this.pair(8, layer);
    this.pair(10, fmt(cx));
    this.pair(20, fmt(cy));
    this.pair(30, "0");
    this.pair(40, fmt(r));
    this.pair(50, fmt(startDeg));
    this.pair(51, fmt(endDeg));
  }

  /** Ellisse approssimata con polyline (DXF R12 compatibile) */
  ellipse(cx: number, cy: number, rx: number, ry: number, layer: string, segments = 36): void {
    const points: [number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      points.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
    }
    this.polyline(points, layer, true);
  }

  polyline(points: [number, number][], layer: string, closed = false): void {
    this.entities.push("0", "LWPOLYLINE");
    this.pair(8, layer);
    this.pair(90, points.length);
    this.pair(70, closed ? 1 : 0);
    for (const [x, y] of points) {
      this.pair(10, fmt(x));
      this.pair(20, fmt(y));
    }
  }

  text(x: number, y: number, height: number, value: string, layer: string): void {
    this.entities.push("0", "TEXT");
    this.pair(8, layer);
    this.pair(10, fmt(x));
    this.pair(20, fmt(y));
    this.pair(30, "0");
    this.pair(40, fmt(height));
    this.pair(1, value);
  }

  mtext(x: number, y: number, height: number, value: string, layer: string, width = 0): void {
    this.entities.push("0", "MTEXT");
    this.pair(8, layer);
    this.pair(10, fmt(x));
    this.pair(20, fmt(y));
    this.pair(30, "0");
    this.pair(40, fmt(height));
    if (width > 0) this.pair(41, fmt(width));
    this.pair(71, "1");
    this.pair(72, "1");
    this.pair(1, value);
  }

  dimensionH(x1: number, x2: number, y: number, offset: number, label: string): void {
    const dimY = y - offset;
    this.line(x1, y, x1, dimY - 15, LAYERS.QUOTE.name);
    this.line(x2, y, x2, dimY - 15, LAYERS.QUOTE.name);
    this.line(x1, dimY, x2, dimY, LAYERS.QUOTE.name);
    this.line(x1, dimY - 8, x1, dimY + 8, LAYERS.QUOTE.name);
    this.line(x2, dimY - 8, x2, dimY + 8, LAYERS.QUOTE.name);
    this.text((x1 + x2) / 2, dimY - 25, 35, label, LAYERS.QUOTE.name);
  }

  dimensionV(x: number, y1: number, y2: number, offset: number, label: string): void {
    const dimX = x + offset;
    this.line(x, y1, dimX + 15, y1, LAYERS.QUOTE.name);
    this.line(x, y2, dimX + 15, y2, LAYERS.QUOTE.name);
    this.line(dimX, y1, dimX, y2, LAYERS.QUOTE.name);
    this.line(dimX - 8, y1, dimX + 8, y1, LAYERS.QUOTE.name);
    this.line(dimX - 8, y2, dimX + 8, y2, LAYERS.QUOTE.name);
    this.text(dimX + 20, (y1 + y2) / 2, 35, label, LAYERS.QUOTE.name);
  }

  toDxfString(): string {
    const sections: string[] = [];

    sections.push("0", "SECTION", "2", "HEADER");
    sections.push("9", "$ACADVER", "1", "AC1015");
    sections.push("9", "$INSUNITS", "70", "4");
    sections.push("0", "ENDSEC");

    sections.push("0", "SECTION", "2", "TABLES");
    sections.push("0", "TABLE", "2", "LAYER", "70", String(this.layers.size));
    for (const [name, color] of this.layers) {
      sections.push("0", "LAYER");
      sections.push("2", name);
      sections.push("70", "0");
      sections.push("62", String(color));
      sections.push("6", "CONTINUOUS");
    }
    sections.push("0", "ENDTAB", "0", "ENDSEC");

    sections.push("0", "SECTION", "2", "ENTITIES");
    sections.push(...this.entities);
    sections.push("0", "ENDSEC");

    sections.push("0", "EOF");
    return sections.join("\n");
  }
}

function fmt(n: number): string {
  return Number(n.toFixed(3)).toString();
}

/**
 * Genera file DXF (formato AutoCAD) con coordinate reali in mm.
 * Vista frontale: origine in basso a sinistra del telaio.
 */
export function generateDoorDxf(door: CalculatedDoor): string {
  const dxf = new DxfWriter();
  for (const layer of Object.values(LAYERS)) {
    dxf.registerLayer(layer.name, layer.color);
  }

  const fw = door.frameOuterWidthMm;
  const fh = door.frameOuterHeightMm;
  const pw = door.panelWidthMm;
  const ph = door.panelHeightMm;

  const frameX = 0;
  const frameY = 0;
  const panelX = frameX + (fw - pw) / 2;
  const panelY = frameY + (fh - ph) / 2;

  const titleY = fh + 120;
  dxf.mtext(
    fw / 2,
    titleY,
    50,
    `${door.model.name}\\P${door.openingLabel} — ${door.handleLabel}`,
    LAYERS.TESTO.name,
    fw,
  );

  dxf.rect(frameX, frameY, fw, fh, LAYERS.TELAIO.name);
  dxf.rect(panelX, panelY, pw, ph, LAYERS.ANTA.name);

  if (door.model.features.hasDisplay) {
    const dw = pw * 0.45;
    const dh = ph * 0.35;
    const dx = panelX + (pw - dw) / 2;
    const dy = panelY + ph * 0.25;
    dxf.rect(dx, dy, dw, dh, LAYERS.VETRO.name);
    dxf.text(dx + dw / 2 - 80, dy + dh / 2, 30, "DISPLAY", LAYERS.TESTO.name);
  }

  if (door.model.features.hasOval) {
    const rx = pw * 0.125;
    const ry = ph * 0.06;
    const ocx = panelX + pw / 2;
    const ocy = panelY + ph * 0.88;
    dxf.ellipse(ocx, ocy, rx, ry, LAYERS.VETRO.name);
    dxf.text(ocx - 50, ocy - 10, 25, "OVALE", LAYERS.TESTO.name);
  }

  if (door.model.features.hasFixedPanel && door.model.system === "bussola") {
    const fixedW = pw * 0.35;
    dxf.rectDashed(panelX, panelY, fixedW, ph, LAYERS.FISSA.name);
    dxf.text(panelX + fixedW / 2 - 30, panelY + ph / 2, 25, "FISSA", LAYERS.TESTO.name);
  }

  if (door.hingeSide) {
    const hingeX = door.hingeSide === "right" ? panelX + pw : panelX;
  const hingeW = 12;
    for (let i = 0; i < 3; i++) {
      const hy = panelY + ph * (0.15 + i * 0.35);
      const hx = door.hingeSide === "right" ? hingeX - hingeW : hingeX;
      dxf.rect(hx, hy - 30, hingeW, 60, LAYERS.FERRAMENTA.name);
    }
    const labelX = door.hingeSide === "right" ? panelX + pw + 30 : panelX - 200;
    dxf.text(labelX, panelY + ph / 2, 30, getHingeLabel(door.hingeSide), LAYERS.FERRAMENTA.name);
  }

  if (door.handleSide) {
    const handleX = door.handleSide === "right" ? panelX + pw - 80 : panelX + 80;
    const handleY = panelY + door.model.handleHeightMm;
    dxf.circle(handleX, handleY, 25, LAYERS.FERRAMENTA.name);
    dxf.line(handleX, handleY - 40, handleX, handleY + 40, LAYERS.FERRAMENTA.name);
    dxf.text(handleX - 80, handleY - 60, 30, door.handleLabel, LAYERS.FERRAMENTA.name);
  }

  if (door.openingDirection && door.hingeSide) {
    const arcCx = door.hingeSide === "right" ? panelX + pw : panelX;
    const arcCy = panelY + ph * 0.3;
    const arcR = pw * 0.6;
    if (door.hingeSide === "left") {
      const start = door.openingDirection.includes("tirare") ? 0 : 90;
      const end = door.openingDirection.includes("tirare") ? 90 : 0;
      dxf.arc(arcCx, arcCy, arcR, start, end, LAYERS.APERTURA.name);
    } else {
      const start = door.openingDirection.includes("tirare") ? 90 : 180;
      const end = door.openingDirection.includes("tirare") ? 180 : 90;
      dxf.arc(arcCx, arcCy, arcR, start, end, LAYERS.APERTURA.name);
    }
  }

  dxf.dimensionH(frameX, frameX + fw, frameY, 80, `Telaio ${formatMmRaw(fw)}`);
  dxf.dimensionH(panelX, panelX + pw, panelY, 160, `Anta ${formatMmRaw(pw)}`);
  dxf.dimensionV(frameX + fw, frameY, frameY + fh, 80, `Telaio ${formatMmRaw(fh)}`);
  dxf.dimensionV(frameX + fw, panelY, panelY + ph, 160, `Anta ${formatMmRaw(ph)}`);

  const infoY = frameY - 200;
  const info = [
    `Foro muro: ${formatMmRaw(door.wallOpening.widthMm)} x ${formatMmRaw(door.wallOpening.heightMm)}`,
    `Lavoro morto: -${door.deadWork.widthMm}/-${door.deadWork.heightMm} mm`,
    `Sistema: ${SYSTEM_LABELS[door.model.system] ?? door.model.system}`,
    `Spessore anta: ${door.model.panelThicknessMm} mm`,
    `Luce passaggio: ${formatMmRaw(door.passageWidthMm)} x ${formatMmRaw(door.passageHeightMm)}`,
  ].join("\\P");

  dxf.mtext(frameX, infoY, 30, info, LAYERS.TESTO.name, fw);

  return dxf.toDxfString();
}

export function downloadDoorDxf(door: CalculatedDoor, filename?: string): void {
  const dxf = generateDoorDxf(door);
  const blob = new Blob([dxf], { type: "application/dxf;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `porta-${door.panelWidthMm}x${door.panelHeightMm}.dxf`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Scarica SVG + DXF + JSON in sequenza */
export function downloadAllFormats(
  door: CalculatedDoor,
  handlers: {
    svg: () => void;
    json: () => void;
  },
): void {
  handlers.svg();
  setTimeout(() => downloadDoorDxf(door), 300);
  setTimeout(() => handlers.json(), 600);
}
