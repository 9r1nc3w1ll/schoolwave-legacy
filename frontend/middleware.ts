import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export async function middleware(request: NextRequest) {
  // const status = {step1: false, step2: true}
 
  const response = await fetch("http://127.0.0.1:8000/api/auth/app_status/", { method: "POST"});
  const status = await response.json();
  // console.log(jsonData);

  if (request.nextUrl.pathname.startsWith('/app') && !status.step1) {
    status.step1 = true


    

    return NextResponse.redirect(new URL('/onboarding/', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/app') && status.step1  && !status.step2) {
       

    return NextResponse.redirect(new URL('/onboarding/step2', request.url));
  }
 
 
}