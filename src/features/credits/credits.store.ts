"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LevelUpEvent = {
  newLevel: number;
  levelsGained: number;
  creditsAwarded: number;
  balanceBefore: number;
  balanceAfter: number;
  at: number;
};

type CreditsState = {
  credits: number;
  level: number;
  xp: number;
  xpTotal: number;
  lastLevelUp: LevelUpEvent | null;

  spend: (amount: number) => boolean;
  add: (amount: number) => void;
  set: (amount: number) => void;
  reset: () => void;

  ackLevelUp: () => void;
};

function xpForLevel(level: number) {
  return Math.max(50, 100 * level);
}

const LEVEL_REWARD_CREDITS = 50;

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      credits: 0,
      level: 1,
      xp: 0,
      xpTotal: xpForLevel(1),
      lastLevelUp: null,

      spend: (amount) => {
        if (amount <= 0) return true;

        const s = get();
        if (s.credits < amount) return false;

        const balanceBefore = s.credits;

        let nextCredits = s.credits - amount;
        let nextLevel = s.level;
        let nextXp = s.xp + Math.max(0, Math.floor(amount));
        let nextXpTotal = s.xpTotal || xpForLevel(nextLevel);

        let levelsGained = 0;

        while (nextXp >= nextXpTotal) {
          nextXp -= nextXpTotal;
          nextLevel += 1;
          nextCredits += LEVEL_REWARD_CREDITS;
          nextXpTotal = xpForLevel(nextLevel);
          levelsGained += 1;
        }

        const creditsAwarded = levelsGained * LEVEL_REWARD_CREDITS;

        set({
          credits: nextCredits,
          level: nextLevel,
          xp: nextXp,
          xpTotal: nextXpTotal,
          lastLevelUp:
            levelsGained > 0
              ? {
                  newLevel: nextLevel,
                  levelsGained,
                  creditsAwarded,
                  balanceBefore,
                  balanceAfter: nextCredits,
                  at: Date.now(),
                }
              : s.lastLevelUp,
        });

        return true;
      },

      add: (amount) => set({ credits: get().credits + Math.max(0, amount) }),
      set: (amount) => set({ credits: Math.max(0, amount) }),

      reset: () =>
        set({
          credits: 0,
          level: 1,
          xp: 0,
          xpTotal: xpForLevel(1),
          lastLevelUp: null,
        }),

      ackLevelUp: () => set({ lastLevelUp: null }),
    }),
    {
      name: "monitex-economy-v1",
      onRehydrateStorage: () => (state) => {
        const raw = process.env.NEXT_PUBLIC_DEV_START_CREDITS ?? "";
        const seed = Number(raw);
        if (!state) return;
        if (!Number.isFinite(seed) || seed <= 0) return;
        if (state.credits > 0) return;
        state.set(seed);
      },
    }
  )
);
