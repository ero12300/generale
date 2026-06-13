import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PATHS = ["/login", "/signup", "/auth"];
const PUBLIC_PATHS = [
  "/",
  "/come-funziona",
  "/prezzi",
  "/referral",
  "/demo",
  "/contatti",
];
const PUBLIC_API = ["/api/stripe/webhook", "/api/health"];

const PROTECTED_PREFIXES = ["/app", "/admin", "/sales", "/partner"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_API.some((p) => pathname.startsWith(p));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && pathname.startsWith("/api/") && !PUBLIC_API.some((p) => pathname.startsWith(p))) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const redirect = request.nextUrl.searchParams.get("redirect") ?? "/app/dashboard";
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!user && !isAuthPath && !isPublic && !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
