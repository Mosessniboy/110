import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const { pathname } = req.nextUrl;

  // Halaman yang BOLEH tanpa login
  const publicPaths = [
    "/login",
    "/register",
  ];

  const isPublic =
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!sessionToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Jalankan middleware di SEMUA route
      kecuali file statis
    */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
