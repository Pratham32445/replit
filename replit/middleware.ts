import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function isAuthenticatedPath(path: string) {
  return path == "/register" || path == "/login" || path == "/api/auth/signin" ;
}

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    secret: process.env.NEXTAUTH_SECRET,
    req: request,
  });

  const req_url = request.nextUrl.pathname;

  if (!token) {

    if (isAuthenticatedPath(req_url)) return NextResponse.next();

    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  if (token.isVerified) {

    if (isAuthenticatedPath(req_url))
      return NextResponse.redirect(new URL("/repl/create",request.url));

    return NextResponse.next();
  }

  if (req_url == "/password") return NextResponse.next();

  return NextResponse.redirect(new URL("/password", request.url));
}

export const config = {
  matcher: [
    "/repl/:path*",
    "/register",
    "/login",
    "/api/auth/signin",
    "/password",
  ],
};
