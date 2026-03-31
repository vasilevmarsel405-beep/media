import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { authorById, rubricBySlug, tagBySlug } from "@/lib/content";
import { timingSafeStringEqual } from "@/lib/security/timingSafe";
import { makeIngestBodySchema, normalizeIngestToPost } from "@/lib/post-ingest-schema";
import type { Post } from "@/lib/types";
import { deleteRemotePost, isRemotePostsConfigured, upsertRemotePost } from "@/lib/redis-posts";
import { invalidatePostsCache } from "@/lib/posts-service";
import { revalidateAfterPostChange, revalidatePostPathsExact, revalidatePostPathsLight } from "@/lib/revalidate-post";

export const runtime = "nodejs";
const MCP_KV_DOWNLOAD_RE = /^https:\/\/mcp-kv\.ru\/ai-delete\/api\/download\/[a-z0-9]+(?:\?.*)?$/i;
const MAX_AUTO_COVER_BYTES = 8 * 1024 * 1024;

function isMcpKvDownloadUrl(value: string): boolean {
  const v = value.trim();
  return MCP_KV_DOWNLOAD_RE.test(v);
}

function extByMime(contentType: string): string | null {
  const base = contentType.split(";")[0]?.trim().toLowerCase();
  if (base === "image/jpeg") return ".jpg";
  if (base === "image/png") return ".png";
  if (base === "image/webp") return ".webp";
  if (base === "image/gif") return ".gif";
  return null;
}

async function autoPersistExternalCover(imageUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(imageUrl, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) return null;

    const mime = (res.headers.get("content-type") ?? "").trim();
    const ext = extByMime(mime);
    if (!ext) return null;

    const lenHeader = res.headers.get("content-length");
    if (lenHeader) {
      const len = Number(lenHeader);
      if (Number.isFinite(len) && len > MAX_AUTO_COVER_BYTES) return null;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0 || buf.length > MAX_AUTO_COVER_BYTES) return null;

    const dir = path.join(process.cwd(), ".local", "uploads", "covers");
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(dir, filename);
    await writeFile(filePath, buf);
    return `/api/media/covers/${filename}`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function useLightRevalidate(): boolean {
  const v = process.env.MAKE_WEBHOOK_LIGHT_REVALIDATE?.trim();
  return v == null || v === "" ? true : v === "1";
}

function cacheModeForResponse(): string {
  if (process.env.MAKE_WEBHOOK_REVALIDATE_PATHS?.trim() !== "1") return "isr-only";
  return useLightRevalidate() ? "deferred-light" : "deferred-full";
}

/**
 * `revalidatePath` из API route на self-hosted Next часто «подвешивает» весь процесс:
 * сайт перестаёт отвечать даже через setImmediate. По умолчанию webhook **только** пишет Redis
 * и сбрасывает in-memory ленту (`invalidatePostsCache`). HTML обновляется по ISR (`revalidate` на страницах).
 *
 * Если очень нужен мгновенный сброс кеша маршрутов — задайте `MAKE_WEBHOOK_REVALIDATE_PATHS=1` (на свой риск).
 */
function maybeScheduleOnDemandRevalidate(post: Post | null, opts?: { slugDeleted?: string }) {
  if (process.env.MAKE_WEBHOOK_REVALIDATE_PATHS?.trim() !== "1") return;
  setImmediate(() => {
    try {
      if (useLightRevalidate()) {
        revalidatePostPathsLight(post, opts);
      } else {
        revalidateAfterPostChange(post, opts);
      }
    } catch (e) {
      console.error("[webhooks/make] revalidate failed", e);
    }
  });
}

function maybeScheduleOnDemandRevalidateExact(post: Post | null, opts?: { slugDeleted?: string }) {
  // Default: включаем “exact-only” в production — это лечит кейс,
  // когда Next кэширует `notFound` для нового slug и до следующей ISR-генерации его не видно.
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.MAKE_WEBHOOK_REVALIDATE_EXACT?.trim() === "0") return;

  setImmediate(() => {
    try {
      revalidatePostPathsExact(post, opts);
    } catch (e) {
      console.error("[webhooks/make] exact revalidate failed", e);
    }
  });
}

