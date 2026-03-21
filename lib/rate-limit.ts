type Entry = {
  count: number;
  windowStart: number;
};

const buckets = new Map<string, Entry>();

export function consumeRateLimit(
  key: string,
  options: {
    max: number;
    windowMs: number;
  }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= options.windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: options.max - 1,
      resetAt: now + options.windowMs,
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, options.max - existing.count);
  const allowed = existing.count <= options.max;

  return {
    allowed,
    remaining,
    resetAt: existing.windowStart + options.windowMs,
  };
}