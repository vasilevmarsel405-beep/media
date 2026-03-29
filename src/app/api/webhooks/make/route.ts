import { NextResponse } from "next/server";
import { authorById, rubricBySlug, tagBySlug } from "@/lib/content";
import { timingSafeStringEqual } from "@/lib/security/timingSafe";
import { makeIngestBodySchema, normalizeIngestToPost } from "@/lib/post-ingest-schema";
import type { Post } from "@/lib/types";
import { deleteRemotePost, isRemotePostsConfigured, upsertRemotePost } from "@/lib/redis-posts";
import { revalidateAfterPostChange, revalidatePostFeedTagsOnly } from "@/lib/revalidate-post";

export const runtime = "nodejs";

function useLightRevalidate(): boolean {
  const v = process.env.MAKE_WEBHOOK_LIGHT_REVALIDATE?.trim();
  /** По умолчанию в webhook — быстрый режим (меньше шанс 504 на nginx). */
  return v == null || v === "" ? true : v === "1";
}

function revalidateForWebhook(post: Post | null, opts?: { slugDeleted?: string }) {
  if (useLightRevalidate()) {
    revalidatePostFeedTagsOnly();
    return;
  }
  revalidateAfterPostChange(post, opts);
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
 * При 504 на nginx — увеличьте `proxy_read_timeout` или задайте `MAKE_WEBHOOK_LIGHT_REVALIDATE=1`.
 */
export async function POST(request: Request) {
  if (!checkSecret(request)) {
    return unauthorized();
  }

  if (!isRemotePostsConfigured()) {
    return NextResponse.json(
      { ok: false, error: "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set" },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

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
      revalidateForWebhook(null, { slugDeleted: slug });
      return NextResponse.json({ ok: true, deleted: removed, slug });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Storage error";
      console.error("[webhooks/make] delete failed", slug, e);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  const post = normalizeIngestToPost(body.post);
  const refErr = validatePostRefs(post);
  if (refErr) {
    return NextResponse.json({ ok: false, error: refErr }, { status: 400 });
  }

  try {
    await upsertRemotePost(post);
    revalidateForWebhook(post);
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
    cache: useLightRevalidate() ? "tags-only" : "full",
  });
}
