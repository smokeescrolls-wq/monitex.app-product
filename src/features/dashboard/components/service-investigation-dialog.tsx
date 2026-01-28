"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICE_INVESTIGATION } from "@/features/services/service-investigation.config";
import { useCreditsStore } from "@/features/credits/credits.store";

export function ServiceInvestigationDialog({
  serviceKey,
  children,
}: {
  serviceKey: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const spend = useCreditsStore((s) => s.spend);
  const credits = useCreditsStore((s) => s.credits);

  const cfg = useMemo(() => SERVICE_INVESTIGATION[serviceKey], [serviceKey]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) setValue("");
  }, [open]);

  const costLabel =
    cfg.costCredits <= 0
      ? "Iniciar Investigação"
      : `Iniciar Investigação por ${cfg.costCredits} Créditos`;

  const canStart = value.trim().length > 0 && credits >= cfg.costCredits;

  function start() {
    const ok = spend(cfg.costCredits);
    if (!ok) return;
    setOpen(false);
    const target = encodeURIComponent(value.trim());
    router.push(`/dashboard/investigation/${cfg.key}?target=${target}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-[560px] border-white/10 bg-[#0b0b10] p-0 text-white">
        <div className="p-5 sm:p-6">
          <DialogTitle className="text-sm font-semibold text-white/90">
            {cfg.title}
          </DialogTitle>

          <div className="mt-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
            <p className="text-xs font-semibold text-sky-200">
              {cfg.howItWorksTitle}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/75">
              {cfg.howItWorksBody}
            </p>
          </div>

          <div className="mt-4">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={cfg.placeholder}
              className="h-11 rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/35"
            />
          </div>

          <Button
            onClick={start}
            disabled={!canStart}
            className="mt-4 h-11 w-full rounded-2xl bg-white/10 text-white hover:bg-white/15 disabled:opacity-50"
          >
            {credits < cfg.costCredits ? "Créditos insuficientes" : costLabel}
          </Button>

          <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-4">
            <p className="text-xs font-semibold text-emerald-200">
              {cfg.examplesTitle}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-emerald-100/80">
              {cfg.examples.map((ex) => (
                <li key={ex}>• {ex}</li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-white/45">
            Use somente dados públicos/autorizados. Esta interface simula o
            fluxo de análise.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
