import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/session";
import { isDemoMode } from "@/lib/data";
import { demoStore } from "@/lib/demo-store";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({
      mode: "demo",
      email: null,
      organizationName: demoStore.orgName,
    });
  }

  const context = await getAuthContext();
  if (!context) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  return NextResponse.json({
    mode: context.mode,
    email: context.email,
    organizationName: context.organizationName,
  });
}
