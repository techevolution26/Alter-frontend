import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/prayers/new", "/testimonies/new", "/admin"];

export function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((prefix) => request.nextUrl.pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  const hasSession = request.cookies.has("alter_session");
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Cookie-presence check only — this is a fast-path redirect for the
  // logged-out case. The actual role check (moderator/admin/field_staff)
  // happens server-side in app/admin/layout.tsx and, authoritatively, on
  // the backend itself via `require_roles(...)` on every write.
  matcher: ["/prayers/new", "/testimonies/new", "/admin/:path*"],
};