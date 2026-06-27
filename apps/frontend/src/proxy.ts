import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES: readonly string[] = ["/signin", "/signup"] as const;

const PUBLIC_ROUTES: readonly string[] = [
  "/",
  "/signin",
  "/signup",
  "/menu",
] as const;

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token: string | undefined = request.cookies.get("access_token")?.value;

  const isPublicRoute: boolean = PUBLIC_ROUTES.some((r) =>
    pathname.startsWith(r)
  );

  const isAuthRoute: boolean = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if ((!token || isTokenExpired(token)) && !isPublicRoute)
    return NextResponse.redirect(new URL("/signin", request.url));

  if (token && !isTokenExpired(token) && isAuthRoute)
    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
