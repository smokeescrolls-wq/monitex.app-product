'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SessionState = {
  searchCount: number
  lastUsername?: string
  accessStartedAt?: number
  accessDurationMs: number
  isVip: boolean
  consumeSearch: (username: string) => void
  startAccess: () => void
  resetSession: () => void
  setVip: (value: boolean) => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      searchCount: 0,
      lastUsername: undefined,
      accessStartedAt: undefined,
      accessDurationMs: 30 * 60 * 1000,
      isVip: false,
      consumeSearch: (username) => {
        const isVip = get().isVip
        set((s) => ({
          searchCount: isVip ? s.searchCount : s.searchCount + 1,
          lastUsername: username
        }))
      },
      startAccess: () => {
        if (get().accessStartedAt) return
        set({ accessStartedAt: Date.now() })
      },
      resetSession: () => set({ searchCount: 0, lastUsername: undefined, accessStartedAt: undefined, isVip: false }),
      setVip: (value) => set({ isVip: value })
    }),
    {
      name: 'monitex-session-v1'
    }
  )
)

const DEV_DISABLE_LIMITS = process.env.NODE_ENV !== 'production'

export function canSearch({
  searchCount,
  isVip
}: {
  searchCount: number
  isVip: boolean
}) {
  if (DEV_DISABLE_LIMITS) return true
  if (isVip) return true
  return searchCount < 1
}


export function getRemainingMs(params: { accessStartedAt?: number; accessDurationMs: number; nowMs?: number }) {
  if (!params.accessStartedAt) return params.accessDurationMs
  const now = params.nowMs ?? Date.now()
  return Math.max(0, params.accessStartedAt + params.accessDurationMs - now)
}
