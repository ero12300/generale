import type { DoorPlan } from "./types";

export function createDoorExport(plan: DoorPlan) {
  const openingSlug = plan.handing.openingLabel.replaceAll(" ", "-");
  const fileName = `porta-${modelSlug(plan.model)}-${openingSlug}-${plan.frame.outerWidthMm}x${plan.frame.outerHeightMm}.json`;
  const json = {
    generatedAt: "static-preview",
    model: plan.model,
    modelLabel: plan.modelLabel,
    frame: {
      outerWidthMm: plan.frame.outerWidthMm,
      outerHeightMm: plan.frame.outerHeightMm,
      depthMm: plan.frame.depthMm,
    },
    activeLeaf: plan.activeLeaf,
    deadWork: plan.deadWork,
    handing: plan.handing,
    accessories: plan.accessories,
    hardware: plan.hardware,
    productionNotes: plan.productionNotes,
  };

  return {
    fileName,
    json,
    svg: createDoorSvg(plan),
  };
}

function modelSlug(model: DoorPlan["model"]): string {
  switch (model) {
    case "hinged":
      return "battente";
    case "compass":
      return "compasso";
    case "fixed":
      return "fissa";
    default: {
      const exhaustive: never = model;
      return exhaustive;
    }
  }
}

function sideLabel(side: DoorPlan["handing"]["handleSide"]): string {
  switch (side) {
    case "left":
      return "sinistra";
    case "right":
      return "destra";
    case "none":
      return "non prevista";
    default: {
      const exhaustive: never = side;
      return exhaustive;
    }
  }
}

export function createDoorSvg(plan: DoorPlan): string {
  const width = 420;
  const height = 560;
  const frameX = 55;
  const frameY = 70;
  const frameW = 310;
  const frameH = 380;
  const deadWorkW =
    plan.deadWork.widthMm > 0
      ? Math.max(42, Math.round((plan.deadWork.widthMm / plan.frame.outerWidthMm) * frameW))
      : 0;
  const deadWorkX =
    plan.deadWork.side === "left" ? frameX : frameX + frameW - deadWorkW;
  const leafX = plan.deadWork.side === "left" ? frameX + deadWorkW : frameX;
  const leafW = frameW - deadWorkW;
  const oval = plan.accessories.hasOvalWindow
    ? '<ellipse cx="210" cy="235" rx="36" ry="58" fill="none" stroke="#f59e0b" stroke-width="4"/><text x="210" y="310" text-anchor="middle" font-size="14" fill="#f8fafc">Oblo ovale</text>'
    : "";
  const display = plan.accessories.hasDisplay
    ? '<rect x="176" y="130" width="68" height="42" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/><text x="210" y="156" text-anchor="middle" font-size="14" fill="#e0f2fe">Display</text>'
    : "";
  const handleX = plan.handing.handleSide === "left" ? leafX + 22 : leafX + leafW - 22;
  const handle =
    plan.handing.handleSide === "none"
      ? ""
      : `<circle cx="${handleX}" cy="270" r="8" fill="#f59e0b"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
<title>Schema ${plan.modelLabel} ${plan.frame.outerWidthMm}x${plan.frame.outerHeightMm}</title>
<rect width="420" height="560" fill="#09090b"/>
<text x="210" y="36" text-anchor="middle" font-size="22" fill="#f8fafc" font-family="Arial">${plan.modelLabel}</text>
<rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" fill="#18181b" stroke="#f59e0b" stroke-width="5"/>
<rect x="${leafX}" y="${frameY + 18}" width="${leafW}" height="${frameH - 36}" fill="#27272a" stroke="#f8fafc" stroke-width="2"/>
${deadWorkW > 0 ? `<rect x="${deadWorkX}" y="${frameY + 18}" width="${deadWorkW}" height="${frameH - 36}" fill="#3f3f46" stroke="#a1a1aa" stroke-width="2"/><text x="${deadWorkX + deadWorkW / 2}" y="468" text-anchor="middle" font-size="13" fill="#f8fafc">Lavoro morto ${plan.deadWork.widthMm} mm</text>` : ""}
${display}
${oval}
${handle}
<text x="210" y="500" text-anchor="middle" font-size="15" fill="#f8fafc">Maniglia: ${sideLabel(plan.handing.handleSide)}</text>
<text x="210" y="524" text-anchor="middle" font-size="15" fill="#f8fafc">Apertura: ${plan.handing.openingLabel}</text>
</svg>`;
}
