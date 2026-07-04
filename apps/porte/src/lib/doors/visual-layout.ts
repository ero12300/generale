import type { DoorConfigurationResult } from "@deal-desk/types";

export type VisualSegmentKind = "fixed" | "gap" | "leaf" | "leaf_secondary";

export interface VisualSegment {
  kind: VisualSegmentKind;
  label: string;
  widthMm: number;
  heightMm: number;
  /** Quota mostrata sotto il blocco */
  caption: string;
}

export interface DoorVisualLayout {
  roomName: string;
  modelLabel: string;
  passageWidthMm: number;
  passageHeightMm: number;
  openingDirection: "left" | "right";
  handleSide: "left" | "right" | "center";
  segments: VisualSegment[];
  hasFixedPanel: boolean;
  isFolding: boolean;
}

export function buildDoorVisualLayout(result: DoorConfigurationResult): DoorVisualLayout {
  const segments: VisualSegment[] = [];

  if (result.fixedPanel) {
    const fixedFirst = result.fixedPanel.side === "left";
    const fixed: VisualSegment = {
      kind: "fixed",
      label: "Opera morta",
      widthMm: result.fixedPanel.widthMm,
      heightMm: result.fixedPanel.heightMm,
      caption: `${result.fixedPanel.widthMm} mm`,
    };
    const gap: VisualSegment = {
      kind: "gap",
      label: "Aria",
      widthMm: result.fixedPanel.leafGapMm,
      heightMm: result.fixedPanel.heightMm,
      caption: result.fixedPanel.leafGapMm > 0 ? `${result.fixedPanel.leafGapMm} mm` : "—",
    };
    const leaf: VisualSegment = {
      kind: "leaf",
      label: "Anta battente",
      widthMm: result.leaf.widthMm,
      heightMm: result.leaf.heightMm,
      caption: `${result.leaf.widthMm} mm`,
    };

    if (fixedFirst) {
      segments.push(fixed, gap, leaf);
    } else {
      segments.push(leaf, gap, fixed);
    }
  } else if (result.leaf.quantity > 1) {
    const half = Math.floor(result.leaf.widthMm);
    segments.push(
      {
        kind: "leaf",
        label: "Anta 1",
        widthMm: half,
        heightMm: result.leaf.heightMm,
        caption: `${half} mm`,
      },
      {
        kind: "leaf_secondary",
        label: "Anta 2",
        widthMm: half,
        heightMm: result.leaf.heightMm,
        caption: `${half} mm`,
      }
    );
  } else {
    segments.push({
      kind: "leaf",
      label: result.input.model.startsWith("sliding") ? "Anta scorrevole" : "Anta",
      widthMm: result.leaf.widthMm,
      heightMm: result.leaf.heightMm,
      caption: `${result.leaf.widthMm} mm`,
    });
  }

  return {
    roomName: result.input.roomName,
    modelLabel: result.modelLabel,
    passageWidthMm: result.frame.passageWidthMm,
    passageHeightMm: result.frame.passageHeightMm,
    openingDirection: result.openingDirection,
    handleSide: result.handleSide,
    segments,
    hasFixedPanel: Boolean(result.fixedPanel),
    isFolding: result.input.model === "folding_compass",
  };
}
