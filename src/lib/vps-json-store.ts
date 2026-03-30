import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const writeQueue = new Map<string, Promise<void>>();

function storagePath(name: string): string {
  return path.join(process.cwd(), ".local", "storage", `${name}.json`);
}

async function readRaw(file: string): Promise<string | null> {
  if (!existsSync(file)) return null;
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

export async function readStore<T>(name: string, fallback: T): Promise<T> {
  const file = storagePath(name);
  const raw = await readRaw(file);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeStore<T>(name: string, data: T): Promise<void> {
  const file = storagePath(name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function updateStore<T>(name: string, fallback: T, updater: (prev: T) => T): Promise<T> {
  const file = storagePath(name);
  const prevTask = writeQueue.get(file) ?? Promise.resolve();

  let doneResolve!: () => void;
  const done = new Promise<void>((resolve) => {
    doneResolve = resolve;
  });
  const queued = prevTask.then(() => done);
  writeQueue.set(file, queued);

  await prevTask;
  try {
    const prev = await readStore(name, fallback);
    const next = updater(prev);
    await writeStore(name, next);
    return next;
  } finally {
    doneResolve();
    if (writeQueue.get(file) === queued) writeQueue.delete(file);
  }
}