function validatePostRefs(post: Post): string | null {
  if (!authorById(post.authorId)) return `Unknown authorId: ${post.authorId}`;
  for (const r of post.rubricSlugs) {
    if (!rubricBySlug(r)) return `Unknown rubric slug: ${r}`;
  }
  for (const t of post.tagSlugs) {
    if (!tagBySlug(t)) return `Unknown tag slug: ${t}`;
  }
  return null;
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function checkSecret(request: Request): boolean {
  const secret = process.env.MAKE_WEBHOOK_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;
  const header = request.headers.get("x-make-secret");
  const token = bearer ?? header;
  if (!token) return false;
  return timingSafeStringEqual(token, secret);
}

function normalizeMakeAliases(input: unknown): unknown {
  if (!input || typeof input !== "object") return input;
  const root = input as Record<string, unknown>;
  if (root.action !== "upsert") return input;
  if (!root.post || typeof root.post !== "object") return input;
  const post = root.post as Record<string, unknown>;
  return {
    ...root,
    post: {
      ...post,
      authorId: post.authorId ?? post.author_id,
      rubricSlugs: post.rubricSlugs ?? post.rubric_slugs,
      tagSlugs: post.tagSlugs ?? post.tag_slugs,
      publishedAt: post.publishedAt ?? post.published_at ?? post.date,
      readMin: post.readMin ?? post.read_min,
      homeBadge: post.homeBadge ?? post.home_badge,
      homeCta: post.homeCta ?? post.home_cta,
      homeHero: post.homeHero ?? post.home_hero,
        homePick: post.homePick ?? post.home_pick,
      homeVideoUrl: post.homeVideoUrl ?? post.home_video_url,
      homeVideoLabel: post.homeVideoLabel ?? post.home_video_label,
      seoTitle: post.seoTitle ?? post.seo_title,
      seoDescription: post.seoDescription ?? post.seo_description,
      seoKeywords: post.seoKeywords ?? post.seo_keywords,
      seoNoindex: post.seoNoindex ?? post.seo_noindex,
    },
  };
}

function urlPathForPost(post: Post): string {
  const base =
    post.kind === "news"
      ? "/novosti"
      : post.kind === "article"
        ? "/stati"
        : post.kind === "analytics"
          ? "/analitika"
          : post.kind === "interview"
            ? "/intervyu"
            : "/video";
  return `${base}/${post.slug}`;
}

/**
 * Сохранение в Upstash и сброс кеша — **синхронно до ответа 200**.
 * На VPS `after()` для фоновых задач ненадёжен: Make видел ok, а Redis пустой.
 * При 504 у nginx см. `docs/nginx-cryptomarsmedia.conf.example`.
 */
export async function POST(request: Request) {
  if (!checkSecret(request)) {
    return unauthorized();
  }

  if (!isRemotePostsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Posts storage is disabled. Set POSTS_STORAGE_MODE=local or configure UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN.",
      },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  json = normalizeMakeAliases(json);

  const parsed = makeIngestBodySchema.safeParse(json);
  if (!parsed.success) {
    const body =
      process.env.NODE_ENV === "production"
        ? { ok: false as const, error: "Validation failed" }
        : { ok: false as const, error: "Validation failed", details: parsed.error.flatten() };
    return NextResponse.json(body, { status: 400 });
  }

  const body = parsed.data;

  if (body.action === "delete") {
    const slug = body.slug;
    try {
      const removed = await deleteRemotePost(slug);
      invalidatePostsCache();
      maybeScheduleOnDemandRevalidate(null, { slugDeleted: slug });
      maybeScheduleOnDemandRevalidateExact(null, { slugDeleted: slug });
      return NextResponse.json({ ok: true, deleted: removed, slug });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Storage error";
      console.error("[webhooks/make] delete failed", slug, e);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  const normalized = normalizeIngestToPost(body.post);
  let post = normalized;

  const rawImage = normalized.image?.trim() ?? "";
  if (rawImage && isMcpKvDownloadUrl(rawImage)) {
    const localCover = await autoPersistExternalCover(rawImage);
    if (localCover) {
      post = { ...normalized, image: localCover };
    } else {
      // Мягкий режим: если автоскачивание не удалось, публикацию не блокируем.
      console.warn("[webhooks/make] auto cover download failed, keep source URL", {
        slug: normalized.slug,
        imageUrl: rawImage,
      });
    }
  }

  const refErr = validatePostRefs(post);
  if (refErr) {
    return NextResponse.json({ ok: false, error: refErr }, { status: 400 });
  }

  try {
    await upsertRemotePost(post);
    invalidatePostsCache();
    maybeScheduleOnDemandRevalidate(post);
    maybeScheduleOnDemandRevalidateExact(post);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Storage error";
    console.error("[webhooks/make] upsert failed", post.slug, e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    saved: true,
    slug: post.slug,
    kind: post.kind,
    urlPath: urlPathForPost(post),
    cache: cacheModeForResponse(),
  });
}
