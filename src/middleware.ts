import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { adminCookieName } from "@/lib/admin-constants";
import { adminEntryPathname } from "@/lib/admin-entry-path";
import { resolveAdminSessionSecret } from "@/lib/admin-session-secret";

function attachNoStore(res: NextResponse) {
  // Жёстко запрещаем кеш HTML на клиенте/прокси/CDN.
  res.headers.set("Cache-Control", "no-store, no-cache, max-age=0, must-revalidate, proxy-revalidate");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  return res;
}

function attachBuildMarker(res: NextResponse) {
  // Помогает поймать ситуацию, когда разные процессы/билды отдают разные страницы.
  const build =
    process.env.MARS_BUILD_ID?.trim() ||
    process.env.NEXT_PUBLIC_MARS_BUILD_ID?.trim() ||
    process.env.GIT_COMMIT_SHA?.trim() ||
    process.env.SOURCE_VERSION?.trim() ||
    "unknown";
  res.headers.set("X-Mars-Build", build);
  return res;
}

function secretBytes(): Uint8Array | null {
  const s = resolveAdminSessionSecret();
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminUi = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isHome = pathname === "/";
  const isDebugPosts = pathname === "/api/debug/posts";

  // Для главной и debug — всегда отдаем без кеша и с маркером билда.
  if ((isHome || isDebugPosts) && request.method === "GET") {
    return attachBuildMarker(attachNoStore(NextResponse.next()));
  }

  if (!isAdminUi && !isAdminApi) return NextResponse.next();

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    const earlySecret = secretBytes();
    const earlyToken = request.cookies.get(adminCookieName)?.value;
    if (earlySecret && earlyToken) {
      try {
        await jwtVerify(earlyToken, earlySecret, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        /* на скрытую форму входа */
      }
    }
    const toLogin = request.nextUrl.clone();
    toLogin.pathname = adminEntryPathname;
    return NextResponse.redirect(toLogin);
  }
  if (pathname === "/api/admin/login" && request.method === "POST") {
    return NextResponse.next();
  }

  const secret = secretBytes();
  if (!secret) {
    if (isAdminApi) {
      return NextResponse.json({ error: "ADMIN_SESSION_SECRET missing" }, { status: 503 });
    }
    const nocfg = request.nextUrl.clone();
    nocfg.pathname = adminEntryPathname;
    nocfg.searchParams.set("nocfg", "1");
    return NextResponse.redirect(nocfg);
  }

  const token = request.cookies.get(adminCookieName)?.value;
  if (!token) {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const toLogin = request.nextUrl.clone();
    toLogin.pathname = adminEntryPathname;
    toLogin.search = "";
    return NextResponse.redirect(toLogin);
  }

  try {
    await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const toLogin = request.nextUrl.clone();
    toLogin.pathname = adminEntryPathname;
    toLogin.search = "";
    return NextResponse.redirect(toLogin);
  }
}

export const config = {
  matcher: ["/", "/api/debug/posts", "/admin/:path*", "/api/admin/:path*"],
};
