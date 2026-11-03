/**
 * A small fixed-window rate limiter kept in server memory.
 *
 * Limits: on Vercel each server instance has its own memory, and instances come
 * and go, so this is best-effort: it stops one person or script hammering the
 * form, not a distributed attack. For a hard guarantee, add a Vercel Firewall
 * rate-limit rule or a shared store (e.g. Upstash Redis). See CLAUDE.md.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
const MAX_KEYS = 10_000;

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type Limit = {
  /** Unique name for this limit, e.g. `ip-10m:1.2.3.4`. */
  key: string;
  max: number;
  windowMs: number;
};

/** True if every limit still has room. Doesn't count anything: call `consume` once the request is accepted. */
export function withinLimits(limits: readonly Limit[], now = Date.now()): boolean {
  return limits.every(({ key, max }) => {
    const window = windows.get(key);
    return !window || window.resetAt <= now || window.count < max;
  });
}

/** Counts one request against every limit. */
export function consume(limits: readonly Limit[], now = Date.now()) {
  if (windows.size > MAX_KEYS) sweep(now);
  for (const { key, windowMs } of limits) {
    const window = windows.get(key);
    if (!window || window.resetAt <= now) windows.set(key, { count: 1, resetAt: now + windowMs });
    else window.count += 1;
  }
}
