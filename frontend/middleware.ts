import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware (request: NextRequest) {
  interface TAppStatus {
    step1: boolean;
    step2: boolean;
  }

  const initCheckUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"}/school/setup-status`;
  const step1Path = "/onboarding/step1";
  const step2Path = "/onboarding/step2";
  const loginPath = "/login";

  if (request.nextUrl.pathname.match(/(^(\/_next)|(\/locales)|(\/api))|(\.(png)|(ico)|(svg)|(json)|(jp(e)?g)$)|(^\/$)/)) {
    return;
  }

  const token = await getToken({ req: request, secret: "topsecret" });
  const response = await fetch(initCheckUrl, { method: "GET" });

  if (!response.ok) {
    console.error("app status check failed", { response });

    return;
  }

  const status = await response.json() as TAppStatus;

  if (!status.step1 && !request.nextUrl.pathname.startsWith(step1Path)) {
    return NextResponse.redirect(new URL(step1Path, request.url));
  }

  if (status.step1 && !status.step2) {
    if (!token && !request.nextUrl.pathname.startsWith(loginPath)) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    if (token && !request.nextUrl.pathname.startsWith(step2Path)) {
      return NextResponse.redirect(new URL(step2Path, request.url));
    }
  }

  if (status.step1 && status.step2) {
    if (!token && !request.nextUrl.pathname.startsWith(loginPath)) {
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    if (token && request.nextUrl.pathname.startsWith(loginPath)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
