import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "pregon_auth";
const AUTH_COOKIE_VALUE = "authenticated";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/**
 * Verifica la contraseña de admin
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error(
      "❌ ADMIN_PASSWORD no está configurada en las variables de entorno"
    );
    return false;
  }

  console.log("password", password);
  console.log("adminPassword", adminPassword);

  return password === adminPassword;
}

/**
 * Crea la sesión de autenticación
 */
export async function createAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Elimina la sesión de autenticación
 */
export async function deleteAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return authCookie?.value === AUTH_COOKIE_VALUE;
}
