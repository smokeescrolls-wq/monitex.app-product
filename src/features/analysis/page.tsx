import { Suspense } from "react";
import AnalysisClient from "@/features/analysis/analysis.client";

export default function AnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Carregando…
        </div>
      }
    >
      <AnalysisClient />
    </Suspense>
  );
}
