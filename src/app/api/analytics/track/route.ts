import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { checkTrackRateLimit, recordVisit } from "@/lib/redis-analytics";
import { sanitizeAnalyticsPath } from "@/lib/security/analytics-path";

const VID = "mars_vid";
const SID = "mars_sid";

export const runtime = "nodejs";

function clientTrackKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(request: Request) {
  if (!(await checkTrackRateLimit(clientTrackKey(request)))) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let path = "/";
  try {
    const body = await request.json();
    path = sanitizeAnalyticsPath(body?.path);
  } catch {
    /* use default */
  }

  const jar = request.headers.get("cookie") ?? "";
  const getCk = (name: string) => {
    const m = jar.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  };

  let visitorId = getCk(VID);
  let sessionId = getCk(SID);
  const setVid = !visitorId;
  const setSid = !sessionId;
  if (!visitorId) visitorId = randomUUID();
  if (!sessionId) sessionId = randomUUID();

  await recordVisit({ visitorId, sessionId, path });

  const res = NextResponse.json({ ok: true });
  const cookieBase = {
    path: "/",
    sameSite: "lax" as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  if (setVid) {
    res.cookies.set(VID, visitorId, { ...cookieBase, maxAge: 60 * 60 * 24 * 400 });
  }
  if (setSid) {
    res.cookies.set(SID, sessionId, { ...cookieBase, maxAge: 60 * 60 * 24 });
  }
  return res;
}
