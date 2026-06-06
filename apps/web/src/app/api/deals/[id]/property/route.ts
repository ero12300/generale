import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const property = demoStore.upsertProperty(id, body);
  return NextResponse.json(property);
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // POST /api/deals/:id/property = conferma immobile (status: draft → confirmed)
  const { id } = await params;
  const property = demoStore.confirmProperty(id);
  if (!property)
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 },
    );
  return NextResponse.json(property);
}
