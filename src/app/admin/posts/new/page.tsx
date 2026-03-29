import Link from "next/link";
import { AdminPostForm } from "@/components/admin/AdminPostForm";
import { isRemotePostsConfigured } from "@/lib/redis-posts";

export default function AdminNewPostPage() {
  if (!isRemotePostsConfigured()) {
    return (
      <div className="space-y-4">
        <p className="text-amber-200">Нужен Redis для сохранения материалов.</p>
        <Link href="/admin/posts" className="text-sm text-mars-accent hover:underline">
          ← К списку
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/posts" className="text-sm text-slate-400 hover:text-white">
          ← Все материалы
        </Link>
        <h1 className="font-display mt-3 text-3xl font-bold text-white">Новый материал</h1>
      </div>
      <AdminPostForm mode="create" />
    </div>
  );
}
