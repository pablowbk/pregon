import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "pregon_auth";
const AUTH_COOKIE_VALUE = "authenticated";

// Rutas públicas que no requieren autenticación
const publicRoutes = [
  "/login",
  "/api/auth",
  "/api/whatsapp/webhook",
  "/suscribirse",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    console.log("permitiendo ruta pública", pathname);
    return NextResponse.next();
  }

  // Permitir archivos estáticos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    console.log("permitiendo archivo estático", pathname);
    return NextResponse.next();
  }
  console.log("verificando autenticación", pathname);

  // Verificar autenticación
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const isAuthenticated = authCookie?.value === AUTH_COOKIE_VALUE;

  if (!isAuthenticated) {
    console.log("no está autenticado, redirigiendo a login", pathname);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
