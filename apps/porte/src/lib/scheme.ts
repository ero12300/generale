import type { Config, Risultato } from "./types";

/**
 * Genera lo schema tecnico della porta come stringa SVG (vista in prospetto).
 * Il disegno usa direttamente i millimetri come unita' del viewBox, con un
 * bordo per le linee di quota. Palette chiara "blueprint" per stampa/export.
 */

const PAD_L = 260;
const PAD_R = 90;
const PAD_TOP = 110;
const PAD_B = 230;

const COL_LINE = "#1e293b";
const COL_FORO = "#94a3b8";
const COL_ANTA = "#e7d3b3";
const COL_FISSA = "#d8c39c";
const COL_VETRO = "#cfe8f3";
const COL_QUOTA = "#b45309";
const COL_APERTURA = "#2563eb";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  stroke: string,
  sw: number,
  dash = "",
): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<rect x="${x}" y="${y}" width="${Math.max(0, w)}" height="${Math.max(
    0,
    h,
  )}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${d} />`;
}

function line(x1: number, y1: number, x2: number, y2: number, stroke: string, sw: number, dash = ""): string {
  const d = dash ? ` stroke-dasharray="${dash}"` : "";
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${d} />`;
}

function text(
  x: number,
  y: number,
  s: string,
  size: number,
  fill: string,
  anchor: "start" | "middle" | "end" = "middle",
  weight = "500",
): string {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-weight="${weight}">${esc(
    s,
  )}</text>`;
}

/** Linea di quota orizzontale con frecce e etichetta. */
function quotaH(x1: number, x2: number, y: number, label: string): string {
  const t = 26;
  return [
    line(x1, y, x2, y, COL_QUOTA, 3),
    line(x1, y - t, x1, y + t, COL_QUOTA, 3),
    line(x2, y - t, x2, y + t, COL_QUOTA, 3),
    text((x1 + x2) / 2, y - 14, label, 40, COL_QUOTA, "middle", "700"),
  ].join("");
}

/** Linea di quota verticale con frecce e etichetta ruotata. */
function quotaV(y1: number, y2: number, x: number, label: string): string {
  const t = 26;
  const my = (y1 + y2) / 2;
  return [
    line(x, y1, x, y2, COL_QUOTA, 3),
    line(x - t, y1, x + t, y1, COL_QUOTA, 3),
    line(x - t, y2, x + t, y2, COL_QUOTA, 3),
    `<text x="${x - 16}" y="${my}" font-size="40" fill="${COL_QUOTA}" text-anchor="middle" font-weight="700" font-family="Arial, sans-serif" transform="rotate(-90 ${
      x - 16
    } ${my})">${esc(label)}</text>`,
  ].join("");
}

