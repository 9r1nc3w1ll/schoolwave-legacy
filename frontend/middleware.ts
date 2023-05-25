import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  interface TAppStatus {
    step1: boolean;
    step2: boolean;
  }

  const initCheckUrl = `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/school/setup-status`
  const step1Path = '/onboarding/step1';
  const step2Path = '/onboarding/step2';
  const loginPath = '/login';

  // Allow step1, /api, /_next and assets to get through
  if (request.nextUrl.pathname.startsWith(step1Path) || request.nextUrl.pathname.match(/(^(\/_next)|(\/api))|(\.(png)|(ico)|(svg)|(json)|(jp(e)?g)$)/)) {
    return;
  }

  const response = await fetch(initCheckUrl, { method: "GET" });
  if (response.statusText.toLocaleLowerCase() !== 'ok') {
    // TODO: We should redirect to technical setup page or 500
    console.warn('backend api failed', { response });
    console.log('redirecting', { pathname: request.nextUrl.pathname, destination: step1Path });
    return NextResponse.redirect(new URL(step1Path, request.url));
  }

  const status: TAppStatus = await response.json();

  if (!status.step1 && !request.nextUrl.pathname.startsWith(step1Path)) {
    console.log('redirecting', { pathname: request.nextUrl.pathname, destination: step1Path });
    return NextResponse.redirect(new URL(step1Path, request.url));
  }

  if (status.step1 && !status.step2 && !request.nextUrl.pathname.startsWith(step2Path)) {
    console.log('redirecting', { pathname: request.nextUrl.pathname, destination: step2Path });
    return NextResponse.redirect(new URL(step2Path, request.url));
  }

  if (
    status.step1 &&
    status.step2 &&
    (request.nextUrl.pathname.startsWith(step1Path) || request.nextUrl.pathname.startsWith(step2Path))
  ) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }
}