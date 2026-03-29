import { Suspense } from "react";
import { LoginClient } from "@/app/admin/login/LoginClient";

export default function SecretAdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-slate-500">Загрузка…</div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
