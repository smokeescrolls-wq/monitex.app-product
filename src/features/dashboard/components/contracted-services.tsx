"use client";

import { useMemo } from "react";
import { Flame, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ServiceDialogHost } from "@/features/services/service-dialog-host";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import { SERVICES } from "@/features/services/services.constants";
import type { ServiceKey } from "@/features/services/services.registry";

function getServiceConfig(key: ServiceKey) {
  return SERVICES.find((s) => s.key === key) ?? null;
}

function percent(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function glowClassByService(key: ServiceKey) {
  switch (key) {
    case "instagram":
      return "shadow-[0_0_26px_rgba(236,72,153,0.22)]";
    case "whatsapp":
      return "shadow-[0_0_26px_rgba(16,185,129,0.22)]";
    case "facebook":
      return "shadow-[0_0_26px_rgba(56,189,248,0.22)]";
    case "location":
      return "shadow-[0_0_26px_rgba(251,146,60,0.22)]";
    case "sms":
      return "shadow-[0_0_26px_rgba(250,204,21,0.20)]";
    case "calls":
      return "shadow-[0_0_26px_rgba(34,197,94,0.18)]";
    case "camera":
      return "shadow-[0_0_26px_rgba(217,70,239,0.22)]";
    default:
      return "shadow-[0_0_26px_rgba(244,63,94,0.18)]";
  }
}

export function ContractedServices() {
  const sessions = useInvestigationStore((s) => s.sessions);
  const items = useMemo(() => Object.values(sessions ?? {}), [sessions]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-violet-300" />
        <h2 className="text-sm font-semibold text-white/85">Active services</h2>
      </div>

      {items.length === 0 ? (
        <Card className="border-white/10 bg-black/25 backdrop-blur-xl">
          <CardContent className="p-5 text-center">
            <p className="text-xs text-white/60">
              No active services yet. Start one below.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {items.map((session) => {
            const cfg = getServiceConfig(session.serviceKey);
            const total = session.steps.length;
            const done = session.completedSteps;
            const prog = percent(done, total);
            const isCompleted = session.status === "completed";
            const isRunning = !isCompleted;

            const progressClass = [
              "h-2 bg-white/10",
              "[&>div]:bg-violet-500",
              "[&>div]:shadow-[0_0_18px_rgba(139,92,246,0.35)]",
              "[&>div]:transition-all [&>div]:duration-700 [&>div]:ease-out",
              isRunning ? "[&>div]:animate-pulse" : "",
            ].join(" ");

            return (
              <ServiceDialogHost
                key={session.serviceKey}
                serviceKey={session.serviceKey}
              >
                <button type="button" className="w-full text-left">
                  <Card className="cursor-pointer border-white/10 bg-black/35 backdrop-blur-xl transition-all duration-200 hover:-translate-y-[2px] hover:border-violet-400/25 hover:bg-black/40 hover:shadow-[0_18px_55px_rgba(0,0,0,0.55),0_0_28px_rgba(139,92,246,0.22)] hover:ring-1 hover:ring-violet-500/25">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "relative grid h-11 w-11 place-items-center rounded-2xl border border-white/10",
                              cfg?.accent.iconBg ?? "bg-white/5",
                              cfg?.accent.iconFg ?? "text-white/80",
                              glowClassByService(session.serviceKey),
                            ].join(" ")}
                          >
                            <div className="absolute inset-0 rounded-2xl" />
                            {cfg?.icon ?? null}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-white/90">
                                {cfg?.title ?? session.serviceKey}
                              </p>

                              {isRunning ? (
                                <Loader2 className="h-4 w-4 animate-spin text-violet-200" />
                              ) : null}
                            </div>

                            <p className="truncate text-xs text-white/60">
                              {session.target}
                            </p>
                          </div>
                        </div>

                        {isCompleted ? (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/12 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                            Completed
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80">
                            {prog}%
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <Progress value={prog} className={progressClass} />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
                        <span>Click to open and continue the flow.</span>
                        <span>
                          Step {Math.min(done + 1, total)} / {total}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </ServiceDialogHost>
            );
          })}
        </div>
      )}
    </div>
  );
}
