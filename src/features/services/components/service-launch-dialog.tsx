"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceConfig } from "../services.types";
import { useCreditsStore } from "@/features/credits/credits.store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreditsActionsLike = {
  spendCredits?: (amount: number) => boolean | { ok: boolean };
  consumeCredits?: (amount: number) => boolean | { ok: boolean };
  decrementCredits?: (amount: number) => boolean | { ok: boolean };
  useCredits?: (amount: number) => boolean | { ok: boolean };
};

function toOk(v: unknown) {
  if (typeof v === "boolean") return v;
  if (v && typeof v === "object" && "ok" in (v as any))
    return Boolean((v as any).ok);
  return false;
}

export function ServiceLaunchDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: ServiceConfig;
}) {
  const router = useRouter();
  const credits = useCreditsStore((s) => s.credits);

  const actions = useCreditsStore((s) => s as unknown as CreditsActionsLike);

  const [target, setTarget] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [opts, setOpts] = useState<Record<string, string>>({});

  const canStart = useMemo(() => {
    if (service.startCostCredits === 0) return true;
    return credits >= service.startCostCredits;
  }, [credits, service.startCostCredits]);

  function debitIfPossible(amount: number) {
    const fn =
      actions.spendCredits ??
      actions.consumeCredits ??
      actions.decrementCredits ??
      actions.useCredits;

    if (!fn) return { ok: true, debited: false };

    const r = fn(amount);
    return { ok: toOk(r), debited: true };
  }

  function start() {
    setErr(null);

    const parsed = service.target.schema.safeParse(target);
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? "Valor inválido.");
      return;
    }

    if (service.startCostCredits > 0) {
      if (credits < service.startCostCredits) {
        setErr("Créditos insuficientes para iniciar.");
        return;
      }

      const { ok } = debitIfPossible(service.startCostCredits);
      if (!ok) {
        setErr("Créditos insuficientes para iniciar.");
        return;
      }
    }

    const qp = new URLSearchParams();
    qp.set("service", service.key);
    qp.set("target", parsed.data);
    Object.entries(opts).forEach(([k, v]) => qp.set(k, v));

    onOpenChange(false);
    router.push(`/run?${qp.toString()}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] border-white/10 bg-[#0b0b0f] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{service.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white/85">
              Configurar simulação
            </div>

            <div className="mt-3 grid gap-2">
              <Label className="text-xs text-white/70">
                {service.target.label}
              </Label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45">
                  @
                </span>
                <Input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={service.target.placeholder}
                  className="h-11 border-white/10 bg-white/5 pl-8 text-white placeholder:text-white/35"
                />
              </div>

              {err ? <p className="text-xs text-red-400">{err}</p> : null}
            </div>

            {service.options?.length ? (
              <div className="mt-4 grid gap-3">
                {service.options.map((o) => (
                  <div key={o.id} className="grid gap-2">
                    <Label className="text-xs text-white/70">{o.label}</Label>

                    <div className="flex flex-wrap gap-2">
                      {o.values.map((v) => {
                        const active = opts[o.id] === v.value;
                        return (
                          <button
                            key={v.value}
                            type="button"
                            onClick={() =>
                              setOpts((s) => ({ ...s, [o.id]: v.value }))
                            }
                            className={[
                              "rounded-full border px-3 py-1 text-[11px] font-semibold transition",
                              active
                                ? "border-violet-500/30 bg-violet-500/15 text-violet-200"
                                : "border-white/10 bg-white/5 text-white/70 hover:border-white/15",
                            ].join(" ")}
                          >
                            {v.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-white/55">
              Créditos:{" "}
              <span className="font-bold text-white/80">{credits}</span>
              {" • "}
              Iniciar:{" "}
              <span className="font-bold text-white/80">
                {service.startCostCredits === 0
                  ? "Grátis"
                  : `${service.startCostCredits}`}
              </span>
            </div>

            <Button
              onClick={start}
              disabled={!canStart}
              className="h-11 rounded-xl bg-linear-to-r from-violet-600 to-indigo-500 font-bold shadow-[0_18px_60px_rgba(124,58,237,0.35)]"
            >
              Buscar
            </Button>
          </div>

          {!canStart ? (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
              Créditos insuficientes para iniciar este serviço.
            </div>
          ) : null}

          <div className="text-[11px] text-white/45">
            Simulação para fins de entretenimento. Nenhum dado real é acessado.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
