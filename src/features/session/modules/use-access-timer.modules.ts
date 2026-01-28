'use client'

import { useEffect, useMemo, useState } from 'react'

import { getRemainingMs, useSessionStore } from '@/features/session/session.store'

export function useAccessTimer() {
  const accessStartedAt = useSessionStore((s) => s.accessStartedAt)
  const accessDurationMs = useSessionStore((s) => s.accessDurationMs)

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const remainingMs = useMemo(() => getRemainingMs({ accessStartedAt, accessDurationMs, nowMs: now }), [accessStartedAt, accessDurationMs, now])

  return {
    remainingMs,
    expired: remainingMs <= 0
  }
}
