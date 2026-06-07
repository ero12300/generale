import { NextResponse } from "next/server";
import { withRepository } from "@/lib/api-repository";
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

  return withRepository(async (repo) => {
    const property = await repo.upsertProperty(id, parsed.data);
    return NextResponse.json(property);
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withRepository(async (repo) => {
    const property = await repo.confirmProperty(id);
    return NextResponse.json(property);
  });
}
