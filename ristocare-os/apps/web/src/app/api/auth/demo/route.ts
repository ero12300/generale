import { cookies } from "next/headers";
import { DEMO_ROLE_COOKIE_NAME, type DemoRole } from "@/lib/auth/session";
import { jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = (await request.json()) as { role: DemoRole };
  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE_NAME, body.role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return jsonOk({ role: body.role });
}
