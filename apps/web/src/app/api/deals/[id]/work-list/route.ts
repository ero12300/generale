import { NextResponse } from "next/server";
import { withRepository } from "@/lib/api-repository";
import { upstreamError, validationError } from "@/lib/api-response";
import { parseBody, workListSchema } from "@/lib/validations/api";
import { generateWorkList } from "@/lib/analytics-client";
import type { WorkItem } from "@deal-desk/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(workListSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  return withRepository(async (repo) => {
    const property = await repo.getProperty(id);

    try {
      const result = await generateWorkList({
        surface_sqm: parsed.data.surface_sqm ?? property?.surface_sqm ?? 70,
        rooms: parsed.data.rooms ?? property?.rooms ?? 3,
        condition: parsed.data.condition ?? property?.condition ?? "da_ristrutturare",
        include_kitchen: parsed.data.include_kitchen ?? true,
        include_bathrooms: parsed.data.include_bathrooms ?? 1,
      });

      const items: WorkItem[] = result.items.map(
        (item: Record<string, unknown>, idx: number) => ({
          id: `wi-${id}-${idx}`,
          deal_id: id,
          organization_id: repo.context.organizationId,
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
      await repo.setWorkItems(id, items);
      return NextResponse.json({ items, total_estimated: result.total_estimated, notes: result.notes });
    } catch (err) {
      return upstreamError(err instanceof Error ? err.message : "Generazione WBS non riuscita");
    }
  });
}
