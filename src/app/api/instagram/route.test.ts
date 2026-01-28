import { beforeEach, describe, expect, it, vi } from 'vitest'

import { resetRateLimiterForTests } from '@/features/security/modules/rate-limit.modules'
import { GET } from './route'

const profilePayload = {
  data: {
    profileDetails: {
      isPrivate: false,
      isVerified: false,
      fullName: 'John',
      username: 'john',
      biography: 'bio',
      followersCount: 1,
      followsCount: 2,
      postsCount: 3,
      pictureUrl: 'https://example.com/a.jpg'
    }
  }
}

describe('GET /api/instagram', () => {
  beforeEach(() => {
    resetRateLimiterForTests()
    vi.restoreAllMocks()
  })

  it('returns 400 for invalid username', async () => {
    const req = new Request('http://localhost/api/instagram?username=john-doe')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('returns profile payload on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(profilePayload), { status: 200, headers: { 'content-type': 'application/json' } }))
    )

    const req = new Request('http://localhost/api/instagram?username=john')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.profileDetails.username).toBe('john')
  })

  it('rate limits after the configured threshold', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify(profilePayload), { status: 200, headers: { 'content-type': 'application/json' } }))
    )

    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(0)
    const headers = new Headers({ 'x-forwarded-for': '1.2.3.4' })

    for (let i = 0; i < 20; i++) {
      const req = new Request('http://localhost/api/instagram?username=john', { headers })
      const res = await GET(req)
      expect(res.status).toBe(200)
    }

    const blockedReq = new Request('http://localhost/api/instagram?username=john', { headers })
    const blockedRes = await GET(blockedReq)
    expect(blockedRes.status).toBe(429)

    nowSpy.mockRestore()
  })
})
