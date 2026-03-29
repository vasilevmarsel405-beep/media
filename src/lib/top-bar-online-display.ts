/** Детерминированное «онлайн» 1500–2300: одно значение на всех в пределах 5-минутного окна, смена каждые 5 мин. */
const MIN = 1500;
const MAX = 2300;
const BUCKET_MS = 5 * 60 * 1000;

export function pseudoOnlineForWindow(now = Date.now()): number {
  const bucket = Math.floor(now / BUCKET_MS);
  let h = bucket >>> 0;
  h = Math.imul(h ^ (h >>> 16), 2246822519) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489917) >>> 0;
  return MIN + (h % (MAX - MIN + 1));
}
