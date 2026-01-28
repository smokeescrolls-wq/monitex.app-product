import { Suspense } from "react";
import AnalysisClient from "@/features/analysis/analysis.client";

export default function Page() {
  return (
    <Suspense fallback={<AnalysisSkeleton />}>
      <AnalysisClient />
    </Suspense>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-125 rounded-3xl border border-white/10 bg-black/40 p-6">
        <div className="h-7 w-40 mx-auto rounded bg-white/10 animate-pulse" />
        <div className="mt-6 h-4 w-64 mx-auto rounded bg-white/10 animate-pulse" />
        <div className="mt-8 h-24 w-full rounded-xl bg-white/10 animate-pulse" />
        <div className="mt-4 h-12 w-full rounded-xl bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
