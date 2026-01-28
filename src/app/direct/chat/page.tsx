import { Suspense } from "react";
import ChatRouteClient from "@/features/direct/chat-route.client";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ChatRouteClient />
    </Suspense>
  );
}
