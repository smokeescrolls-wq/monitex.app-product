import { Suspense } from "react";
import InstagramLoginClient from "@/features/instagram-login/instagram-login-client";

export default function InstagramLoginPage() {
  return (
    <Suspense fallback={<div />}>
      <InstagramLoginClient />
    </Suspense>
  );
}
