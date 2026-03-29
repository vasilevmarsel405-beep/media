#!/usr/bin/env node
/**
 * Проверяет, что для продакшена заданы нужные переменные (без вывода значений).
 * Запуск из marsmedia: node scripts/check-env-production.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const text = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const merged = {
  ...parseEnvFile(path.join(root, ".env.production")),
  ...parseEnvFile(path.join(root, ".env.production.local")),
  ...parseEnvFile(path.join(root, ".env.local")),
};

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "MAKE_WEBHOOK_SECRET",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
];

const optional = ["NEXT_PUBLIC_YANDEX_METRIKA_ID", "YANDEX_METRIKA_OAUTH_TOKEN", "NEXT_PUBLIC_IMAGE_REMOTE_HOSTS"];

const missing = required.filter((k) => !merged[k]?.trim());
const missingOptional = optional.filter((k) => !merged[k]?.trim());

console.log("Проверка переменных окружения (значения не показываются)\n");

if (missing.length === 0) {
  console.log("OK: обязательные ключи заданы:", required.length + "/" + required.length);
} else {
  console.log("ОШИБКА: не заданы переменные:");
  missing.forEach((k) => console.log("  -", k));
  process.exitCode = 1;
}

if (missingOptional.length > 0 && process.exitCode !== 1) {
  console.log("\nПредупреждение: не заданы опциональные:");
  missingOptional.forEach((k) => console.log("  -", k));
} else if (missingOptional.length === 0 && process.exitCode !== 1) {
  console.log("Опциональные ключи тоже заданы.");
}

if (process.exitCode === 1) {
  console.log("\nСоздайте .env.production на сервере (см. docs/VPS-ENV.ru.md).");
}
