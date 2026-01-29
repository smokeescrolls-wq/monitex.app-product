"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "./auth.schemas";

type ActionState =
  | { ok: true }
  | { ok: false; message: string };

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

export async function loginAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Dados inválidos. Verifique e tente novamente." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: "E-mail ou senha incorretos." };
  }

  const redirectTo = (await getRedirectFromHeaders()) ?? "/dashboard";
  redirect(redirectTo);
}

export async function registerAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    confirmEmail: String(formData.get("confirmEmail") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, message: "Dados inválidos. Verifique e tente novamente." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return { ok: false, message: "Não foi possível criar sua conta. Tente outro e-mail." };
  }

  redirect("/auth/login");
}
