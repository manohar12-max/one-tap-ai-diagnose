import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const role = request.cookies.get("role")?.value
  const { pathname } = request.nextUrl

  // Define public routes that don't need auth
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // Static files

  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("error", "unauthorized")
    return NextResponse.redirect(url)
  }

  if (token && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone()
    if (role === "DOCTOR" || role === "ADMIN") {
      url.pathname = "/staff/dashboard"
    } else {
      url.pathname = "/dashboard"
    }
    return NextResponse.redirect(url)
  }

  const patientOnlyRoutes = ["/dashboard", "/doctors", "/appointments", "/history", "/diagnose", "/profile-settings", "/onboarding"]
  const isPatientRoute = patientOnlyRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))
  
  if (token && isPatientRoute && (role === "DOCTOR" || role === "ADMIN")) {
    const url = request.nextUrl.clone()
    url.pathname = "/staff/dashboard"
    return NextResponse.redirect(url)
  }

  if (token && pathname.startsWith("/staff") && role !== "DOCTOR" && role !== "ADMIN") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
