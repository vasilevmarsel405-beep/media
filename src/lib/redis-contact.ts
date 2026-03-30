import { updateStore } from "./vps-json-store";

type ContactMessage = {
  email: string;
  message: string;
  name?: string;
  at: number;
};

type ContactStore = {
  inbox: ContactMessage[];
  rateLimit: Record<string, { count: number; resetAt: number }>;
};

const STORE = "contact";
const FALLBACK: ContactStore = { inbox: [], rateLimit: {} };
const RL_WINDOW_MS = 60 * 60 * 1000;
const RL_MAX = 5;

function safeClientKey(clientKey: string): string {
  return clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
}

export async function checkContactRateLimit(clientKey: string): Promise<boolean> {
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

export async function appendContactMessage(entry: {
  email: string;
  message: string;
  name?: string;
}): Promise<boolean> {
  const payload: ContactMessage = {
    ...entry,
    at: Date.now(),
  };
  await updateStore(STORE, FALLBACK, (prev) => ({
    ...prev,
    inbox: [payload, ...prev.inbox].slice(0, 500),
  }));
  return true;
}
