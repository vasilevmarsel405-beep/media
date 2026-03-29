import { SignJWT, jwtVerify } from "jose";
import { adminCookieName, adminCookieOptions } from "@/lib/admin-constants";
import { adminSessionSecretBytes } from "@/lib/admin-session-secret";
import { timingSafeStringEqual } from "@/lib/security/timingSafe";

export { adminCookieName, adminCookieOptions };

/** В production обязателен ADMIN_PASSWORD. В development без него временно действует пароль 1234. */
function resolvedAdminPassword(): string | null {
  const env = process.env.ADMIN_PASSWORD;
  if (env != null && env !== "") return env;
  if (process.env.NODE_ENV === "development") return "1234";
  return null;
}

export function assertAdminPasswordConfigured(): void {
  const p = resolvedAdminPassword();
  if (!p || p.length < 4) {
    throw new Error("ADMIN_PASSWORD must be set (min 4 characters)");
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = resolvedAdminPassword();
  if (!expected || expected.length < 4) return false;
  return timingSafeStringEqual(password, expected);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setSubject("mars-admin")
    .sign(adminSessionSecretBytes());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, adminSessionSecretBytes(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

