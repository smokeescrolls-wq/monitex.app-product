"use client";

import { useState } from "react";
import type { ServiceConfig } from "../services.types";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceLaunchDialog } from "./service-launch-dialog";

export function ServiceCard({ service }: { service: ServiceConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-left">
        <Card className="h-full rounded-2xl border-white/10 bg-[#0F0F13]/90 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-white/15">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div
                className={`grid size-10 place-items-center rounded-xl border border-white/10 ${service.accent.iconBg}`}
              >
                <span className={service.accent.iconFg}>{service.icon}</span>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${service.accent.pillBg} ${service.accent.pillFg} ${service.accent.pillBorder}`}
              >
                {service.startCostCredits === 0
                  ? "Grátis"
                  : `${service.startCostCredits} créditos`}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-base font-bold text-white">
                {service.title}
              </div>
              <div className="mt-1 text-sm text-white/65">
                {service.description}
              </div>
            </div>
          </CardContent>
        </Card>
      </button>

      <ServiceLaunchDialog
        open={open}
        onOpenChange={setOpen}
        service={service}
      />
    </>
  );
}
