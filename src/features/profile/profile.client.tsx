"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bolt,
  Pencil,
  Sparkles,
  User,
  Trophy,
  Rocket,
  Target,
  Search,
  Crown,
  LogOut,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MatrixCanvas } from "@/components/matrix-canvas";
import { useCreditsStore } from "@/features/credits/credits.store";
import { logoutAction } from "@/features/auth/logout.actions";

type ProfileUser = { name: string; email: string };

function clampPct(v: number) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

function barClass() {
  return [
    "h-2 bg-white/10",
    "[&>div]:bg-violet-500",
    "[&>div]:shadow-[0_0_18px_rgba(139,92,246,0.35)]",
    "[&>div]:transition-all [&>div]:duration-700 [&>div]:ease-out",
    "[&>div]:rounded-full",
  ].join(" ");
}

function AchItem({
  icon,
  title,
  desc,
  reward,
  current,
  total,
  accent = "default",
  action,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  reward: number;
  current: number;
  total: number;
  accent?: "featured" | "default" | "locked";
  action?: { label: string; variant?: "gold" | "ghost" };
  disabled?: boolean;
}) {
  const pct = total > 0 ? clampPct((current / total) * 100) : 0;

  const shell =
    accent === "featured"
      ? "border-violet-500/25 bg-[linear-gradient(90deg,rgba(124,58,237,0.22),rgba(99,102,241,0.12),rgba(124,58,237,0.18))]"
      : "border-white/10 bg-black/25";

  const iconBox =
    accent === "featured"
      ? "bg-violet-500/12 text-violet-200 shadow-[0_0_22px_rgba(139,92,246,0.22)]"
      : accent === "locked"
        ? "bg-white/5 text-white/25"
        : "bg-white/5 text-white/70";

  return (
    <div
      className={[
        "rounded-2xl border p-4 transition",
        shell,
        disabled ? "opacity-60" : "hover:bg-white/[0.03]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={[
              "mt-0.5 grid h-10 w-10 place-items-center rounded-2xl border border-white/10",
              iconBox,
            ].join(" ")}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/90">{title}</p>
            <p className="mt-1 text-xs text-white/60">{desc}</p>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-white/45">
                <span>
                  {current} of {total}
                </span>
                <span>{pct}%</span>
              </div>

              <Progress value={pct} className={barClass()} />
            </div>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold text-white/70">
          +{reward} <Bolt className="h-3.5 w-3.5 text-violet-200" />
        </span>
      </div>

      {action ? (
        <div className="mt-4">
          <Button
            disabled={disabled}
            className={[
              "h-11 w-full rounded-2xl",
              action.variant === "gold"
                ? "bg-amber-500/90 text-black hover:bg-amber-500 shadow-[0_0_18px_rgba(245,158,11,0.22)]"
                : "bg-white/10 text-white hover:bg-white/15",
              disabled ? "opacity-60" : "",
            ].join(" ")}
          >
            {action.label}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default function ProfileClient({ user }: { user: ProfileUser }) {
  const credits = useCreditsStore((s) => s.credits);
  const level = useCreditsStore((s) => s.level);
  const xp = useCreditsStore((s) => s.xp);
  const xpTotal = useCreditsStore((s) => s.xpTotal);

  const pct = xpTotal > 0 ? clampPct((xp / xpTotal) * 100) : 0;

  const achievements = [
    {
      id: "ambassador",
      icon: <Rocket className="h-4 w-4" />,
      title: "Ambassador",
      desc: "Share the app 20 times",
      reward: 100,
      current: 0,
      total: 20,
      accent: "featured" as const,
      action: { label: "Share now", variant: "gold" as const },
      disabled: false,
    },
    {
      id: "first",
      icon: <Target className="h-4 w-4" />,
      title: "First case",
      desc: "Complete your first analysis",
      reward: 10,
      current: 0,
      total: 1,
      action: { label: "Redeem 10 credits", variant: "gold" as const },
      disabled: true,
    },
    {
      id: "investigator",
      icon: <Search className="h-4 w-4" />,
      title: "Investigator",
      desc: "Complete 5 analyses",
      reward: 25,
      current: 1,
      total: 5,
      disabled: true,
    },
    {
      id: "detective",
      icon: <Trophy className="h-4 w-4" />,
      title: "Detective",
      desc: "Complete 10 analyses",
      reward: 50,
      current: 1,
      total: 10,
      disabled: true,
    },
    {
      id: "master",
      icon: <Crown className="h-4 w-4" />,
      title: "Master",
      desc: "Complete 25 analyses",
      reward: 100,
      current: 1,
      total: 25,
      disabled: true,
    },
  ];

  const completedCount = achievements.filter(
    (a) => a.current >= a.total && a.total > 0,
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <MatrixCanvas
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        opacity={0.22}
      />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,1),rgba(0,0,0,0.25)_55%,rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.16),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.14),transparent_48%)]" />

      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-[860px] items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/55"
          >
            <ArrowLeft className="h-5 w-5 text-white/80" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-white/80" />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] text-white/80">
              PROFILE
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
            <Bolt className="h-4 w-4" />
            <span>{credits}</span>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[860px] px-4 pb-14 sm:px-6">
          <Card className="mt-4 border-white/10 bg-black/35 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-violet-500/35 bg-violet-500/10 shadow-[0_0_26px_rgba(139,92,246,0.20)]">
                      <User className="h-6 w-6 text-violet-200" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-black/50">
                      <Sparkles className="h-3.5 w-3.5 text-violet-200" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-white/90">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-xs text-violet-200 hover:bg-violet-500/15">
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-violet-500/10 text-violet-200 shadow-[0_0_18px_rgba(139,92,246,0.18)]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold">{level}</p>
                  <p className="text-xs text-white/60">Level</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-emerald-500/10 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.18)]">
                    <Bolt className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold">{credits}</p>
                  <p className="text-xs text-white/60">Credits</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                  <div className="mx-auto mb-2 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-amber-500/10 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.14)]">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold">{xp}</p>
                  <p className="text-xs text-white/60">XP</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Progress to Level {level + 1}</span>
                  <span>
                    {xp}/{xpTotal} XP
                  </span>
                </div>

                <Progress
                  value={pct}
                  className={["mt-2", barClass()].join(" ")}
                />

                <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
                  <span>Spend credits to gain XP</span>
                  <span>+50 credits on level up</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 border-white/10 bg-black/35 backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏅</span>
                  <p className="text-sm font-semibold text-white/90">
                    Achievements ({completedCount}/{achievements.length})
                  </p>
                </div>

                <Link
                  href="/rewards"
                  className="text-xs font-semibold text-violet-200 hover:text-violet-100"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                <AchItem
                  icon={<Rocket className="h-4 w-4" />}
                  title="Ambassador"
                  desc="Share the app 20 times"
                  reward={100}
                  current={0}
                  total={20}
                  accent="featured"
                  action={{ label: "Share now", variant: "gold" }}
                  disabled={false}
                />

                <AchItem
                  icon={<Target className="h-4 w-4" />}
                  title="First case"
                  desc="Complete your first analysis"
                  reward={10}
                  current={0}
                  total={1}
                  action={{ label: "Redeem 10 credits", variant: "gold" }}
                  disabled={true}
                />

                <AchItem
                  icon={<Search className="h-4 w-4" />}
                  title="Investigator"
                  desc="Complete 5 analyses"
                  reward={25}
                  current={1}
                  total={5}
                  disabled={true}
                />

                <AchItem
                  icon={<Trophy className="h-4 w-4" />}
                  title="Detective"
                  desc="Complete 10 analyses"
                  reward={50}
                  current={1}
                  total={10}
                  disabled={true}
                />

                <AchItem
                  icon={<Crown className="h-4 w-4" />}
                  title="Master"
                  desc="Complete 25 analyses"
                  reward={100}
                  current={1}
                  total={25}
                  disabled={true}
                />
              </div>

              <form action={logoutAction} className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
