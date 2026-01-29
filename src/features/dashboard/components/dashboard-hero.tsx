"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useCreditsStore } from "@/features/credits/credits.store";

export function DashboardHero({ name }: { name: string }) {
  const credits = useCreditsStore((s) => s.credits);
  const level = useCreditsStore((s) => s.level);
  const xp = useCreditsStore((s) => s.xp);
  const xpTotal = useCreditsStore((s) => s.xpTotal);

  const pct = xpTotal > 0 ? Math.min(100, Math.round((xp / xpTotal) * 100)) : 0;

  return (
    <Card className="overflow-hidden border-white/10 bg-black/35 backdrop-blur-xl">
      <CardContent className="relative p-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(124,58,237,0.60),rgba(99,102,241,0.45),rgba(124,58,237,0.50))]" />
        <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,1),rgba(0,0,0,0.55))] bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_40%,rgba(255,255,255,0.10),transparent_50%)]" />

        <div className="relative grid gap-4 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white/85">✨ Welcome!</p>
              <h1 className="mt-1 text-xl font-black text-white sm:text-2xl">
                Hello, <span className="text-white">{name}!</span> 👋
              </h1>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">
                Choose a service and start your experience.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/20 px-3 py-2 text-center shadow-[0_0_22px_rgba(139,92,246,0.18)]">
              <p className="text-[10px] font-semibold text-white/75">
                Lv.{level}
              </p>
              <p className="text-[10px] text-white/55">Level</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] font-semibold text-white/75">Credits</p>
              <p className="mt-1 text-lg font-black text-white">{credits}</p>
              <p className="mt-1 text-[11px] text-white/45">
                Earn credits from purchases and level ups.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-white/75">XP</p>
                <p className="text-[11px] font-semibold text-white/75">
                  {xp}/{xpTotal}
                </p>
              </div>

              <Progress
                value={pct}
                className={[
                  "mt-2 h-2 bg-white/15",
                  "[&>div]:bg-violet-500",
                  "[&>div]:shadow-[0_0_18px_rgba(139,92,246,0.35)]",
                  "[&>div]:transition-all [&>div]:duration-700 [&>div]:ease-out",
                  "[&>div]:rounded-full",
                ].join(" ")}
              />

              <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
                <span>Spend credits to gain XP</span>
                <span>+100 credits on level up</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
