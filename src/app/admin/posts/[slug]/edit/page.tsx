import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPostForm } from "@/components/admin/AdminPostForm";
import { getPostBySlug } from "@/lib/posts-service";
import { readRemotePostsRaw } from "@/lib/redis-posts";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminEditPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const remote = await readRemotePostsRaw();
  const canSave = remote.some((p) => p.slug === slug);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/posts" className="text-sm text-slate-400 hover:text-white">
          ← Все материалы
        </Link>
        <h1 className="font-display mt-3 text-3xl font-bold text-white">Редактирование</h1>
      </div>
      <AdminPostForm key={slug} mode="edit" initial={post} canSave={canSave} />
    </div>
  );
}
