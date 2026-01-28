"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  serviceDialogModules,
  type ServiceKey,
} from "@/features/services/services.registry";
import { SERVICE_TITLES } from "@/features/services/services.meta";

export function ServiceDialogHost({
  serviceKey,
  children,
}: {
  serviceKey: ServiceKey;
  children: React.ReactNode;
}) {
  const Content = serviceDialogModules[serviceKey];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-[640px] border-white/10 bg-[#0b0b10] p-0 text-white">
        <DialogHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
          <DialogTitle className="text-sm font-semibold text-white/90">
            {SERVICE_TITLES[serviceKey]}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <Content serviceKey={serviceKey} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
