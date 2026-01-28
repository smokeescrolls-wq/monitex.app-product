import { Suspense } from "react";
import DirectClient from "@/features/direct/direct-client";

export default function DirectPage() {
  return (
    <Suspense fallback={<div />}>
      <DirectClient />
    </Suspense>
  );
}
