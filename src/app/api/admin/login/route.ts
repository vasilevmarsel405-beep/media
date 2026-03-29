import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  adminCookieName,
  adminCookieOptions,
  assertAdminPasswordConfigured,
  signAdminToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }

  try {
    assertAdminPasswordConfigured();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка конфигурации";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Неверный JSON" }, { status: 400 });
  }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ ok: false, error: "Неверный пароль" }, { status: 401 });
  }

  let token: string;
  try {
    token = await signAdminToken();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Не удалось выдать сессию";
    return NextResponse.json({ ok: false, error: msg }, { status: 503 });
  }
  const jar = await cookies();
  jar.set(adminCookieName, token, adminCookieOptions);

  return NextResponse.json({ ok: true });
}
