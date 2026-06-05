import { NextResponse } from "next/server";
import { generateWorkList } from "@/lib/analytics-client";
import { demoStore } from "@/lib/demo-store";
import type { WorkItem } from "@deal-desk/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const property = demoStore.getProperty(id);

  try {
    const result = await generateWorkList({
      surface_sqm: body.surface_sqm ?? property?.surface_sqm ?? 70,
      rooms: body.rooms ?? property?.rooms ?? 3,
      condition: body.condition ?? property?.condition ?? "da_ristrutturare",
      include_kitchen: body.include_kitchen ?? true,
      include_bathrooms: body.include_bathrooms ?? 1,
    });

    const items: WorkItem[] = result.items.map(
      (item: Record<string, unknown>, idx: number) => ({
        id: `wi-${id}-${idx}`,
        deal_id: id,
        organization_id: demoStore.orgId,
        room: String(item.room ?? ""),
        category: item.category as WorkItem["category"],
        description: String(item.description ?? ""),
        unit: String(item.unit ?? "cad"),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        supplier: null,
        priority: 3,
        status: "planned",
        requires_permit: Boolean(item.requires_permit),
      })
    );
    demoStore.setWorkItems(id, items);
    return NextResponse.json({ items, total_estimated: result.total_estimated, notes: result.notes });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Work list generation failed" },
      { status: 502 }
    );
  }
}
