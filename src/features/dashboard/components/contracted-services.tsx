"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { contractedServices } from "@/features/dashboard/dashboard.data";
import ServiceCard from "@/features/dashboard/components/service-card";

export function ContractedServices() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-violet-300" />
        <h2 className="text-sm font-semibold text-white/85">
          Serviços Contratados
        </h2>
      </div>

      <div className="grid gap-3">
        {contractedServices.map((item) => (
          <ServiceCard key={item.id} item={item} variant="contracted" />
        ))}
      </div>
    </div>
  );
}
