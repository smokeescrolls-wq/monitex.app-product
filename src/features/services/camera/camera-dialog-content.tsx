"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, Loader2, Trash2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCreditsStore } from "@/features/credits/credits.store";
import { useInvestigationStore } from "@/features/investigation/investigation.store";
import type { ServiceKey } from "@/features/services/services.registry";
import { CAMERA_FLOW } from "@/features/services/camera/camera.flow";

function pct(completed: number, total: number) {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

export default function CameraDialogContent({
  serviceKey,
}: {
  serviceKey: ServiceKey;
}) {
  const credits = useCreditsStore((s) => s.credits);

  const session = useInvestigationStore((s) => s.sessions.camera);
  const start = useInvestigationStore((s) => s.start);
  const accelerate = useInvestigationStore((s) => s.accelerate);
  const cancel = useInvestigationStore((s) => s.cancel);

  const [consent, setConsent] = useState(false);
  const [permissionError, setPermissionError] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const total = CAMERA_FLOW.steps.length;
  const completed = session?.completedSteps ?? 0;
  const progress = pct(completed, total);
  const activeIndex = Math.min(total - 1, completed);
  const isCompleted = session?.status === "completed";

  const canStart = useMemo(
    () => consent && credits >= CAMERA_FLOW.startCost,
    [consent, credits],
  );

  async function startCamera() {
    try {
      setPermissionError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsStreaming(true);
      return true;
    } catch {
      setPermissionError("Permission denied or camera unavailable.");
      return false;
    }
  }

  function stopCamera() {
    const stream = streamRef.current;
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  async function onStart() {
    const ok = await startCamera();
    if (!ok) return;

    start({
      serviceKey: "camera",
      target: "browser-camera",
      steps: [...CAMERA_FLOW.steps],
      startCost: CAMERA_FLOW.startCost,
      initialCompletedSteps: 2,
    });
  }

  function onAccelerate() {
    accelerate({
      serviceKey: "camera",
      costPerStep: CAMERA_FLOW.accelerateCost,
    });
  }

  function onCancel() {
    stopCamera();
    cancel("camera");
  }

  return (
    <div className="space-y-4">
      {!session ? (
        <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-fuchsia-500/10">
                <Camera className="h-5 w-5 text-fuchsia-200" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90">
                  Camera and Gallery Access
                </p>
                <p className="text-xs text-white/55">
                  Browser permission (authorized use)
                </p>
              </div>

              <div className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                Balance: {credits} credits
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-4">
              <p className="text-xs font-semibold text-fuchsia-200">
                How it works
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                The browser will request permission to access this device's
                camera. Progress advances manually via credits.
              </p>
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-3 text-xs text-white/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black/40"
              />
              I confirm that I have authorization to use this device's camera.
            </label>

            {permissionError ? (
              <p className="mt-3 text-xs text-red-300/90">{permissionError}</p>
            ) : null}

            <Button
              onClick={onStart}
              disabled={!canStart}
              className="mt-5 h-12 w-full rounded-2xl bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50"
            >
              Start Access ({CAMERA_FLOW.startCost} credits)
            </Button>

            <p className="mt-3 text-center text-[11px] text-white/45">
              The browser will always show the permission prompt.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-fuchsia-500/10">
                    <Camera className="h-5 w-5 text-fuchsia-200" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      Camera and Gallery Access
                    </p>
                    <p className="text-xs text-white/55">Connecting...</p>
                  </div>
                </div>

                <span className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/12 px-3 py-1 text-[11px] font-semibold text-fuchsia-200">
                  {progress}%
                </span>
              </div>

              <div className="mt-4">
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-[210px] w-full object-cover"
                />
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs text-white/60">
                    {isStreaming ? "Camera active" : "Camera inactive"}
                  </span>
                  <Button
                    variant="secondary"
                    className="h-9 rounded-xl bg-white/10 text-white hover:bg-white/15"
                    onClick={() => (isStreaming ? stopCamera() : startCamera())}
                  >
                    {isStreaming ? "Stop" : "Activate"}
                  </Button>
                </div>
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

              <div className="mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
                <p className="text-xs font-semibold text-white/85">
                  ⏳ Access in progress
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Active monitoring with manual validations.
                  <br />
                  Estimated time: {CAMERA_FLOW.estimateDays} days
                </p>
              </div>

              <Button
                onClick={onCancel}
                variant="destructive"
                className="mt-5 h-12 w-full rounded-2xl"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Investigation
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
                disabled={isCompleted || credits < CAMERA_FLOW.accelerateCost}
                className="mt-3 h-12 w-full rounded-2xl bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50"
              >
                <Zap className="mr-2 h-4 w-4" />
                {credits < CAMERA_FLOW.accelerateCost
                  ? "Insufficient credits"
                  : `Accelerate by ${CAMERA_FLOW.accelerateCost} credits`}
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
