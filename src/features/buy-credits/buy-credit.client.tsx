"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bolt,
  Sparkles,
  ShieldCheck,
  Zap,
  Infinity,
} from "lucide-react";
import { MatrixCanvas } from "@/components/matrix-canvas";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreditsStore } from "@/features/credits/credits.store";

type Pack = {
  id:
    | "credits_100"
    | "credits_600"
    | "credits_1500"
    | "credits_5000"
    | "credits_10000";
  credits: number;
  bonus: number;
  price: number;
  oldPrice?: number;
  badge?: "Best seller" | "Best value";
  accent: "cyan" | "emerald" | "pink" | "blue" | "violet";
};

const PACKS: Pack[] = [
  { id: "credits_100", credits: 100, bonus: 0, price: 29.9, accent: "cyan" },
  {
    id: "credits_600",
    credits: 600,
    bonus: 100,
    price: 79.9,
    oldPrice: 209.3,
    accent: "emerald",
  },
  {
    id: "credits_1500",
    credits: 1500,
    bonus: 300,
    price: 149.9,
    oldPrice: 538.2,
    badge: "Best seller",
    accent: "pink",
  },
  {
    id: "credits_5000",
    credits: 5000,
    bonus: 1000,
    price: 299.9,
    oldPrice: 1794.0,
    accent: "blue",
  },
  {
    id: "credits_10000",
    credits: 10000,
    bonus: 5000,
    price: 499.9,
    oldPrice: 4485.0,
    badge: "Best value",
    accent: "violet",
  },
];

function money(v: number) {
  return `$ ${v.toFixed(2).replace(".", ",")}`;
}

function accentClasses(a: Pack["accent"]) {
  switch (a) {
    case "cyan":
      return {
        iconBg: "bg-cyan-500/15",
        iconFg: "text-cyan-200",
        border: "border-cyan-400/25",
        glow: "shadow-[0_0_28px_rgba(34,211,238,0.18)]",
        btn: "bg-cyan-500 text-black hover:bg-cyan-400",
      };
    case "emerald":
      return {
        iconBg: "bg-emerald-500/15",
        iconFg: "text-emerald-200",
        border: "border-emerald-400/25",
        glow: "shadow-[0_0_28px_rgba(16,185,129,0.18)]",
        btn: "bg-emerald-500 text-black hover:bg-emerald-400",
      };
    case "pink":
      return {
        iconBg: "bg-fuchsia-500/15",
        iconFg: "text-fuchsia-200",
        border: "border-fuchsia-400/25",
        glow: "shadow-[0_0_30px_rgba(236,72,153,0.20)]",
        btn: "bg-fuchsia-500 text-white hover:bg-fuchsia-400",
      };
    case "blue":
      return {
        iconBg: "bg-blue-500/15",
        iconFg: "text-blue-200",
        border: "border-blue-400/25",
        glow: "shadow-[0_0_28px_rgba(59,130,246,0.18)]",
        btn: "bg-blue-500 text-white hover:bg-blue-400",
      };
    default:
      return {
        iconBg: "bg-violet-500/15",
        iconFg: "text-violet-200",
        border: "border-violet-400/25",
        glow: "shadow-[0_0_30px_rgba(139,92,246,0.20)]",
        btn: "bg-violet-500 text-white hover:bg-violet-400",
      };
  }
}

function checkoutUrl(productId: Pack["id"]) {
  const map: Record<string, string | undefined> = {
    credits_100: process.env.NEXT_PUBLIC_D24_CREDITS_100_URL,
    credits_600: process.env.NEXT_PUBLIC_D24_CREDITS_600_URL,
    credits_1500: process.env.NEXT_PUBLIC_D24_CREDITS_1500_URL,
    credits_5000: process.env.NEXT_PUBLIC_D24_CREDITS_5000_URL,
    credits_10000: process.env.NEXT_PUBLIC_D24_CREDITS_10000_URL,
  };

  return map[productId] ?? "#";
}

export default function BuyCreditsClient() {
  const credits = useCreditsStore((s) => s.credits);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <MatrixCanvas
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        opacity={0.22}
      />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,1),rgba(0,0,0,0.25)_55%,rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.16),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.14),transparent_48%)]" />

      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-[980px] items-center justify-between px-4 py-4 sm:px-6">
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
              BUY CREDITS
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
            <Bolt className="h-4 w-4 text-violet-200" />
            <span>{credits}</span>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[980px] px-4 pb-14 sm:px-6">
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-200 shadow-[0_0_22px_rgba(139,92,246,0.14)]">
              <Sparkles className="h-4 w-4" />
              Recharge your credits
            </span>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              Choose your package
            </h1>
            <p className="mt-2 text-sm text-white/60">
              The more you buy, the more you save.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PACKS.map((p) => {
              const a = accentClasses(p.accent);
              const totalCredits = p.credits + p.bonus;

              return (
                <Card
                  key={p.id}
                  className={[
                    "relative overflow-hidden border-white/10 bg-black/35 backdrop-blur-xl",
                    "transition-all duration-200",
                    "hover:-translate-y-[2px] hover:border-violet-400/25",
                    "hover:shadow-[0_18px_55px_rgba(0,0,0,0.55),0_0_28px_rgba(139,92,246,0.22)]",
                    p.badge ? a.border : "",
                  ].join(" ")}
                >
                  <CardContent className="p-5 sm:p-6">
                    {p.badge ? (
                      <span className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80">
                        {p.badge}
                      </span>
                    ) : null}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            "grid h-11 w-11 place-items-center rounded-2xl border border-white/10",
                            a.iconBg,
                            a.glow,
                          ].join(" ")}
                        >
                          <Bolt className={["h-5 w-5", a.iconFg].join(" ")} />
                        </div>

                        <div>
                          <p className="text-2xl font-black text-white">
                            {p.credits.toLocaleString("en-US")}
                            <span className="ml-2 text-sm font-semibold text-white/55">
                              credits
                            </span>
                          </p>
                          <p className="text-xs text-white/55">
                            {p.bonus > 0
                              ? `+ ${p.bonus.toLocaleString("en-US")} bonus credits`
                              : "Credits never expire"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        {p.oldPrice ? (
                          <p className="text-xs text-white/35 line-through">
                            {money(p.oldPrice)}
                          </p>
                        ) : (
                          <p className="text-xs text-white/35">&nbsp;</p>
                        )}
                        <p className="text-3xl font-black text-white">
                          {money(p.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-white/65">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                        Credits never expire
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                        Access to all services
                      </div>
                      {p.bonus > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                          {totalCredits.toLocaleString("en-US")} total credits
                        </div>
                      ) : null}
                    </div>

                    <Button
                      asChild
                      className={[
                        "mt-5 h-12 w-full rounded-2xl font-semibold",
                        a.btn,
                        "shadow-[0_14px_45px_rgba(0,0,0,0.45)]",
                      ].join(" ")}
                    >
                      <a
                        href={checkoutUrl(p.id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Buy now ✨
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card className="border-white/10 bg-black/25 backdrop-blur-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <ShieldCheck className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/85">
                    Secure payment
                  </p>
                  <p className="text-[11px] text-white/50">
                    Protected checkout
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/25 backdrop-blur-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <Zap className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/85">
                    Instant credits
                  </p>
                  <p className="text-[11px] text-white/50">
                    Auto applied via webhook
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/25 backdrop-blur-xl">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
                  <Infinity className="h-5 w-5 text-white/80" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/85">
                    Never expires
                  </p>
                  <p className="text-[11px] text-white/50">Use anytime</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-[10px] text-white/35">
            © 2026 Monitex — All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
