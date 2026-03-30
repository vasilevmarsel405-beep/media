import { updateStore } from "./vps-json-store";

type FormsStore = {
  newsletterEmails: string[];
  contactLog: { name: string; email: string; message: string; createdAt: string }[];
  rateLimit: Record<string, { count: number; resetAt: number }>;
};

const FALLBACK: FormsStore = { newsletterEmails: [], contactLog: [], rateLimit: {} };
const STORE = "forms";

export function isFormsBackendAvailable(): boolean {
  return process.env.DISABLE_LOCAL_FORMS !== "1";
}

const RL_NEWS = "newsletter";
const RL_CONTACT = "contact";

const RL_MAX = 10;
const RL_WINDOW_MS = 3600 * 1000;

async function incrRl(keyPrefix: string, clientKey: string): Promise<boolean> {
  const safe = clientKey.replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 128) || "unknown";
  const key = `${keyPrefix}:${safe}`;
  let allowed = true;
  await updateStore(STORE, FALLBACK, (prev) => {
    const now = Date.now();
    const rl = { ...prev.rateLimit };
    for (const [k, v] of Object.entries(rl)) {
      if (v.resetAt <= now) delete rl[k];
    }
    const cur = rl[key];
    if (!cur || cur.resetAt <= now) {
      rl[key] = { count: 1, resetAt: now + RL_WINDOW_MS };
      allowed = true;
    } else {
      cur.count += 1;
      allowed = cur.count <= RL_MAX;
    }
    return { ...prev, rateLimit: rl };
  });
  return allowed;
}

export async function checkNewsletterRateLimit(ipKey: string): Promise<boolean> {
  return incrRl(RL_NEWS, ipKey);
}

export async function checkContactRateLimit(ipKey: string): Promise<boolean> {
  return incrRl(RL_CONTACT, ipKey);
}

export async function saveNewsletterEmail(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  await updateStore(STORE, FALLBACK, (prev) => {
    if (prev.newsletterEmails.includes(e)) return prev;
    return { ...prev, newsletterEmails: [...prev.newsletterEmails, e] };
  });
}

export async function saveContactMessage(payload: {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}): Promise<void> {
  await updateStore(STORE, FALLBACK, (prev) => ({
    ...prev,
    contactLog: [payload, ...prev.contactLog].slice(0, 500),
  }));
}
