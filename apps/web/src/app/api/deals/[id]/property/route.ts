import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { validationError } from "@/lib/api-response";
import { parseBody, propertyUpdateSchema } from "@/lib/validations/api";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = parseBody(propertyUpdateSchema, body);
  if (!parsed.success) return validationError(parsed.error);

  const property = demoStore.upsertProperty(id, parsed.data);
  return NextResponse.json(property);
}
