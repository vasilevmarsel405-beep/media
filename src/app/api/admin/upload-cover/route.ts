import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth";
import { isSameSiteBrowserRequest, sameOriginForbiddenResponse } from "@/lib/security/same-origin";

export const runtime = "nodejs";

const MAX_BYTES = 6 * 1024 * 1024;

const MIME_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  if (!isSameSiteBrowserRequest(request)) {
    return sameOriginForbiddenResponse();
  }

  const jar = await cookies();
  const token = jar.get(adminCookieName)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ожидается multipart/form-data" }, { status: 400 });
  }

  const entry = formData.get("file");
  if (!(entry instanceof File) || entry.size === 0) {
    return NextResponse.json({ error: "Выберите файл изображения" }, { status: 400 });
  }

  if (entry.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 6 МБ" }, { status: 400 });
  }

  const mime = entry.type || "application/octet-stream";
  const ext = MIME_EXT[mime];
  if (!ext) {
    return NextResponse.json(
      { error: "Допустимы только JPEG, PNG, WebP, GIF" },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await entry.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads", "covers");
  await mkdir(dir, { recursive: true });

  const filename = `${randomUUID()}${ext}`;
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buf);

  const url = `/uploads/covers/${filename}`;
  return NextResponse.json({ ok: true, url });
}
