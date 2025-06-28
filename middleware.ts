import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin-portal")) {
    const adminToken = request.cookies.get("admin-access-token");

    if (!adminToken && request.nextUrl.pathname !== "/admin-portal") {
      return NextResponse.redirect(new URL("/admin-portal", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin-portal/:path*"],
};
