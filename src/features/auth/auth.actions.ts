"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "./auth.schemas";

type ActionState = { ok: true } | { ok: false; message: string };

async function getRedirectFromHeaders() {
  const h = await headers();
  const referer = h.get("referer") ?? "";

  try {
    const url = new URL(referer);
    const r = url.searchParams.get("redirect");
    if (!r) return null;
    if (!r.startsWith("/")) return null;
    if (r.startsWith("//")) return null;
    return r;
  } catch {
    return null;
  }
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Invalid data. Please check and try again." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error("[loginAction] signInWithPassword error:", error);
    return { ok: false, message: error.message ?? "Incorrect email address or password." };
  }

  const redirectTo = (await getRedirectFromHeaders()) ?? "/dashboard";
  redirect(redirectTo);
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    confirmEmail: String(formData.get("confirmEmail") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Invalid data. Please check and try again." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) {
    console.error("[registerAction] signUp error:", error);
    return { ok: false, message: error.message ?? "We were unable to create your account." };
  }

  redirect("/auth/login");
}
