/**
 * Turbopack при `next build` иногда не резолвит `require("lightningcss-linux-x64-gnu")`,
 * а ищет только файл `lightningcss/lightningcss.<platform>.node`. Копируем бинарник из
 * платформенного пакета после `npm install` (Linux x64 glibc/musl).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function tryCopy(pkgName, nodeName) {
  const src = path.join(root, "node_modules", pkgName, nodeName);
  const dst = path.join(root, "node_modules", "lightningcss", nodeName);
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(dst)) {
    try {
      if (fs.statSync(src).size === fs.statSync(dst).size) return true;
    } catch {
      /* replace */
    }
  }
  fs.copyFileSync(src, dst);
  return true;
}

try {
  if (process.platform !== "linux" || process.arch !== "x64") {
    process.exit(0);
  }

  const gnuOk = tryCopy("lightningcss-linux-x64-gnu", "lightningcss.linux-x64-gnu.node");
  const muslOk = tryCopy("lightningcss-linux-x64-musl", "lightningcss.linux-x64-musl.node");

  if (!gnuOk && !muslOk) {
    console.warn(
      "[postinstall-lightningcss] На Linux x64 не найден lightningcss-linux-x64-gnu/musl — пропуск (ожидаемо на не-Linux CI)."
    );
  }
} catch (e) {
  console.warn("[postinstall-lightningcss]", e);
}
process.exit(0);
