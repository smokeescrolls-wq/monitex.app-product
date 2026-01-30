"use client";

import { useMemo, useState } from "react";
import { Facebook, Loader2, Trash2, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreditsStore } from "@/features/credits/credits.store";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import type { ServiceKey } from "@/features/services/services.registry";
import {
  FB_FLOW,
  normalizeFacebookUrl,
} from "@/features/services/facebook/facebook.flow";

function pct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function FacebookIconGlow() {
  return (
    <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-sky-500/12">
      <div className="absolute inset-0 rounded-2xl shadow-[0_0_22px_rgba(56,189,248,0.22)]" />
      <Facebook className="relative h-5 w-5 text-sky-200" />
    </div>
  );
}

export default function FacebookDialogContent({
  serviceKey,
}: {
  serviceKey: ServiceKey;
}) {
  const credits = useCreditsStore((s) => s.credits);

  const session = useInvestigationStore((s) => s.sessions.facebook);
  const start = useInvestigationStore((s) => s.start);
  const accelerate = useInvestigationStore((s) => s.accelerate);
  const cancel = useInvestigationStore((s) => s.cancel);

  const [raw, setRaw] = useState("");

  const canStart = useMemo(() => {
    const url = normalizeFacebookUrl(raw);
    return url.length > 0 && credits >= FB_FLOW.startCost;
  }, [raw, credits]);

  const total = FB_FLOW.steps.length;
  const completed = session?.completedSteps ?? 0;
  const progress = pct(completed, total);
  const activeIndex = Math.min(total - 1, completed);
  const isCompleted = session?.status === "completed";

  function onStart() {
    const url = normalizeFacebookUrl(raw);
    const res = start({
      serviceKey: "facebook",
      target: url,
      steps: [...FB_FLOW.steps],
      startCost: FB_FLOW.startCost,
      initialCompletedSteps: 1,
    });
    if (!res.ok) return;
  }

  function onAccelerate() {
    accelerate({ serviceKey: "facebook", costPerStep: FB_FLOW.accelerateCost });
  }

  function onCancel() {
    cancel("facebook");
  }

  return (
    <div className="space-y-4">
      {!session ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_22px_rgba(56,189,248,0.10)]">
            <FacebookIconGlow />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90">Facebook</p>
              <p className="text-xs text-white/55">
                Profile investigation via URL (simulation)
              </p>
            </div>

            <div className="ml-auto rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/70">
              Balance: {credits} credits
            </div>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
            <p className="text-xs font-semibold text-sky-200">How it works</p>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              Paste the full profile URL you want to analyze. This flow
              simulates the collection and processing of public/authorized data
              and generates a report.
            </p>
          </div>

          <Input
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={FB_FLOW.placeholder}
            className="h-11 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
          />

          <Button
            onClick={onStart}
            disabled={!canStart}
            className="h-11 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
          >
            {credits < FB_FLOW.startCost
              ? "Not enough credits"
              : `Start for ${FB_FLOW.startCost} credits`}
          </Button>

          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
            <p className="text-xs font-semibold text-emerald-200">
              Valid examples
            </p>
            <ul className="mt-2 space-y-1 text-xs text-emerald-100/80">
              <li>• https://facebook.com/username</li>
              <li>• https://www.facebook.com/username</li>
              <li>• https://m.facebook.com/username</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_22px_rgba(56,189,248,0.10)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <FacebookIconGlow />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90">
                    Facebook investigation
                  </p>
                  <p className="truncate text-xs text-white/55">
                    {session.target}
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-sky-500/20 bg-sky-500/12 px-3 py-1 text-[11px] font-semibold text-sky-200">
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

            <div className="mt-5 rounded-2xl border border-sky-500/15 bg-sky-500/10 p-4">
              <p className="text-xs font-semibold text-sky-200">
                🏆 Investigation in progress
              </p>
              <p className="mt-1 text-xs text-white/70">
                Active monitoring with manual validations.
                <br />
                Estimated time: {FB_FLOW.estimateDays} days
              </p>
            </div>

            <Button
              onClick={onCancel}
              variant="destructive"
              className="mt-5 h-12 w-full rounded-2xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel investigation
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/60 text-center">
              This is taking longer than expected...
            </p>

            <Button
              onClick={onAccelerate}
              disabled={isCompleted || credits < FB_FLOW.accelerateCost}
              className="mt-3 h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
            >
              <Zap className="mr-2 h-4 w-4" />
              {credits < FB_FLOW.accelerateCost
                ? "Not enough credits"
                : `Accelerate for ${FB_FLOW.accelerateCost} credits`}
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
