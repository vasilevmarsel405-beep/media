/**
 * Секрет подписи JWT админ-сессии.
 * В production обязателен ADMIN_SESSION_SECRET (≥16 символов).
 * В development, если переменная не задана, используется фиксированный локальный ключ (не для продакшена).
 */
const DEV_FALLBACK_SESSION_SECRET = "mars-media-dev-session-secret-min-32-chars!!";

export function resolveAdminSessionSecret(): string | null {
  const env = process.env.ADMIN_SESSION_SECRET;
  if (env != null && env !== "" && env.length >= 16) return env;
  if (process.env.NODE_ENV === "development") return DEV_FALLBACK_SESSION_SECRET;
  return null;
}

export function adminSessionSecretBytes(): Uint8Array {
  const s = resolveAdminSessionSecret();
  if (!s) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(s);
}
