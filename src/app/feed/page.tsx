import { Suspense } from "react";
import FeedClient from "@/features/feed/feed.client";

export default function Page() {
  return (
    <Suspense fallback={<FeedSkeleton />}>
      <FeedClient />
    </Suspense>
  );
}

function FeedSkeleton() {
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
