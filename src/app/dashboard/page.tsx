"use client";

import Image from "next/image";
import { Menu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MatrixCanvas } from "@/components/matrix-canvas";
import { ContractedServices } from "@/features/dashboard/components/contracted-services";
import { AvailableServices } from "@/features/dashboard/components/available-services";
import { DashboardHero } from "@/features/dashboard/components/dashboard-hero";
import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <MatrixCanvas
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        opacity={0.22}
      />

      <div className="pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,1),rgba(0,0,0,0.25)_55%,rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.16),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.14),transparent_48%)]" />

      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <Image
                src="/assets/logo-vert-transparente.png"
                alt="Monitex"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <span className="text-xs font-semibold tracking-[0.2em] text-white/80">
              MONITEX.APP
            </span>
          </div>

          <button className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/55">
            <Menu className="h-5 w-5 text-white/80" />
          </button>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto w-full max-w-[1100px] px-4 pb-14 sm:px-6">
          <div className="mt-4">
            <DashboardHero />
          </div>

          <div className="mt-6">
            <ContractedServices />
          </div>

          <div className="mt-5">
            <AvailableServices />
          </div>

          <div className="mt-10">
            <Card className="border-white/10 bg-black/35 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="px-6 py-8 text-center">
                  <div className="mx-auto mb-3 flex items-center justify-center gap-2">
                    <div className="relative h-6 w-6">
                      <Image
                        src="/assets/logo-vert-transparente.png"
                        alt="Monitex"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs font-semibold tracking-[0.2em] text-white/70">
                      MONITEX.APP
                    </span>
                  </div>

                  <p className="mx-auto max-w-[52ch] text-xs leading-relaxed text-white/60 sm:text-sm">
                    A service and analysis platform with a mobile-first
                    experience and security by default.
                  </p>

                  <div className="mt-5 flex items-center justify-center gap-3 text-xs text-white/60">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      SSL Certified
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      100% Secure Site
                    </span>
                  </div>

                  <div className="mt-6">
                    <p className="text-[11px] font-semibold text-white/55">
                      Secure payments with the technology
                    </p>

                    <div className="mt-3 flex items-center justify-center">
                      <div className="relative h-6 w-[190px] sm:h-7 sm:w-[220px]">
                        <Image
                          src="/assets/formas-pagamento.png"
                          alt="Payment Methods"
                          fill
                          className="object-contain opacity-90"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <DashboardFooter />
              </CardContent>
            </Card>

            <div className="mt-6 pb-10 text-center text-[10px] text-white/35">
              © 2026 Monitex — All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
