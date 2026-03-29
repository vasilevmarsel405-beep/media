/**
 * Turbopack при `next build` иногда не резолвит платформенные optional-пакеты
 * (`lightningcss-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`), а ищет только
 * `.node` рядом с основным пакетом. Копируем бинарники после `npm install` (Linux x64).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function tryCopy(srcDir, nodeName, dstDir) {
  const src = path.join(root, "node_modules", srcDir, nodeName);
  const dst = path.join(root, "node_modules", dstDir, nodeName);
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(dst)) {
    try {
      if (fs.statSync(src).size === fs.statSync(dst).size) return true;
    } catch {
      /* replace */
    }
  }
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  return true;
}

try {
  if (process.platform !== "linux" || process.arch !== "x64") {
    process.exit(0);
  }

  const gnuLc = tryCopy(
    "lightningcss-linux-x64-gnu",
    "lightningcss.linux-x64-gnu.node",
    "lightningcss"
  );
  const muslLc = tryCopy(
    "lightningcss-linux-x64-musl",
    "lightningcss.linux-x64-musl.node",
    "lightningcss"
  );
  if (!gnuLc && !muslLc) {
    console.error(
      "[postinstall-native-bindings] Linux x64: нет lightningcss-linux-x64-gnu/musl — npm ci/install не подтянул optional-пакеты."
    );
    process.exit(1);
  }

  const gnuOx = tryCopy(
    "@tailwindcss/oxide-linux-x64-gnu",
    "tailwindcss-oxide.linux-x64-gnu.node",
    "@tailwindcss/oxide"
  );
  const muslOx = tryCopy(
    "@tailwindcss/oxide-linux-x64-musl",
    "tailwindcss-oxide.linux-x64-musl.node",
    "@tailwindcss/oxide"
  );
  if (!gnuOx && !muslOx) {
    console.error(
      "[postinstall-native-bindings] Linux x64: нет @tailwindcss/oxide-linux-x64-gnu/musl — проверьте optionalDependencies и package-lock.json."
    );
    process.exit(1);
  }
} catch (e) {
  console.warn("[postinstall-native-bindings]", e);
}
process.exit(0);
