import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function safeFileName(raw: string): string | null {
  const name = path.basename(raw).trim();
  if (!name) return null;
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return null;
  const ext = path.extname(name).toLowerCase();
  if (!MIME_BY_EXT[ext]) return null;
  return name;
}

async function tryRead(baseDir: string, fileName: string): Promise<Buffer | null> {
  try {
    const full = path.join(baseDir, fileName);
    return await readFile(full);
  } catch {
    return null;
  }
}

export async function GET(_: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name: rawName } = await ctx.params;
  const name = safeFileName(rawName);
  if (!name) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const localDir = path.join(process.cwd(), ".local", "uploads", "covers");
  const publicDir = path.join(process.cwd(), "public", "uploads", "covers");
  const buf = (await tryRead(localDir, name)) ?? (await tryRead(publicDir, name));
  if (!buf) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ext = path.extname(name).toLowerCase();
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
