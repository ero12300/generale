"use client";

import { useMemo } from "react";
import type { CalculatedDoor } from "@/lib/types";
import { generateDoorSchematicSvg } from "@/lib/schematic";

interface DoorSchematicPreviewProps {
  door: CalculatedDoor;
  scale?: number;
}

export function DoorSchematicPreview({ door, scale = 0.12 }: DoorSchematicPreviewProps) {
  const dataUrl = useMemo(() => {
    const svg = generateDoorSchematicSvg(door, { scale });
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [door, scale]);

  return (
    <div className="overflow-x-auto rounded-xl bg-white p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`Schema porta ${door.panelWidthMm}x${door.panelHeightMm}`}
        className="mx-auto h-auto w-full max-w-full"
      />
    </div>
  );
}
