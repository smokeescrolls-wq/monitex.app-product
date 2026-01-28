import { Suspense } from "react";
import { headers } from "next/headers";
import { CtaTrackingScripts } from "@/features/cta/cta-tracking-script";
import CtaClient from "@/features/cta/cta.client";

export default async function Page() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <CtaTrackingScripts nonce={nonce} />

      <Suspense fallback={<CtaSkeleton />}>
        <CtaClient />
      </Suspense>
    </>
  );
}

function CtaSkeleton() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[550px] border-x border-gray-800 shadow-2xl">
        <div className="h-screen flex items-center justify-center text-sm text-white/70">
          Loading…
        </div>
      </div>
    </div>
  );
}
