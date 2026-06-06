import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deal = demoStore.getDeal(id);
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const property = demoStore.getProperty(id);
  const analysis = demoStore.getAnalysis(id);
  const workItems = demoStore.listWorkItems(id);
  return NextResponse.json({ deal, property, analysis, workItems });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const deal = demoStore.updateDeal(id, body);
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(deal);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = demoStore.deleteDeal(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
