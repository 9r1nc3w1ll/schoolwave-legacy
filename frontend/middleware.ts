import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  const status = {step1: false, step2: true}
  if (request.nextUrl.pathname.startsWith('/app') && !status.step1) {
    status.step1 = true


    

    return NextResponse.redirect(new URL('/onboarding/', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/app') && status.step1  && !status.step2) {
       

    return NextResponse.redirect(new URL('/onboarding/step2', request.url));
  }
 
 
}