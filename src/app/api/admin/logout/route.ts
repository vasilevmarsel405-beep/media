import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-auth";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";

export async function POST(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }

  const jar = await cookies();
  jar.delete(adminCookieName);
  return NextResponse.json({ ok: true });
}
