import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "caloria_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "caloria-dev-secret-change-in-production"
);

const protectedPaths = ["/dashboard", "/history"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*"],
};
