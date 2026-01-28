export type RateLimitResult = {
  allowed: boolean
  remaining: number
  resetAt: number
}

type Entry = {
  count: number
  resetAt: number
}

function getStore(): Map<string, Entry> {
  const g = globalThis as unknown as { __rl_store__?: Map<string, Entry> }
  if (!g.__rl_store__) g.__rl_store__ = new Map<string, Entry>()
  return g.__rl_store__
}

export function rateLimit(params: {
  key: string
  limit: number
  windowMs: number
  nowMs?: number
}): RateLimitResult {
  const store = getStore()
  const now = params.nowMs ?? Date.now()

  const current = store.get(params.key)
  if (!current || now >= current.resetAt) {
    const resetAt = now + params.windowMs
    store.set(params.key, { count: 1, resetAt })
    return { allowed: true, remaining: Math.max(0, params.limit - 1), resetAt }
  }

  if (current.count >= params.limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  store.set(params.key, current)
  return { allowed: true, remaining: Math.max(0, params.limit - current.count), resetAt: current.resetAt }
}

export function resetRateLimiterForTests() {
  const g = globalThis as unknown as { __rl_store__?: Map<string, Entry> }
  g.__rl_store__ = new Map<string, Entry>()
}
