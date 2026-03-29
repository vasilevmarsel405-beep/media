import { NextResponse } from "next/server";
import { z } from "zod";
import { addNewsletterEmail, checkNewsletterRateLimit } from "@/lib/redis-newsletter";
import { isAnalyticsConfigured } from "@/lib/redis-analytics";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email().max(320),
});

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }

  if (!isAnalyticsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Подписка временно недоступна. Попробуйте позже." },
      { status: 503 }
    );
  }

  if (!(await checkNewsletterRateLimit(clientIp(request)))) {
    return NextResponse.json({ ok: false, error: "Слишком много запросов. Попробуйте через час." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Неверный запрос" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Укажите корректный email" }, { status: 400 });
  }

  const { ok, duplicate } = await addNewsletterEmail(parsed.data.email);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Сервис временно недоступен" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, duplicate });
}
