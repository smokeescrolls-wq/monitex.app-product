"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCreditsStore } from "@/features/credits/credits.store";
import type { ServiceKey } from "@/features/services/services.registry";

type InvestigationStatus = "idle" | "running" | "completed";

export type InvestigationSession = {
  serviceKey: ServiceKey;
  target: string;
  steps: string[];
  completedSteps: number;
  status: InvestigationStatus;
  startedAt: string;
};

type InvestigationState = {
  sessions: Partial<Record<ServiceKey, InvestigationSession>>;
  start: (args: {
    serviceKey: ServiceKey;
    target: string;
    steps: string[];
    startCost: number;
    initialCompletedSteps?: number;
  }) => { ok: boolean; reason?: "insufficient_credits" | "invalid_target" };
  accelerate: (args: {
    serviceKey: ServiceKey;
    costPerStep: number;
  }) => { ok: boolean; reason?: "insufficient_credits" | "no_session" | "already_completed" };
  cancel: (serviceKey: ServiceKey) => void;
};

export const useInvestigationStore = create<InvestigationState>()(
  persist(
    (set, get) => ({
      sessions: {},

      start: ({ serviceKey, target, steps, startCost, initialCompletedSteps }) => {
        const clean = target.trim();
        if (!clean) return { ok: false, reason: "invalid_target" };

        const okSpend = useCreditsStore.getState().spend(startCost);
        if (!okSpend) return { ok: false, reason: "insufficient_credits" };

        const completed = Math.max(0, Math.min(steps.length, initialCompletedSteps ?? 1));

        const session: InvestigationSession = {
          serviceKey,
          target: clean,
          steps,
          completedSteps: completed,
          status: completed >= steps.length ? "completed" : "running",
          startedAt: new Date().toISOString(),
        };

        set((s) => ({ sessions: { ...s.sessions, [serviceKey]: session } }));
        return { ok: true };
      },

      accelerate: ({ serviceKey, costPerStep }) => {
        const session = get().sessions[serviceKey];
        if (!session) return { ok: false, reason: "no_session" };
        if (session.status === "completed") return { ok: false, reason: "already_completed" };

        const okSpend = useCreditsStore.getState().spend(costPerStep);
        if (!okSpend) return { ok: false, reason: "insufficient_credits" };

        const nextCompleted = Math.min(session.steps.length, session.completedSteps + 1);
        const nextStatus: InvestigationStatus = nextCompleted >= session.steps.length ? "completed" : "running";

        set((s) => ({
          sessions: {
            ...s.sessions,
            [serviceKey]: { ...session, completedSteps: nextCompleted, status: nextStatus },
          },
        }));

        return { ok: true };
      },

      cancel: (serviceKey) => {
        set((s) => {
          const copy = { ...s.sessions };
          delete copy[serviceKey];
          return { sessions: copy };
        });
      },
    }),
    { name: "monitex-investigations" }
  )
);
