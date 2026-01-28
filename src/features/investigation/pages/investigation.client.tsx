"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SERVICE_INVESTIGATION } from "@/features/services/service-investigation.config";
import { useCreditsStore } from "@/features/credits/credits.store";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function InvestigationClient({
  serviceKey,
  target,
}: {
  serviceKey: string;
  target: string;
}) {
  const router = useRouter();
  const cfg = useMemo(
    () => SERVICE_INVESTIGATION[serviceKey] ?? SERVICE_INVESTIGATION.instagram,
    [serviceKey],
  );

  const credits = useCreditsStore((s) => s.credits);
  const spend = useCreditsStore((s) => s.spend);

  const [progress, setProgress] = useState(2);

  const stepIndex = useMemo(() => {
    const per = 100 / cfg.steps.length;
    return clamp(Math.floor(progress / per), 0, cfg.steps.length - 1);
  }, [progress, cfg.steps.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        const bump = 0.6 + Math.random() * 1.2;
        return clamp(p + bump, 0, 100);
      });
    }, 900);

    return () => window.clearInterval(id);
  }, []);

  const pct = Math.round(progress);

  function cancel() {
    router.push("/dashboard");
  }

  function accelerate() {
    const ok = spend(30);
    if (!ok) return;
    setProgress((p) => clamp(p + (8 + Math.random() * 12), 0, 100));
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-4 py-6 sm:px-6">
      <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/90">{cfg.title}</p>
              <p className="mt-1 text-xs text-white/55">{target}</p>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/12 px-2 py-1 text-[11px] font-semibold text-emerald-200">
              {pct}%
            </span>
          </div>

          <div className="mt-4">
            <Progress value={pct} className="h-2 bg-white/10" />
          </div>

          <div className="mt-5 space-y-2">
            {cfg.steps.map((label, idx) => {
              const done = idx < stepIndex || pct >= 100;
              const active = idx === stepIndex && pct < 100;

              return (
                <div
                  key={label}
                  className={[
                    "flex items-center gap-3 rounded-2xl border px-4 py-3",
                    done
                      ? "border-white/10 bg-white/5 text-white/70"
                      : "border-white/10 bg-black/25 text-white/35",
                    active ? "ring-1 ring-violet-500/30" : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      done
                        ? "bg-emerald-300/80"
                        : active
                          ? "bg-violet-300/80"
                          : "bg-white/20",
                    ].join(" ")}
                  />
                  <span className="text-xs">{label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
            <p className="text-xs font-semibold text-emerald-200">
              Investigação em andamento
            </p>
            <p className="mt-1 text-xs text-white/70">
              Monitoramento ativo com validações. Tempo estimado: 5 dias
            </p>
          </div>

          <Button
            onClick={cancel}
            variant="destructive"
            className="mt-5 h-11 w-full rounded-2xl"
          >
            Cancelar Investigação
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4 border-white/10 bg-black/25 backdrop-blur-xl">
        <CardContent className="p-4">
          <p className="text-xs text-white/60 text-center">
            A análise está demorando...
          </p>
          <Button
            onClick={accelerate}
            disabled={credits < 30 || pct >= 100}
            className="mt-3 h-11 w-full rounded-2xl bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50"
          >
            {credits < 30
              ? "Créditos insuficientes"
              : "Acelerar por 30 créditos"}
          </Button>
          <p className="mt-2 text-center text-[11px] text-white/45">
            Créditos atuais: <span className="text-white/70">{credits}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
