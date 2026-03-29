import { after, NextResponse } from "next/server";
import { authorById, rubricBySlug, tagBySlug } from "@/lib/content";
import { timingSafeStringEqual } from "@/lib/security/timingSafe";
import { makeIngestBodySchema, normalizeIngestToPost } from "@/lib/post-ingest-schema";
import type { Post } from "@/lib/types";
import { deleteRemotePost, isRemotePostsConfigured, upsertRemotePost } from "@/lib/redis-posts";
import { revalidateAfterPostChange } from "@/lib/revalidate-post";

export const runtime = "nodejs";

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
 * Всё, что ходит в Upstash и revalidatePath, уходит в фон: nginx не ждёт и не отдаёт 504.
 * Make получает 200 сразу после валидации JSON; материал появляется на сайте через секунды.
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
    after(() => {
      void (async () => {
        try {
          const removed = await deleteRemotePost(slug);
          revalidateAfterPostChange(null, { slugDeleted: slug });
          if (process.env.NODE_ENV !== "production") {
            console.info("[webhooks/make] delete done", slug, removed);
          }
        } catch (e) {
          console.error("[webhooks/make] delete failed", slug, e);
        }
      })();
    });
    return NextResponse.json({
      ok: true,
      slug,
      queued: true,
      /** Поле заполняется асинхронно; для Make достаточно ok + slug. */
      note: "Removal and cache refresh run in the background.",
    });
  }

  const post = normalizeIngestToPost(body.post);
  const refErr = validatePostRefs(post);
  if (refErr) {
    return NextResponse.json({ ok: false, error: refErr }, { status: 400 });
  }

  after(() => {
    void (async () => {
      try {
        await upsertRemotePost(post);
        revalidateAfterPostChange(post);
        if (process.env.NODE_ENV !== "production") {
          console.info("[webhooks/make] upsert done", post.slug);
        }
      } catch (e) {
        console.error("[webhooks/make] upsert failed", post.slug, e);
      }
    })();
  });

  return NextResponse.json({
    ok: true,
    queued: true,
    slug: post.slug,
    kind: post.kind,
    urlPath: urlPathForPost(post),
    note: "Post save and cache refresh run in the background.",
  });
}
