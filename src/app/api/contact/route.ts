import { NextResponse } from "next/server";
import { z } from "zod";
import { isAnalyticsConfigured } from "@/lib/redis-analytics";
import { appendContactMessage, checkContactRateLimit } from "@/lib/redis-contact";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().max(320),
  message: z.string().trim().min(10).max(8000),
  name: z.string().trim().max(200).optional(),
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
      { ok: false, error: "Форма временно недоступна. Напишите на почту редакции." },
      { status: 503 }
    );
  }

  if (!(await checkContactRateLimit(clientIp(request)))) {
    return NextResponse.json({ ok: false, error: "Слишком много сообщений. Попробуйте позже." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Неверный запрос" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Проверьте email и текст (от 10 символов)." }, { status: 400 });
  }

  const ok = await appendContactMessage(parsed.data);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Не удалось сохранить. Напишите на почту." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
