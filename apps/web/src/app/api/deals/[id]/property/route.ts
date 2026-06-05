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
