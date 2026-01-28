"use client";

import { SERVICES } from "../services.constants";
import { ServiceCard } from "./service-card";

export function ServiceGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map((s) => (
        <ServiceCard key={s.key} service={s} />
      ))}
    </div>
  );
}
