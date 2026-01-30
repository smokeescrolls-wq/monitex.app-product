"use client";

import { useMemo, useState } from "react";
import { Instagram, Loader2, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IG_FLOW,
  normalizeInstagramTarget,
} from "@/features/services/instagram/instagram.flow";
import { useCreditsStore } from "@/features/credits/credits.store";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import type { ServiceKey } from "@/features/services/services.registry";

function pct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function InstagramIconGlow() {
  return (
    <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/25 via-fuchsia-500/15 to-orange-500/10">
      <div className="absolute inset-0 rounded-2xl shadow-[0_0_24px_rgba(236,72,153,0.20)]" />
      <Instagram className="relative h-5 w-5 text-pink-100" />
    </div>
  );
}

export default function InstagramDialogContent({
  serviceKey,
}: {
  serviceKey: ServiceKey;
}) {
  const credits = useCreditsStore((s) => s.credits);

  const session = useInvestigationStore((s) => s.sessions.instagram);
  const start = useInvestigationStore((s) => s.start);
  const accelerate = useInvestigationStore((s) => s.accelerate);
  const cancel = useInvestigationStore((s) => s.cancel);

  const [rawTarget, setRawTarget] = useState("");

  const canStart = useMemo(() => {
    const target = normalizeInstagramTarget(rawTarget);
    return target.length > 0 && credits >= IG_FLOW.startCost;
  }, [rawTarget, credits]);

  const total = IG_FLOW.steps.length;
  const completed = session?.completedSteps ?? 0;
  const progress = pct(completed, total);
  const activeIndex = Math.min(total - 1, completed);
  const isCompleted = session?.status === "completed";

  function onStart() {
    const target = normalizeInstagramTarget(rawTarget);
    const res = start({
      serviceKey: "instagram",
      target,
      steps: [...IG_FLOW.steps],
      startCost: IG_FLOW.startCost,
      initialCompletedSteps: 1,
    });
    if (!res.ok) return;
  }

  function onAccelerate() {
    accelerate({
      serviceKey: "instagram",
      costPerStep: IG_FLOW.accelerateCost,
    });
  }

  return (
    <div className="space-y-4">
      {!session ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_28px_rgba(139,92,246,0.12)]">
            <InstagramIconGlow />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90">Instagram</p>
              <p className="text-xs text-white/55">
                Profile analysis (controlled simulation)
              </p>
            </div>

            <div className="ml-auto rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/70">
              Balance: {credits} credits
            </div>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
            <p className="text-xs font-semibold text-violet-200">
              How it works
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/70">
              Enter a username to start the flow. Progress is advanced manually
              using credits.
            </p>
          </div>

          <Input
            value={rawTarget}
            onChange={(e) => setRawTarget(e.target.value)}
            placeholder={IG_FLOW.placeholder}
            className="h-11 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
          />

          <Button
            onClick={onStart}
            disabled={!canStart}
            className="h-11 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
          >
            {credits < IG_FLOW.startCost
              ? "Not enough credits"
              : `Start for ${IG_FLOW.startCost} credits`}
          </Button>

          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
            <p className="text-xs font-semibold text-emerald-200">
              Valid examples
            </p>
            <ul className="mt-2 space-y-1 text-xs text-emerald-100/80">
              <li>• @username</li>
              <li>• username</li>
              <li>• instagram.com/username</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_28px_rgba(139,92,246,0.12)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <InstagramIconGlow />
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    @{session.target}
                  </p>
                  <p className="text-xs text-white/55">Running analysis...</p>
                </div>
              </div>

              <span className="rounded-full border border-violet-500/20 bg-violet-500/12 px-3 py-1 text-[11px] font-semibold text-violet-200">
                {progress}%
              </span>
            </div>

            <div className="mt-4">
              <Progress value={progress} className="h-2 bg-white/10" />
            </div>

            <div className="mt-5 space-y-2">
              {session.steps.map((label, idx) => {
                const done = idx < session.completedSteps;
                const active = idx === activeIndex && !isCompleted;

                return (
                  <div
                    key={label}
                    className={[
                      "flex items-center gap-3 rounded-2xl border px-4 py-3",
                      done
                        ? "border-violet-500/20 bg-violet-500/10 text-white/80"
                        : "border-white/10 bg-black/25 text-white/55",
                    ].join(" ")}
                  >
                    {active ? (
                      <Loader2 className="h-4 w-4 animate-spin text-violet-200" />
                    ) : (
                      <span
                        className={[
                          "h-2.5 w-2.5 rounded-full",
                          done ? "bg-violet-300/80" : "bg-white/20",
                        ].join(" ")}
                      />
                    )}
                    <span className="text-xs">{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
              <p className="text-xs font-semibold text-white/85">
                ⏳ Analysis in progress
              </p>
              <p className="mt-1 text-xs text-white/70">
                Progress: {progress}% · Estimated time: 5 days
              </p>
            </div>
          </div>

          <Button
            onClick={() => cancel("instagram")}
            variant="destructive"
            className="h-12 w-full rounded-2xl"
          >
            Cancel investigation
          </Button>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/60 text-center">
              This is taking longer than expected...
            </p>

            <Button
              onClick={onAccelerate}
              disabled={isCompleted || credits < IG_FLOW.accelerateCost}
              className="mt-3 h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
            >
              <Zap className="mr-2 h-4 w-4" />
              {credits < IG_FLOW.accelerateCost
                ? "Not enough credits"
                : `Accelerate for ${IG_FLOW.accelerateCost} credits`}
            </Button>

            <p className="mt-2 text-center text-[11px] text-white/45">
              Current balance: <span className="text-white/70">{credits}</span>{" "}
              credits
            </p>
          </div>
        </>
      )}
    </div>
  );
}
