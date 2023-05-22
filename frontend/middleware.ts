import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export async function middleware(request: NextRequest) {
  interface TAppStatus {
   step1: boolean;
   step2: boolean;
  }

  // Allow /_next and assets to get through
  if (request.nextUrl.pathname.match(/(^\/_next)|(\.(png)|(ico)|(svg)|(json)|(jp(e)?g)$)/)) {
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/school/app_status/", { method: "GET"});
  const status: TAppStatus = await response.json();
  const step1Path = '/onboarding/step1';
  const step2Path = '/onboarding/step2';
  const loginPath = '/login';

  if (!status.step1 && !request.nextUrl.pathname.startsWith(step1Path)) {
    console.log('redirecting', { pathname: request.nextUrl.pathname, destination: step1Path });
    return NextResponse.redirect(new URL(step1Path, request.url));
  }
  
  if (status.step1 && !status.step2 && !request.nextUrl.pathname.startsWith(step2Path)) {
    console.log('redirecting', { pathname: request.nextUrl.pathname, destination:  step2Path });
    return NextResponse.redirect(new URL(step2Path, request.url));
  }

  if (
    status.step1 &&
    status.step2 &&
    (request.nextUrl.pathname.startsWith(step1Path) || request.nextUrl.pathname.startsWith(step2Path) )
  ) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }
}