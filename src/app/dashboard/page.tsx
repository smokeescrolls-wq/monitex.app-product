import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DashboardClient from "@/features/dashboard/dashboard.client";

export default async function DashboardPage() {
  const authDisabled =
    (process.env.AUTH_DISABLED ?? "false").toLowerCase() === "true";

  if (authDisabled) {
    return <DashboardClient userName="Agent" authDisabled={true} />;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth/login?redirect=/dashboard");

  const name =
    (data.user.user_metadata?.full_name as string | undefined) ??
    data.user.email?.split("@")[0] ??
    "User";

  return <DashboardClient userName={name} authDisabled={false} />;
}
