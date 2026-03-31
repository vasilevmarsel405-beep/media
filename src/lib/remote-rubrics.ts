import { rubrics as staticRubrics } from "@/lib/content";
import { readStore, updateStore } from "@/lib/vps-json-store";
import type { Rubric } from "@/lib/types";

type RubricsStore = {
  bySlug: Record<string, Partial<Pick<Rubric, "name" | "description" | "cover">>>;
};

const STORE = "rubrics";
const FALLBACK: RubricsStore = { bySlug: {} };

function sanitize(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export async function getRubrics(): Promise<Rubric[]> {
  const state = await readStore<RubricsStore>(STORE, FALLBACK);
  return staticRubrics.map((r) => {
    const patch = state.bySlug[r.slug] ?? {};
    return {
      ...r,
      ...(sanitize(patch.name) ? { name: sanitize(patch.name)! } : {}),
      ...(sanitize(patch.description) ? { description: sanitize(patch.description)! } : {}),
      ...(sanitize(patch.cover) ? { cover: sanitize(patch.cover)! } : {}),
    };
  });
}

export async function saveRubrics(input: Rubric[]): Promise<Rubric[]> {
  const bySlug: RubricsStore["bySlug"] = {};
  for (const r of input) {
    const base = staticRubrics.find((x) => x.slug === r.slug);
    if (!base) continue;
    bySlug[r.slug] = {
      name: sanitize(r.name) ?? base.name,
      description: sanitize(r.description) ?? base.description,
      cover: sanitize(r.cover) ?? base.cover,
    };
  }
  await updateStore<RubricsStore>(STORE, FALLBACK, () => ({ bySlug }));
  return getRubrics();
}

