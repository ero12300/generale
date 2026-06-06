import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { parseBody, propertySchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await parseBody(request, propertySchema);
  if (error) return error;
  const property = demoStore.upsertProperty(id, data);
  return NextResponse.json(property);
}
