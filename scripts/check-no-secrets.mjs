#!/usr/bin/env node
/**
 * Грубая проверка: нет ли в репозитории похожих на Upstash/Marketo токенов строк.
 * Запуск из корня marsmedia: node scripts/check-no-secrets.mjs
 */
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "out",
  "build",
  "coverage",
]);
const EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".json", ".css", ".example"]);

// Типичный префикс read-only токена Upstash REST (не срабатывать на коротких строках)
const SUSPICIOUS = [
  /\bgQAAAA[A-Za-z0-9+/=]{20,}\b/g,
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, // JWT-подобное
];

async function walk(dir, rel = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const hits = [];
  for (const e of entries) {
    const r = path.join(rel, e.name);
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      hits.push(...(await walk(full, r)));
      continue;
    }
    if (e.name === ".env.local" || e.name.startsWith(".env") && e.name !== ".env.example") continue;
    const ext = path.extname(e.name);
    if (!EXT.has(ext)) continue;
    let text;
    try {
      text = await readFile(full, "utf8");
    } catch {
      continue;
    }
    for (const re of SUSPICIOUS) {
      re.lastIndex = 0;
      const m = text.match(re);
      if (m) {
        hits.push({ file: r, sample: m[0].slice(0, 48) + "…" });
      }
    }
  }
  return hits;
}

const found = await walk(ROOT);
if (found.length) {
  console.error("check-no-secrets: возможная утечка секрета в файле:\n");
  for (const h of found) {
    console.error(`  ${h.file}\n    ${h.sample}\n`);
  }
  process.exit(1);
}
console.log("check-no-secrets: подозрительных паттернов в отслеживаемых файлах не найдено.");
