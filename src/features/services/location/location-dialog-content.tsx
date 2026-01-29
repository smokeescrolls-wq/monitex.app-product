"use client";

import { useMemo, useState } from "react";
import { MapPin, Loader2, Zap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCreditsStore } from "@/features/credits/credits.store";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import { LOCATION_FLOW } from "@/features/services/location/location.flow";
import type { ServiceKey } from "@/features/services/services.registry";

function pct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function makeInviteToken() {
  const a = Math.random().toString(16).slice(2);
  const b = Math.random().toString(16).slice(2);
  return `share_${a}${b}`.slice(0, 24);
}

function LocationIconGlow() {
  return (
    <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-orange-500/12">
      <div className="absolute inset-0 rounded-2xl shadow-[0_0_22px_rgba(251,146,60,0.22)]" />
      <MapPin className="relative h-5 w-5 text-orange-200" />
    </div>
  );
}

export default function LocationDialogContent({
  serviceKey,
}: {
  serviceKey: ServiceKey;
}) {
  const credits = useCreditsStore((s) => s.credits);

  const session = useInvestigationStore((s) => s.sessions.location);
  const start = useInvestigationStore((s) => s.start);
  const accelerate = useInvestigationStore((s) => s.accelerate);
  const cancel = useInvestigationStore((s) => s.cancel);

  const [consent, setConsent] = useState(false);
  const [invite, setInvite] = useState<string>("");

  const canStart = useMemo(
    () => consent && credits >= LOCATION_FLOW.startCost,
    [consent, credits],
  );

  const total = LOCATION_FLOW.steps.length;
  const completed = session?.completedSteps ?? 0;
  const progress = pct(completed, total);
  const activeIndex = Math.min(total - 1, completed);
  const isCompleted = session?.status === "completed";

  function onStart() {
    const token = invite || makeInviteToken();
    setInvite(token);

    start({
      serviceKey: "location",
      target: token,
      steps: [...LOCATION_FLOW.steps],
      startCost: LOCATION_FLOW.startCost,
      initialCompletedSteps: 1,
    });
  }

  function onAccelerate() {
    accelerate({
      serviceKey: "location",
      costPerStep: LOCATION_FLOW.accelerateCost,
    });
  }

  function onCancel() {
    cancel("location");
  }

  return (
    <div className="space-y-4">
      {!session ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_22px_rgba(251,146,60,0.10)]">
            <LocationIconGlow />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90">Location</p>
              <p className="text-xs text-white/55">
                Consent-based tracking (simulation)
              </p>
            </div>

            <div className="ml-auto rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/70">
              Balance: {credits} credits
            </div>
          </div>

          <div className="rounded-2xl border border-orange-500/25 bg-orange-500/10 p-4">
            <div className="space-y-3 text-xs text-white/75">
              <div className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-300/80" />
                <div>
                  <p className="font-semibold text-orange-200">How it works</p>
                  <p className="mt-1">
                    You generate an invitation link/token and the contact
                    voluntarily shares their location. The dashboard shows
                    patterns and reports.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-orange-300/80" />
                <div>
                  <p className="font-semibold text-orange-200">Privacy</p>
                  <p className="mt-1">
                    This flow only runs with explicit authorization. Without
                    consent, it will not start.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/70">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/40"
            />
            I confirm I have explicit consent from the contact/device for
            location sharing.
          </label>

          <Button
            onClick={onStart}
            disabled={!canStart}
            className="h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {credits < LOCATION_FLOW.startCost
              ? "Not enough credits"
              : "Start tracking"}
          </Button>

          <p className="text-center text-[11px] text-white/45">
            Balance: <span className="text-white/70">{credits}</span> credits ·
            Start: {LOCATION_FLOW.startCost} credits
          </p>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_22px_rgba(251,146,60,0.10)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <LocationIconGlow />
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    Tracking in progress
                  </p>
                  <p className="text-xs text-white/55">
                    Invite: {session.target}
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-orange-500/20 bg-orange-500/12 px-3 py-1 text-[11px] font-semibold text-orange-200">
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

            <div className="mt-5 rounded-2xl border border-orange-500/15 bg-orange-500/10 p-4">
              <p className="text-xs font-semibold text-orange-200">
                🏆 Tracking in progress
              </p>
              <p className="mt-1 text-xs text-white/70">
                Active monitoring with validations.
                <br />
                Estimated time: {LOCATION_FLOW.estimateDays} days
              </p>
            </div>

            <Button
              onClick={onCancel}
              variant="destructive"
              className="mt-5 h-12 w-full rounded-2xl"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/60 text-center">
              This is taking longer than expected...
            </p>

            <Button
              onClick={onAccelerate}
              disabled={isCompleted || credits < LOCATION_FLOW.accelerateCost}
              className="mt-3 h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
            >
              <Zap className="mr-2 h-4 w-4" />
              {credits < LOCATION_FLOW.accelerateCost
                ? "Not enough credits"
                : `Accelerate for ${LOCATION_FLOW.accelerateCost} credits`}
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
