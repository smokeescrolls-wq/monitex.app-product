"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CreditsState = {
  [x: string]: any;
  credits: number;
  spend: (amount: number) => boolean;
  add: (amount: number) => void;
  set: (amount: number) => void;
};

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      credits: 170,
      spend: (amount) => {
        if (amount <= 0) return true;
        const current = get().credits;
        if (current < amount) return false;
        set({ credits: current - amount });
        return true;
      },
      add: (amount) => set({ credits: get().credits + Math.max(0, amount) }),
      set: (amount) => set({ credits: Math.max(0, amount) }),
    }),
    { name: "monitex-credits" }
  )
);
