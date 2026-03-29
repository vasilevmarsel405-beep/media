import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";
import { fetchYoutubeVideoEnrichmentDirect } from "@/lib/youtube-enrichment";
import { extractYoutubeVideoId } from "@/lib/youtube-id";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }

  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
  }

  const raw = typeof body.url === "string" ? body.url.trim() : "";
  if (!raw) {
    return NextResponse.json({ error: "Укажите ссылку или ID ролика" }, { status: 400 });
  }

  const videoId = extractYoutubeVideoId(raw);
  if (!videoId) {
    return NextResponse.json({ error: "Не удалось распознать ссылку YouTube" }, { status: 400 });
  }

  const meta = await fetchYoutubeVideoEnrichmentDirect(videoId);
  if (!meta) {
    return NextResponse.json(
      {
        error:
          "YouTube не вернул данные (сеть, файрвол или ключ API). Проверьте YOUTUBE_DATA_API_KEY и доступ к Google.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    youtubeId: videoId,
    title: meta.title,
    description: meta.description,
    thumbnailUrl: meta.thumbnailUrl ?? null,
    channelTitle: meta.channelTitle ?? null,
    source: meta.source,
  });
}
