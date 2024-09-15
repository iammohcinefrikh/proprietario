import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import verifySession from "./utils/verifySessionUtil";

const protectedRoutes = ["/landlord", "/tenant"];
const publicRoutes = ["/", "/login", "/register"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = cookies().get("access_token")?.value;

  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (accessToken) {
    const session = await verifySession(accessToken as string);

    if (!session || session?.error) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (isPublicRoute && session?.success) {
      if (session?.role === "landlord") {
        return NextResponse.redirect(new URL("/landlord", request.nextUrl));
      } 
      
      else if (session?.role === "tenant") {
        return NextResponse.redirect(new URL("/tenant", request.nextUrl));
      }
    }

    if (isProtectedRoute && session?.success) {
      if (session?.role === "landlord" && !request.nextUrl.pathname.startsWith("/landlord")) {
        return NextResponse.redirect(new URL("/landlord", request.nextUrl));
      } 
      
      else if (session?.role === "tenant" && !request.nextUrl.pathname.startsWith("/tenant")) {
        return NextResponse.redirect(new URL("/tenant", request.nextUrl));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};