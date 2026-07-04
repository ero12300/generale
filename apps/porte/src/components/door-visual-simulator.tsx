"use client";

import { useId, useMemo, useState } from "react";
import type { DoorConfigurationResult } from "@deal-desk/types";
import { buildDoorVisualLayout, type VisualSegmentKind } from "@/lib/doors/visual-layout";
import { cn } from "@/lib/utils";

const SEGMENT_STYLES: Record<
  VisualSegmentKind,
  { fill: string; stroke: string; pattern?: string }
> = {
  fixed: { fill: "#52525b", stroke: "#a1a1aa" },
  gap: { fill: "#18181b", stroke: "#71717a", pattern: "gap" },
  leaf: { fill: "#b45309", stroke: "#fbbf24" },
  leaf_secondary: { fill: "#92400e", stroke: "#fbbf24" },
};

type DoorVisualSimulatorProps = {
  result: DoorConfigurationResult;
};

export function DoorVisualSimulator({ result }: DoorVisualSimulatorProps) {
  const layout = useMemo(() => buildDoorVisualLayout(result), [result]);
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const canAnimate =
    result.input.model === "hinged_single" || result.input.model === "hinged_with_fixed_panel";

  const totalSegmentWidth = layout.segments.reduce((sum, segment) => sum + segment.widthMm, 0);
  const viewW = 360;
  const viewH = 300;
  const frameX = 24;
  const frameY = 52;
  const frameW = viewW - 48;
  const frameH = 180;
  const scale = frameW / Math.max(layout.passageWidthMm, 1);

  let cursorX = frameX;
  const blocks = layout.segments.map((segment, index) => {
    const width = Math.max(segment.widthMm * scale, segment.kind === "gap" ? 6 : 12);
    const block = {
      ...segment,
      x: cursorX,
      width,
      index,
    };
    cursorX += width;
    return block;
  });

  const leafBlock = blocks.find((block) => block.kind === "leaf");
  const hingeX =
    layout.openingDirection === "right"
      ? (leafBlock?.x ?? frameX) + (leafBlock?.width ?? 0)
      : (leafBlock?.x ?? frameX);
  const hingeY = frameY + frameH;
  const openAngle = layout.openingDirection === "right" ? -78 : 78;
  const handleX =
    layout.handleSide === "right"
      ? (leafBlock?.x ?? 0) + (leafBlock?.width ?? 0) - 14
      : (leafBlock?.x ?? 0) + 14;
  const handleY = frameY + frameH * 0.55;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Vista frontale: vedi subito come si dividono anta, aria e opera morta.
        </p>
        {canAnimate && (
          <div
            role="group"
            aria-label="Stato apertura anta"
            className="inline-flex rounded-xl border border-zinc-700 bg-zinc-950 p-1"
          >
            <ToggleChip active={!isOpen} onClick={() => setIsOpen(false)} label="Chiusa" />
            <ToggleChip active={isOpen} onClick={() => setIsOpen(true)} label="Aperta" />
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="mx-auto w-full max-w-[420px]"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>
            Simulatore {layout.roomName}: {layout.modelLabel}
          </title>

          <text
            x={viewW / 2}
            y={22}
            fill="#fafafa"
            fontSize={13}
            fontWeight={600}
            textAnchor="middle"
          >
            {layout.roomName}
          </text>
          <text x={viewW / 2} y={38} fill="#a1a1aa" fontSize={10} textAnchor="middle">
            Luce passaggio {layout.passageWidthMm} × {layout.passageHeightMm} mm
          </text>

          <rect
            x={frameX - 6}
            y={frameY - 6}
            width={frameW + 12}
            height={frameH + 12}
            fill="none"
            stroke="#3f3f46"
            strokeWidth={2}
            strokeDasharray="7 4"
            rx={4}
          />
          <text x={frameX} y={frameY - 10} fill="#71717a" fontSize={9}>
            Foro muro
          </text>

          <rect
            x={frameX}
            y={frameY}
            width={frameW}
            height={frameH}
            fill="#09090b"
            stroke="#71717a"
            strokeWidth={1.5}
            rx={2}
          />

          {blocks.map((block) => {
            const isLeaf = block.kind === "leaf" || block.kind === "leaf_secondary";
            const style = SEGMENT_STYLES[block.kind];
            const blockHeight = frameH - 8;
            const blockY = frameY + 4;
            const transform =
              isOpen && isLeaf && block.kind === "leaf"
                ? `rotate(${openAngle} ${hingeX} ${hingeY})`
                : undefined;

            return (
              <g key={`${block.kind}-${block.index}`} transform={transform}>
                <rect
                  x={block.x}
                  y={blockY}
                  width={block.width}
                  height={blockHeight}
                  fill={style.fill}
                  fillOpacity={isLeaf ? 0.85 : 1}
                  stroke={style.stroke}
                  strokeWidth={1.5}
                  rx={block.kind === "gap" ? 0 : 3}
                />
                {block.kind === "gap" && (
                  <>
                    {Array.from({ length: Math.ceil(block.width / 5) }).map((_, stripe) => (
                      <line
                        key={stripe}
                        x1={block.x + stripe * 5}
                        y1={blockY}
                        x2={block.x + stripe * 5 + 3}
                        y2={blockY + blockHeight}
                        stroke="#52525b"
                        strokeWidth={1}
                      />
                    ))}
                  </>
                )}
                {block.width >= 28 && (
                  <text
                    x={block.x + block.width / 2}
                    y={blockY + blockHeight / 2 - 6}
                    fill="#fafafa"
                    fontSize={10}
                    fontWeight={600}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {block.label}
                  </text>
                )}
                {block.width >= 22 && (
                  <text
                    x={block.x + block.width / 2}
                    y={blockY + blockHeight / 2 + 10}
                    fill="#fde68a"
                    fontSize={9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {block.caption}
                  </text>
                )}
              </g>
            );
          })}

          {leafBlock && (
            <>
              <circle cx={handleX} cy={handleY} r={5} fill="#fafafa" stroke="#fbbf24" strokeWidth={1.5} />
              {isOpen && canAnimate && (
                <path
                  d={buildSwingArc(hingeX, hingeY, leafBlock.width, layout.openingDirection)}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  opacity={0.8}
                />
              )}
            </>
          )}

          <text x={frameX} y={frameY + frameH + 18} fill="#fbbf24" fontSize={10}>
            ← Larghezza totale luce: {layout.passageWidthMm} mm
          </text>
          {layout.hasFixedPanel && totalSegmentWidth > 0 && (
            <text x={frameX} y={frameY + frameH + 32} fill="#a1a1aa" fontSize={9}>
              Anta + aria + opera morta = {totalSegmentWidth} mm
            </text>
          )}
        </svg>
      </div>

      <Legend segments={layout.segments} />
      <p className="text-xs leading-5 text-zinc-500">
        Maniglia lato {translateSide(layout.handleSide)} · Apertura verso{" "}
        {translateSide(layout.openingDirection)}
        {layout.hasFixedPanel ? " · L’opera morta resta fissa, si muove solo l’anta." : ""}
      </p>
    </div>
  );
}

function Legend({ segments }: { segments: ReturnType<typeof buildDoorVisualLayout>["segments"] }) {
  const items = [
    { kind: "fixed" as const, label: "Opera morta (fisso)" },
    { kind: "gap" as const, label: "Aria / gioco" },
    { kind: "leaf" as const, label: "Anta battente" },
    { kind: "leaf_secondary" as const, label: "Seconda anta" },
  ].filter((item) => segments.some((segment) => segment.kind === item.kind));

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const style = SEGMENT_STYLES[item.kind];
        return (
          <div
            key={item.kind}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300"
          >
            <span
              className="h-3 w-3 rounded-sm border"
              style={{ backgroundColor: style.fill, borderColor: style.stroke }}
            />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50",
        active ? "bg-amber-600 text-white" : "text-zinc-400 hover:text-zinc-100"
      )}
    >
      {label}
    </button>
  );
}

function buildSwingArc(hingeX: number, hingeY: number, leafWidth: number, direction: "left" | "right") {
  const radius = leafWidth * 0.92;
  const endX = direction === "right" ? hingeX - radius : hingeX + radius;
  const sweep = direction === "right" ? 1 : 0;
  return `M ${hingeX} ${hingeY} A ${radius} ${radius} 0 0 ${sweep} ${endX} ${hingeY}`;
}

function translateSide(side: "left" | "right" | "center") {
  if (side === "left") return "sinistra";
  if (side === "right") return "destra";
  return "centro";
}
