import { AdminRubricsEditor } from "@/components/admin/AdminRubricsEditor";
import { getRubrics } from "@/lib/remote-rubrics";

export const dynamic = "force-dynamic";

export default async function AdminRubricsPage() {
  const items = await getRubrics();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Рубрики</h1>
        <p className="mt-2 text-sm text-slate-400">
          Управляйте блоком «Ваши темы»: название, описание и фото обложки для каждой рубрики.
        </p>
      </div>
      <AdminRubricsEditor initialItems={items} />
    </div>
  );
}

