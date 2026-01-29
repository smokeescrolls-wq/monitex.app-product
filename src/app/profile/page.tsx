import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileClient from "@/features/profile/profile.client";

export default async function ProfilePage() {
  const authDisabled =
    (process.env.AUTH_DISABLED ?? "false").toLowerCase() === "true";

  if (authDisabled) {
    return (
      <ProfileClient user={{ name: "Agent", email: "agent@monitex.app" }} />
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth/login?redirect=/profile");

  const name =
    (data.user.user_metadata?.full_name as string | undefined) ??
    data.user.email?.split("@")[0] ??
    "User";

  return <ProfileClient user={{ name, email: data.user.email ?? "" }} />;
}
