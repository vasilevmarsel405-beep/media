import { NextResponse } from "next/server";

export function sameOriginForbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function isSameSiteBrowserRequest(request: Request): boolean {
  const m = request.method.toUpperCase();
  if (m === "GET" || m === "HEAD" || m === "OPTIONS") return true;

  const hostHeader = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!hostHeader) return false;
  const host = hostHeader.split(",")[0].trim().toLowerCase();

  const origin = request.headers.get("origin");
  if (origin && origin !== "null") {
    try {
      return new URL(origin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  return false;
}
