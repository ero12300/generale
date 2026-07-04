/** Utility di esportazione lato client (download SVG/PNG/JSON, stampa PDF). */

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "porta"
  );
}

export function downloadSvg(svg: string, name: string): void {
  triggerDownload(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${name}.svg`);
}

export function downloadJson(data: unknown, name: string): void {
  triggerDownload(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    `${name}.json`,
  );
}

/** Converte l'SVG in PNG ad alta risoluzione tramite canvas. */
export async function downloadPng(svg: string, name: string, scale = 2): Promise<void> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Impossibile caricare lo schema per l'export PNG"));
      img.src = url;
    });
    const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);
    const w = vb ? parseFloat(vb[1]) : img.width || 1000;
    const h = vb ? parseFloat(vb[2]) : img.height || 1000;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas non disponibile");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Export PNG fallito"));
        triggerDownload(blob, `${name}.png`);
        resolve();
      }, "image/png");
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
