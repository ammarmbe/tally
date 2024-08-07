import auth from "@/utils/auth.config";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (req.nextUrl.pathname === "/home" || req.nextUrl.pathname === "/privacy") {
    return NextResponse.next();
  }

  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);

    return Response.redirect(newUrl);
  }

  if (req.auth && req.nextUrl.pathname === "/login") {
    const newUrl = new URL("/", req.nextUrl.origin);

    return Response.redirect(newUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|images|manifest.webmanifest).*)"
  ]
};
