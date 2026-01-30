"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { MatrixCanvas } from "@/components/matrix-canvas";
import { TypewriterText, useTypewriter } from "@/components/typewriter";

import { loginSchema, type LoginInput } from "@/features/auth/auth.schemas";
import { loginAction } from "@/features/auth/auth.actions";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const title = "Open Monitex.ai";
  const subtitle = "Log in with your account to continue.";

  const titleCount = useTypewriter(title.length, {
    startDelayMs: 220,
    minDelayMs: 18,
    maxDelayMs: 38,
  });
  const subtitleEnabled = titleCount >= title.length;
  const subtitleCount = useTypewriter(subtitle.length, {
    enabled: subtitleEnabled,
    startDelayMs: 160,
    minDelayMs: 16,
    maxDelayMs: 30,
  });

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "exemple@exemple.com", password: "" },
    mode: "onChange",
  });

  const canSubmit = useMemo(() => {
    const v = form.getValues();
    return v.email.length > 3 && v.password.length >= 8 && !pending;
  }, [form, pending]);

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    setPending(true);

    const fd = new FormData();
    fd.set("email", values.email);
    fd.set("password", values.password);

    const res = await loginAction({ ok: true }, fd);
    if (res && !res.ok) setServerError(res.message);

    setPending(false);
  }

  useEffect(() => {
    setServerError(null);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      <MatrixCanvas
        className="fixed inset-0 h-full w-full pointer-events-none"
        opacity={0.22}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.18),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.16),transparent_48%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[560px] flex-col items-center justify-center px-6 py-12">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="relative h-16 w-16">
            <Image
              src="/assets/logo-vert-transparente.png"
              alt="Monitex"
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
          <span className="font-black tracking-widest text-white/80">
            MONITEX.APP
          </span>
        </div>

        <Card className="w-full rounded-[28px] border-white/10 bg-black/55 py-2 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <CardContent className="p-7 sm:p-8">
            <div className="text-center">
              <h1 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
                <TypewriterText
                  text={title}
                  count={titleCount}
                  showCaret={titleCount < title.length}
                />
              </h1>

              <p className="mt-2 text-sm text-white/70">
                <TypewriterText
                  text={subtitle}
                  count={subtitleCount}
                  showCaret={subtitleEnabled && subtitleCount < subtitle.length}
                  caretClassName="ml-1 inline-block w-[0.5ch] animate-pulse text-white/40"
                />
              </p>
            </div>

            <div className="mt-7">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45">
                              <Mail className="h-4 w-4" />
                            </span>
                            <Input
                              {...field}
                              inputMode="email"
                              className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35 focus-visible:ring-violet-500/35"
                              placeholder="youremail@email.com"
                              autoComplete="email"
                              autoCorrect="off"
                              autoCapitalize="none"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45">
                              <Lock className="h-4 w-4" />
                            </span>

                            <Input
                              {...field}
                              type={showPw ? "text" : "password"}
                              className="h-12 border-white/10 bg-white/5 pl-10 pr-11 text-white placeholder:text-white/35 focus-visible:ring-violet-500/35"
                              placeholder="tour password"
                              autoComplete="current-password"
                            />

                            <button
                              type="button"
                              onClick={() => setShowPw((v) => !v)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-white/55 hover:text-white/80"
                              aria-label={
                                showPw ? "hide password" : "show password"
                              }
                            >
                              {showPw ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {serverError ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {serverError}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || pending}
                    className="h-12 w-full rounded-xl bg-linear-to-r from-[#7C4DFF] to-[#9A6CFF] text-sm font-extrabold shadow-[0_10px_35px_rgba(124,77,255,0.35)] hover:opacity-95 disabled:opacity-40"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {pending ? "Looading..." : "Login"}
                  </Button>

                  <p className="text-center text-xs text-white/55">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="font-bold text-violet-300 hover:text-violet-200"
                    >
                      Create a account
                    </Link>
                  </p>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
