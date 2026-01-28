"use client";

import { useMemo, useState } from "react";
import { Loader2, Phone, Trash2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useCreditsStore } from "@/features/credits/credits.store";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import type { ServiceKey } from "@/features/services/services.registry";
import {
  CALLS_FLOW,
  normalizePhone,
} from "@/features/services/calls/calls.flow";

function pct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export default function CallsDialogContent({
  serviceKey,
}: {
  serviceKey: ServiceKey;
}) {
  const credits = useCreditsStore((s) => s.credits);

  const session = useInvestigationStore((s) => s.sessions.calls);
  const start = useInvestigationStore((s) => s.start);
  const accelerate = useInvestigationStore((s) => s.accelerate);
  const cancel = useInvestigationStore((s) => s.cancel);

  const [raw, setRaw] = useState("");
  const [consent, setConsent] = useState(false);

  const canStart = useMemo(() => {
    const phone = normalizePhone(raw);
    return consent && phone.length >= 12 && credits >= CALLS_FLOW.startCost;
  }, [raw, consent, credits]);

  const total = CALLS_FLOW.steps.length;
  const completed = session?.completedSteps ?? 0;
  const progress = pct(completed, total);
  const activeIndex = Math.min(total - 1, completed);
  const isCompleted = session?.status === "completed";

  function onStart() {
    const phone = normalizePhone(raw);
    start({
      serviceKey: "calls",
      target: phone,
      steps: [...CALLS_FLOW.steps],
      startCost: CALLS_FLOW.startCost,
      initialCompletedSteps: 1,
    });
  }

  function onAccelerate() {
    accelerate({ serviceKey: "calls", costPerStep: CALLS_FLOW.accelerateCost });
  }

  function onCancel() {
    cancel("calls");
  }

  return (
    <div className="space-y-4">
      {!session ? (
        <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-emerald-500/10">
                <Phone className="h-5 w-5 text-emerald-200" />
              </div>

              <div className="min-w-0">
                <p className="text-base font-semibold text-white/90">
                  Call History
                </p>
                <p className="text-sm text-white/60">
                  View exported/authorized records
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-white/85">
                Phone number
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-black/35 px-3 py-2">
                <span className="text-xs text-white/55">+55</span>
                <Input
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  placeholder="(47) 99999-9999"
                  className="h-10 flex-1 border-0 bg-transparent p-0 text-white placeholder:text-white/35 focus-visible:ring-0"
                />
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3 text-xs text-white/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black/40"
              />
              I confirm that the log/history is mine or I have explicit
              authorization for analysis.
            </label>

            <Button
              onClick={onStart}
              disabled={!canStart}
              className="mt-4 h-12 w-full rounded-2xl bg-violet-600/70 hover:bg-violet-600 disabled:opacity-50"
            >
              Start Investigation for {CALLS_FLOW.startCost} Credits
            </Button>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-[11px] font-semibold text-emerald-200">
                  HISTORY
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Received and made calls.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-[11px] font-semibold text-emerald-200">
                  DURATION
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Exact time of each call.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-[11px] font-semibold text-emerald-200">
                  CONTACTS
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Most contacted numbers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-emerald-500/10">
                    <Phone className="h-5 w-5 text-emerald-200" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      Analyzing Calls
                    </p>
                    <p className="text-xs text-white/55">+{session.target}</p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/12 px-3 py-1 text-[11px] font-semibold text-emerald-200">
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
                          : "border-white/10 bg-black/25 text-white/35",
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

              <Button
                onClick={onCancel}
                variant="destructive"
                className="mt-5 h-12 w-full rounded-2xl"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/25 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-xs text-white/60 text-center">
                The analysis is taking a while...
              </p>
              <Button
                onClick={onAccelerate}
                disabled={isCompleted || credits < CALLS_FLOW.accelerateCost}
                className="mt-3 h-12 w-full rounded-2xl bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50"
              >
                <Zap className="mr-2 h-4 w-4" />
                {credits < CALLS_FLOW.accelerateCost
                  ? "Insufficient credits"
                  : `Accelerate by ${CALLS_FLOW.accelerateCost} credits`}
              </Button>

              <p className="mt-2 text-center text-[11px] text-white/45">
                Current balance:{" "}
                <span className="text-white/70">{credits}</span> credits
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
