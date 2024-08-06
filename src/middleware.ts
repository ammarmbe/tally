import { auth } from "@/utils/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  console.log(req.auth, req.nextUrl.pathname);

  if (req.nextUrl.pathname === "/home" || req.nextUrl.pathname === "/privacy") {
    console.log("pathname is home or privacy");

    return NextResponse.next();
  }

  if (!req.auth && req.nextUrl.pathname !== "/login") {
    console.log("redirecting to login");

    const newUrl = new URL("/login", req.nextUrl.origin);

    return Response.redirect(newUrl);
  }

  if (req.auth && req.nextUrl.pathname === "/login") {
    console.log("redirecting to home");

    const newUrl = new URL("/", req.nextUrl.origin);

    return Response.redirect(newUrl);
  }

  console.log("next");

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.svg|images|manifest.webmanifest).*)"
  ]
};
