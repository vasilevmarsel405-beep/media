import { NextResponse } from "next/server";
import { getAdminPostsList } from "@/lib/admin-posts-list";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";
import { authorById, rubricBySlug, tagBySlug } from "@/lib/content";
import { makeIngestPostSchema, normalizeIngestToPost } from "@/lib/post-ingest-schema";
import { revalidateAfterPostChange } from "@/lib/revalidate-post";
import { deleteRemotePost, isRemotePostsConfigured, upsertRemotePost } from "@/lib/redis-posts";
import type { Post } from "@/lib/types";

export const runtime = "nodejs";

function validatePostRefs(post: Post): string | null {
  if (!authorById(post.authorId)) return `Неизвестный authorId: ${post.authorId}`;
  for (const r of post.rubricSlugs) {
    if (!rubricBySlug(r)) return `Неизвестная рубрика: ${r}`;
  }
  for (const t of post.tagSlugs) {
    if (!tagBySlug(t)) return `Неизвестный тег: ${t}`;
  }
  return null;
}

export async function GET() {
  if (!isRemotePostsConfigured()) {
    return NextResponse.json({ error: "Redis не настроен" }, { status: 503 });
  }
  const items = await getAdminPostsList();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  if (!isRemotePostsConfigured()) {
    return NextResponse.json({ error: "Redis не настроен" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Неверный JSON" }, { status: 400 });
  }

  const parsed = makeIngestPostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Валидация", details: parsed.error.flatten() }, { status: 400 });
  }

  const post = normalizeIngestToPost(parsed.data);
  const refErr = validatePostRefs(post);
  if (refErr) {
    return NextResponse.json({ error: refErr }, { status: 400 });
  }

  await upsertRemotePost(post);
  revalidateAfterPostChange(post);
  return NextResponse.json({ ok: true, slug: post.slug });
}

export async function DELETE(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }

  if (!isRemotePostsConfigured()) {
    return NextResponse.json({ error: "Redis не настроен" }, { status: 503 });
  }

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Нужен параметр slug" }, { status: 400 });
  }

  const removed = await deleteRemotePost(slug);
  if (!removed) {
    return NextResponse.json({ error: "Нет в облаке или уже удалён" }, { status: 404 });
  }

  revalidateAfterPostChange(null, { slugDeleted: slug });
  return NextResponse.json({ ok: true, slug });
}
