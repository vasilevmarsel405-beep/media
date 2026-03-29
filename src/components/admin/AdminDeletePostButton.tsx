"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminDeletePostButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!confirm(`Удалить материал «${slug}» из облака? Статический демо-материал с тем же slug не трогаем в репозитории.`)) {
          return;
        }
        setBusy(true);
        const res = await fetch(`/api/admin/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
        if (!res.ok) {
          alert("Не удалось удалить (возможно, материал только в коде).");
          setBusy(false);
          return;
        }
        router.refresh();
      }}
      className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      Удалить
    </button>
  );
}
