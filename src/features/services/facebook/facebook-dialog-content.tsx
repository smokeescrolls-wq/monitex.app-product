"use client";

import { useMemo, useState } from "react";
import { Facebook, Loader2, Trash2, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-sky-500/10">
                <Facebook className="h-5 w-5 text-sky-200" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/90">
                  Investigação de perfil do Facebook
                </p>
                <p className="text-xs text-white/55">
                  Fluxo por URL (simulação)
                </p>
              </div>

              <div className="ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                Saldo: {credits} créditos
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
              <p className="text-xs font-semibold text-sky-200">
                🔎 Como funciona:
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/75">
                Cole a URL completa do perfil que deseja analisar. O fluxo
                simula a coleta e processamento de informações
                públicas/autorizadas e gera um relatório.
              </p>
            </div>

            <div className="mt-4">
              <Input
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                placeholder={FB_FLOW.placeholder}
                className="h-11 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
              />
            </div>

            <Button
              onClick={onStart}
              disabled={!canStart}
              className="mt-4 h-11 w-full rounded-2xl bg-white/10 text-white hover:bg-white/15 disabled:opacity-50"
            >
              {credits < FB_FLOW.startCost
                ? "Créditos insuficientes"
                : `Iniciar Investigação por ${FB_FLOW.startCost} Créditos`}
            </Button>

            <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
              <p className="text-xs font-semibold text-emerald-200">
                ✓ Exemplos válidos:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-emerald-100/80">
                {FB_FLOW.examples.map((ex) => (
                  <li key={ex}>• {ex}</li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-[11px] text-white/45">
              Use apenas dados públicos/autorizados. Interface de simulação
              controlada por créditos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-sky-500/10">
                    <Facebook className="h-5 w-5 text-sky-200" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/90">
                      Investigando Facebook
                    </p>
                    <p className="truncate text-xs text-white/55">
                      {session.target}
                    </p>
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

              <div className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
                <p className="text-xs font-semibold text-emerald-200">
                  🏆 Investigação em andamento
                </p>
                <p className="mt-1 text-xs text-white/70">
                  Monitoramento ativo com validações manuais.
                  <br />
                  Tempo estimado: {FB_FLOW.estimateDays} dias
                </p>
              </div>

              <Button
                onClick={onCancel}
                variant="destructive"
                className="mt-5 h-12 w-full rounded-2xl"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancelar Investigação
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/25 backdrop-blur-xl">
            <CardContent className="p-4">
              <p className="text-xs text-white/60 text-center">
                A análise está demorando...
              </p>

              <Button
                onClick={onAccelerate}
                disabled={isCompleted || credits < FB_FLOW.accelerateCost}
                className="mt-3 h-12 w-full rounded-2xl bg-violet-600/80 hover:bg-violet-600 disabled:opacity-50"
              >
                <Zap className="mr-2 h-4 w-4" />
                {credits < FB_FLOW.accelerateCost
                  ? "Créditos insuficientes"
                  : `Acelerar por ${FB_FLOW.accelerateCost} créditos`}
              </Button>

              <p className="mt-2 text-center text-[11px] text-white/45">
                Saldo atual: <span className="text-white/70">{credits}</span>{" "}
                créditos
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
