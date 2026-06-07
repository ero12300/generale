import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "deal-desk-analytics",
    mode: "embedded",
  });
}