export function generaSvg(risultato: Risultato, config: Config): string {
  const { foro, pannelli, latoCerniere, latoManiglia, altezzaManiglia } = risultato;
  const ox = PAD_L;
  const oy = PAD_TOP;
  const vbW = foro.larghezza + PAD_L + PAD_R;
  const vbH = foro.altezza + PAD_TOP + PAD_B;

  const parts: string[] = [];

  // Sfondo.
  parts.push(rect(0, 0, vbW, vbH, "#ffffff", "none", 0));

  // Foro muro (tratteggiato).
  parts.push(rect(ox, oy, foro.larghezza, foro.altezza, "#f8fafc", COL_FORO, 5, "22 16"));
  parts.push(
    text(ox + 6, oy - 30, "FORO MURO (al morto)", 34, COL_FORO, "start", "700"),
  );

  // Pannelli.
  const anta = pannelli.find((p) => p.tipo === "anta");
  for (const p of pannelli) {
    const px = ox + p.x;
    const py = oy + p.y;
    if (p.tipo === "sopraluce") {
      parts.push(rect(px, py, p.larghezza, p.altezza, COL_VETRO, COL_LINE, 4));
      parts.push(text(px + p.larghezza / 2, py + p.altezza / 2 + 12, "SOPRALUCE", 34, COL_LINE));
    } else if (p.tipo === "fianco") {
      parts.push(rect(px, py, p.larghezza, p.altezza, COL_VETRO, COL_LINE, 4));
      parts.push(
        `<text x="${px + p.larghezza / 2}" y="${py + p.altezza / 2}" font-size="30" fill="${COL_LINE}" text-anchor="middle" font-family="Arial, sans-serif" transform="rotate(-90 ${
          px + p.larghezza / 2
        } ${py + p.altezza / 2})">FIANCO FISSO</text>`,
      );
    } else if (p.tipo === "fissa") {
      parts.push(rect(px, py, p.larghezza, p.altezza, COL_FISSA, COL_LINE, 4));
      parts.push(text(px + p.larghezza / 2, py + p.altezza / 2 + 12, "ANTA FISSA", 32, COL_LINE));
    } else {
      parts.push(rect(px, py, p.larghezza, p.altezza, COL_ANTA, COL_LINE, 6));
    }
  }

  // Dettagli sull'anta mobile: cerniere, maniglia, oblo', simbolo apertura.
  if (anta && anta.larghezza > 0 && anta.altezza > 0) {
    const ax = ox + anta.x;
    const ay = oy + anta.y;
    const aw = anta.larghezza;
    const ah = anta.altezza;

    const hingeX = latoCerniere === "sinistra" ? ax : ax + aw;
    const handleX = latoManiglia === "sinistra" ? ax : ax + aw;

    // Cerniere (3 tacche sul lato cerniere).
    for (const f of [0.14, 0.5, 0.86]) {
      const hy = ay + ah * f;
      parts.push(rect(hingeX - 16, hy - 40, 32, 80, COL_LINE, COL_LINE, 2));
    }
    parts.push(
      `<text x="${hingeX + (latoCerniere === "sinistra" ? 26 : -26)}" y="${
        ay + ah * 0.5
      }" font-size="26" fill="${COL_LINE}" text-anchor="middle" font-family="Arial, sans-serif" transform="rotate(-90 ${
        hingeX + (latoCerniere === "sinistra" ? 26 : -26)
      } ${ay + ah * 0.5})">CERNIERE</text>`,
    );

    // Maniglia sul lato opposto, all'altezza consigliata da pavimento.
    const handleY = Math.min(ay + ah - 60, Math.max(ay + 60, oy + foro.altezza - altezzaManiglia));
    const handleInset = latoManiglia === "sinistra" ? handleX + 55 : handleX - 55;
    parts.push(`<circle cx="${handleInset}" cy="${handleY}" r="20" fill="${COL_LINE}" />`);
    parts.push(
      line(
        handleInset,
        handleY,
        latoManiglia === "sinistra" ? handleInset + 70 : handleInset - 70,
        handleY,
        COL_LINE,
        12,
      ),
    );

    // Simbolo verso di apertura: triangolo tratteggiato (apice sulle cerniere).
    const apexY = ay + ah / 2;
    parts.push(line(hingeX, apexY, handleX, ay, COL_APERTURA, 3, "18 12"));
    parts.push(line(hingeX, apexY, handleX, ay + ah, COL_APERTURA, 3, "18 12"));
    parts.push(
      text(
        ax + aw / 2,
        ay + ah * 0.5 + 10,
        risultato.sensoApertura.toUpperCase(),
        40,
        COL_APERTURA,
        "middle",
        "700",
      ),
    );
    parts.push(
      text(ax + aw / 2, ay + ah * 0.5 + 58, `ANTA ${risultato.anta.larghezza} x ${risultato.anta.altezza} mm`, 34, COL_LINE),
    );

    // Oblo'/vetro sull'anta.
    const cx = ax + aw / 2;
    const cy = ay + ah * 0.32;
    if (config.opzioni.oblo === "ovale") {
      parts.push(
        `<ellipse cx="${cx}" cy="${cy}" rx="${Math.min(aw * 0.22, 150)}" ry="${Math.min(
          ah * 0.12,
          230,
        )}" fill="${COL_VETRO}" stroke="${COL_LINE}" stroke-width="5" />`,
      );
    } else if (config.opzioni.oblo === "rotondo") {
      parts.push(
        `<circle cx="${cx}" cy="${cy}" r="${Math.min(aw * 0.22, 160)}" fill="${COL_VETRO}" stroke="${COL_LINE}" stroke-width="5" />`,
      );
    } else if (config.opzioni.oblo === "rettangolare") {
      const rw = aw * 0.55;
      const rh = ah * 0.3;
      parts.push(rect(cx - rw / 2, cy - rh / 2, rw, rh, COL_VETRO, COL_LINE, 5));
    }
  }

  // Quote.
  parts.push(quotaH(ox, ox + foro.larghezza, oy + foro.altezza + 90, `Foro L = ${foro.larghezza} mm`));
  parts.push(
    quotaH(
      ox,
      ox + foro.larghezza,
      oy + foro.altezza + 175,
      `Luce passaggio = ${risultato.lucePassaggio.larghezza} mm`,
    ),
  );
  parts.push(quotaV(oy, oy + foro.altezza, ox - 95, `Foro H = ${foro.altezza} mm`));
  parts.push(quotaV(oy, oy + foro.altezza, ox - 180, `Luce H = ${risultato.lucePassaggio.altezza} mm`));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Schema tecnico porta ${esc(
    risultato.modello.nome,
  )}">${parts.join("")}</svg>`;
  return svg;
}
