"use client";

import * as React from "react";
import { Download, FileText, Image as ImageIcon, Copy, Check } from "lucide-react";
import type { CalcoloPorta, ConfigurazionePorta } from "@/lib/door-engine";
import { distintaProduzione } from "@/lib/door-engine";
import { Button } from "@/components/ui/button";

interface Props {
  config: ConfigurazionePorta;
  calcolo: CalcoloPorta;
  svgRef: React.RefObject<SVGSVGElement | null>;
  nomeFile: string;
}

function svgToString(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function svgToPngBlob(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  const raw = svgToString(svg);
  const viewBox = svg.viewBox.baseVal;
  const w = viewBox.width * scale;
  const h = viewBox.height * scale;

  const svgBlob = new Blob([raw], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Impossibile caricare SVG"));
    image.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D non disponibile");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(url);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG blob nullo"))), "image/png");
  });
}

export function ExportPanel({ config, calcolo, svgRef, nomeFile }: Props) {
  const [copiato, setCopiato] = React.useState(false);
  const [pending, setPending] = React.useState<"svg" | "png" | "pdf" | null>(null);
  const nomeBase = nomeFile.replace(/[^\w\-]+/g, "_") || "porta";

  async function esportaSVG() {
    if (!svgRef.current) return;
    setPending("svg");
    try {
      const raw = svgToString(svgRef.current);
      download(new Blob([raw], { type: "image/svg+xml;charset=utf-8" }), `${nomeBase}.svg`);
    } finally {
      setPending(null);
    }
  }

  async function esportaPNG() {
    if (!svgRef.current) return;
    setPending("png");
    try {
      const blob = await svgToPngBlob(svgRef.current, 2);
      download(blob, `${nomeBase}.png`);
    } finally {
      setPending(null);
    }
  }

  async function esportaPDF() {
    if (!svgRef.current) return;
    setPending("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      const margine = 12;
      let cursorY = margine;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Scheda tecnica — ${config.modello}`, margine, cursorY);
      cursorY += 6;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120);
      doc.text(
        `Generato con PorteForge · ${new Date().toLocaleString("it-IT")}`,
        margine,
        cursorY
      );
      cursorY += 6;
      doc.setTextColor(20);

      const pngBlob = await svgToPngBlob(svgRef.current, 2);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read err"));
        reader.readAsDataURL(pngBlob);
      });
      const imgW = pageW - margine * 2;
      const imgH = imgW * 1.15;
      doc.addImage(dataUrl, "PNG", margine, cursorY, imgW, imgH);
      cursorY += imgH + 6;

      doc.setFontSize(10);
      doc.setFont("courier", "normal");
      const distinta = distintaProduzione(config, calcolo);
      for (const line of distinta) {
        if (cursorY > pageH - margine) {
          doc.addPage();
          cursorY = margine;
        }
        doc.text(line, margine, cursorY);
        cursorY += 4.2;
      }

      doc.save(`${nomeBase}.pdf`);
    } finally {
      setPending(null);
    }
  }

  async function copiaDistinta() {
    const testo = distintaProduzione(config, calcolo).join("\n");
    try {
      await navigator.clipboard.writeText(testo);
      setCopiato(true);
      setTimeout(() => setCopiato(false), 1500);
    } catch {
      // Fallback: apri in nuova finestra
      const w = window.open("", "_blank");
      if (w) {
        w.document.write("<pre>" + testo + "</pre>");
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" onClick={esportaSVG} disabled={pending !== null} size="lg">
          <Download className="h-4 w-4" />
          <span className="text-xs">{pending === "svg" ? "..." : "SVG"}</span>
        </Button>
        <Button variant="outline" onClick={esportaPNG} disabled={pending !== null} size="lg">
          <ImageIcon className="h-4 w-4" />
          <span className="text-xs">{pending === "png" ? "..." : "PNG"}</span>
        </Button>
        <Button variant="wood" onClick={esportaPDF} disabled={pending !== null} size="lg">
          <FileText className="h-4 w-4" />
          <span className="text-xs">{pending === "pdf" ? "..." : "PDF"}</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        onClick={copiaDistinta}
        size="default"
        className="w-full justify-center"
      >
        {copiato ? (
          <>
            <Check className="h-4 w-4 text-ok" /> Copiato
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copia distinta come testo
          </>
        )}
      </Button>
    </div>
  );
}
