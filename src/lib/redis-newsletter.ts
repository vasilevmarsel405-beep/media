import { updateStore } from "./vps-json-store";

type NewsletterStore = {
  emails: string[];
  rateLimit: Record<string, { count: number; resetAt: number }>;
};

const STORE = "newsletter";
const FALLBACK: NewsletterStore = { emails: [], rateLimit: {} };
const RL_WINDOW_MS = 60 * 60 * 1000;
const RL_MAX = 10;

function safeClientKey(clientKey: string): string {
  return clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
}

export async function checkNewsletterRateLimit(clientKey: string): Promise<boolean> {
  const safe = safeClientKey(clientKey);
  let allowed = true;
  await updateStore(STORE, FALLBACK, (prev) => {
    const now = Date.now();
    const rl = { ...prev.rateLimit };
    for (const [k, v] of Object.entries(rl)) {
      if (v.resetAt <= now) delete rl[k];
    }
    const cur = rl[safe];
    if (!cur || cur.resetAt <= now) {
      rl[safe] = { count: 1, resetAt: now + RL_WINDOW_MS };
      allowed = true;
    } else {
      cur.count += 1;
      allowed = cur.count <= RL_MAX;
    }
    return { ...prev, rateLimit: rl };
  });
  return allowed;
}

/** Возвращает true если email новый, false если уже был в списке. */
export async function addNewsletterEmail(email: string): Promise<{ ok: boolean; duplicate: boolean }> {
  const normalized = email.toLowerCase().trim();
  let duplicate = false;
  await updateStore(STORE, FALLBACK, (prev) => {
    if (prev.emails.includes(normalized)) {
      duplicate = true;
      return prev;
    }
    return { ...prev, emails: [...prev.emails, normalized] };
  });
  return { ok: true, duplicate };
}
