"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Bolt } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreditsStore } from "@/features/credits/credits.store";

export function LevelUpModal() {
  const evt = useCreditsStore((s) => s.lastLevelUp);
  const ack = useCreditsStore((s) => s.ackLevelUp);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (evt) setOpen(true);
  }, [evt?.at]);

  const title = useMemo(() => {
    if (!evt) return "Level up!";
    return `Level ${evt.newLevel} reached!`;
  }, [evt]);

  const subtitle = useMemo(() => {
    if (!evt) return "";
    return `Bonus: +${evt.creditsAwarded} credits`;
  }, [evt]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) ack();
      }}
    >
      <DialogContent className="max-w-[420px] border-white/10 bg-[#0b0b10] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white/90">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-violet-500/10 shadow-[0_0_22px_rgba(139,92,246,0.22)]">
              <Sparkles className="h-4 w-4 text-violet-200" />
            </span>
            Level up!
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-semibold text-white/90">{title}</p>
          <p className="mt-1 text-sm text-white/65">{subtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
              <Bolt className="h-4 w-4" />+{evt?.creditsAwarded ?? 0} credits
            </span>

            {evt ? (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
                Balance: {evt.balanceBefore} → {evt.balanceAfter}
              </span>
            ) : null}
          </div>
        </div>

        <Button
          className="mt-4 h-11 w-full rounded-2xl bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_22px_rgba(139,92,246,0.22)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)]"
          onClick={() => {
            setOpen(false);
            ack();
          }}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
