"use client";

import { useMemo, useState } from "react";
import { MessageSquareText, Loader2, Zap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useCreditsStore } from "@/features/credits/credits.store";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import type { ServiceKey } from "@/features/services/services.registry";
import { SMS_FLOW, normalizePhone } from "@/features/services/sms/sms.flow";

function pct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function SmsIconGlow() {
  return (
    <div className="relative grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-yellow-500/12">
      <div className="absolute inset-0 rounded-2xl shadow-[0_0_22px_rgba(250,204,21,0.22)]" />
      <MessageSquareText className="relative h-5 w-5 text-yellow-200" />
    </div>
  );
}

export default function SmsDialogContent({
  serviceKey,
}: {
  serviceKey: ServiceKey;
}) {
  const credits = useCreditsStore((s) => s.credits);

  const session = useInvestigationStore((s) => s.sessions.sms);
  const start = useInvestigationStore((s) => s.start);
  const accelerate = useInvestigationStore((s) => s.accelerate);
  const cancel = useInvestigationStore((s) => s.cancel);

  const [raw, setRaw] = useState("");
  const [consent, setConsent] = useState(false);

  const canStart = useMemo(() => {
    const phone = normalizePhone(raw);
    return consent && phone.length >= 12 && credits >= SMS_FLOW.startCost;
  }, [raw, consent, credits]);

  const total = SMS_FLOW.steps.length;
  const completed = session?.completedSteps ?? 0;
  const progress = pct(completed, total);
  const activeIndex = Math.min(total - 1, completed);
  const isCompleted = session?.status === "completed";

  function onStart() {
    const phone = normalizePhone(raw);
    start({
      serviceKey: "sms",
      target: phone,
      steps: [...SMS_FLOW.steps],
      startCost: SMS_FLOW.startCost,
      initialCompletedSteps: 1,
    });
  }

  function onAccelerate() {
    accelerate({ serviceKey: "sms", costPerStep: SMS_FLOW.accelerateCost });
  }

  function onCancel() {
    cancel("sms");
  }

  return (
    <div className="space-y-4">
      {!session ? (
        <>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_0_22px_rgba(250,204,21,0.10)]">
            <SmsIconGlow />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90">SMS</p>
              <p className="text-xs text-white/55">
                Analyze exported/authorized messages (simulation)
              </p>
            </div>

            <div className="ml-auto rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/70">
              Balance: {credits} credits
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
            <p className="text-xs font-semibold text-yellow-200">
              Tip: Enter the number with the country code and area code.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/85">Phone number</p>
            <Input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="+1 202 555 0199"
              className="h-12 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-xs text-white/70">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-black/40"
            />
            I confirm the backup is mine or I have explicit authorization for
            analysis.
          </label>

          <Button
            onClick={onStart}
            disabled={!canStart}
            className="h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
          >
            {credits < SMS_FLOW.startCost
              ? "Not enough credits"
              : "Start investigation"}
          </Button>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-xs font-semibold text-yellow-200">MESSAGES</p>
              <p className="mt-1 text-xs text-white/70">
                Exported/authorized history from the device.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-xs font-semibold text-yellow-200">CODES</p>
              <p className="mt-1 text-xs text-white/70">
                Verification codes received on your number.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-white/45">
            Use public/authorized data only. This is a credit-controlled
            simulation interface.
          </p>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_22px_rgba(250,204,21,0.10)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <SmsIconGlow />

                <div>
                  <p className="text-sm font-semibold text-white/90">
                    SMS investigation
                  </p>
                  <p className="text-xs text-white/55">+{session.target}</p>
                </div>
              </div>

              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/12 px-3 py-1 text-[11px] font-semibold text-yellow-200">
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
              disabled={isCompleted || credits < SMS_FLOW.accelerateCost}
              className="mt-3 h-12 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] disabled:opacity-50"
            >
              <Zap className="mr-2 h-4 w-4" />
              {credits < SMS_FLOW.accelerateCost
                ? "Not enough credits"
                : `Accelerate for ${SMS_FLOW.accelerateCost} credits`}
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
