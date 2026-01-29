"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Bolt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MatrixCanvas } from "@/components/matrix-canvas";
import { useCreditsStore } from "@/features/credits/credits.store";

const REWARDS = [
  {
    id: "ambassador",
    title: "Ambassador",
    desc: "Share the app 20 times",
    reward: 100,
    current: 0,
    total: 20,
  },
  {
    id: "first_case",
    title: "First case",
    desc: "Complete your first analysis",
    reward: 10,
    current: 0,
    total: 1,
  },
  {
    id: "investigator",
    title: "Investigator",
    desc: "Complete 5 analyses",
    reward: 25,
    current: 1,
    total: 5,
  },
  {
    id: "detective",
    title: "Detective",
    desc: "Complete 10 analyses",
    reward: 50,
    current: 1,
    total: 10,
  },
  {
    id: "master",
    title: "Master",
    desc: "Complete 25 analyses",
    reward: 100,
    current: 1,
    total: 25,
  },
];

export default function RewardsClient() {
  const credits = useCreditsStore((s) => s.credits);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <MatrixCanvas
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        opacity={0.22}
      />

      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-[900px] items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/55"
          >
            <ArrowLeft className="h-5 w-5 text-white/80" />
          </Link>

          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-white/80" />
            <span className="text-xs font-semibold tracking-[0.2em] text-white/80">
              REWARDS
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
            <Bolt className="h-4 w-4" />
            <span>{credits}</span>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[900px] px-4 pb-14 sm:px-6">
          <Card className="mt-4 border-white/10 bg-black/35 backdrop-blur-xl">
            <CardContent className="p-5">
              <h2 className="text-sm font-semibold text-white/85">
                Achievements
              </h2>
              <p className="mt-1 text-xs text-white/60">
                Earn credits by completing goals.
              </p>

              <div className="mt-4 space-y-3">
                {REWARDS.map((r) => {
                  const pct =
                    r.total > 0
                      ? Math.min(100, Math.round((r.current / r.total) * 100))
                      : 0;

                  return (
                    <div
                      key={r.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold">{r.title}</p>
                          <p className="mt-1 text-xs text-white/60">{r.desc}</p>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                          +{r.reward} credits
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                        <span>
                          {r.current} / {r.total}
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="mt-2 h-2 bg-white/10" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
