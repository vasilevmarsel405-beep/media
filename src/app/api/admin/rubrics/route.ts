import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth";
import { getRubrics, saveRubrics } from "@/lib/remote-rubrics";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";
import type { Rubric } from "@/lib/types";

export const runtime = "nodejs";

async function isAuthorized() {
  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }
  const items = await getRubrics();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
  }

  const arr = Array.isArray((json as { items?: unknown })?.items)
    ? ((json as { items: unknown[] }).items as unknown[])
    : null;
  if (!arr) {
    return NextResponse.json({ error: "Ожидается items: Rubric[]" }, { status: 400 });
  }

  const items: Rubric[] = [];
  for (const raw of arr) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Partial<Rubric>;
    if (!r.slug || typeof r.slug !== "string") continue;
    items.push({
      slug: r.slug,
      name: typeof r.name === "string" ? r.name : "",
      description: typeof r.description === "string" ? r.description : "",
      cover: typeof r.cover === "string" ? r.cover : "",
    });
  }

  const saved = await saveRubrics(items);
  return NextResponse.json({ ok: true, items: saved });
}

