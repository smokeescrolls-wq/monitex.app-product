import { beforeEach, describe, expect, it } from 'vitest'

import { rateLimit, resetRateLimiterForTests } from './rate-limit.modules'

describe('rateLimit', () => {
  beforeEach(() => {
    resetRateLimiterForTests()
  })

  it('allows requests under the limit within the window', () => {
    const key = 'k'
    const windowMs = 1000
    expect(rateLimit({ key, limit: 2, windowMs, nowMs: 0 }).allowed).toBe(true)
    expect(rateLimit({ key, limit: 2, windowMs, nowMs: 10 }).allowed).toBe(true)
  })

  it('blocks requests over the limit within the window', () => {
    const key = 'k'
    const windowMs = 1000
    rateLimit({ key, limit: 2, windowMs, nowMs: 0 })
    rateLimit({ key, limit: 2, windowMs, nowMs: 10 })
    const blocked = rateLimit({ key, limit: 2, windowMs, nowMs: 20 })
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('resets after window', () => {
    const key = 'k'
    const windowMs = 1000
    rateLimit({ key, limit: 1, windowMs, nowMs: 0 })
    expect(rateLimit({ key, limit: 1, windowMs, nowMs: 500 }).allowed).toBe(false)
    expect(rateLimit({ key, limit: 1, windowMs, nowMs: 1000 }).allowed).toBe(true)
  })
})
