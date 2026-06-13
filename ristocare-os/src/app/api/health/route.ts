import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ristocare-os",
    mode: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "demo",
    time: new Date().toISOString(),
  });
}
