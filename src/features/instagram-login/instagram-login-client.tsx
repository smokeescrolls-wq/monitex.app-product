"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Facebook, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { instagramUsernameSchema } from "@/features/instagram/instagram.schemas";
import Image from "next/image";

type InstagramFeedUpstream = {
  perfil_buscado?: { username?: string };
  posts?: unknown[];
};

const useAccessTimer = () => {
  const startAccessTimer = () => {
    const now = new Date();
    const expiry = new Date(now.getTime() + 5 * 60_000);
    sessionStorage.setItem("stalkeaAccessExpiry", expiry.toISOString());
    sessionStorage.setItem("stalkeaAccessStart", now.toISOString());
  };

  return { startAccessTimer };
};

async function fetchFeedUpstream(
  username: string,
): Promise<InstagramFeedUpstream> {
  const validated = instagramUsernameSchema.parse(username);

  const res = await fetch(
    `/api/instagram-feed?username=${encodeURIComponent(validated)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }

  return (await res.json()) as InstagramFeedUpstream;
}

export default function InstagramLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username") ?? "";

  const usernameValidation = useMemo(
    () => instagramUsernameSchema.safeParse(usernameParam),
    [usernameParam],
  );

  const username = usernameValidation.success ? usernameValidation.data : "";

  const [displayPassword, setDisplayPassword] = useState("");
  const [crackingComplete, setCrackingComplete] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const [feedUpstream, setFeedUpstream] =
    useState<InstagramFeedUpstream | null>(null);
  const [feedLoaded, setFeedLoaded] = useState(false);
  const [feedError, setFeedError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const validationError = useMemo(() => {
    return usernameValidation.success ? null : "Invalid username";
  }, [usernameValidation.success]);

  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

  const generateRandomPassword = useCallback((length = 12) => {
    const masked = "*".repeat(Math.max(1, length - 1));
    const lastChar = chars[Math.floor(Math.random() * chars.length)];
    return masked + lastChar;
  }, []);

  const animatePassword = useCallback(() => {
    const duration = 8000;
    const interval = 80;
    let elapsed = 0;

    const timer = window.setInterval(() => {
      elapsed += interval;
      setAttemptCount(Math.floor(elapsed / 10));

      const length = 10 + Math.floor(Math.random() * 6);
      setDisplayPassword(generateRandomPassword(length));

      if (elapsed >= duration) {
        window.clearInterval(timer);
        setDisplayPassword("**********w");
        setCrackingComplete(true);
        setIsAnimating(false);
      }
    }, interval);

    return () => window.clearInterval(timer);
  }, [generateRandomPassword]);

  const fetchFeedData = useCallback(async () => {
    if (!username) {
      setFeedError(true);
      setFeedLoaded(true);
      return;
    }

    try {
      const upstream = await fetchFeedUpstream(username);

      const ok =
        Boolean(upstream?.perfil_buscado?.username) &&
        Array.isArray(upstream?.posts);
      if (!ok) {
        console.error("UPSTREAM SHAPE INVALID:", upstream);
        throw new Error("shape_invalid");
      }

      setFeedUpstream(upstream);
      setFeedLoaded(true);
    } catch (e) {
      console.error("Failed to fetch feed:", e);
      setFeedError(true);
      setFeedLoaded(true);
    }
  }, [username]);

  const canLogin =
    crackingComplete && feedLoaded && !feedError && !validationError;

  const getStatusTitle = () => {
    if (validationError) return "Validation error";
    if (feedError) return "Error loading data";
    if (crackingComplete && !feedLoaded) return "Loading feed...";
    if (crackingComplete && feedLoaded) return "Encryption broken";
    return "Breaking account encryption";
  };

  const getStatusMessage = () => {
    if (validationError) return validationError;
    if (feedError) return "Try again later";
    if (crackingComplete && !feedLoaded) return "Waiting for profile data...";
    if (crackingComplete && feedLoaded) return "Access granted for viewing.";
    return "Testing password combinations...";
  };

  const handleLogin = () => {
    if (!canLogin) return;

    const { startAccessTimer } = useAccessTimer();
    startAccessTimer();

    if (
      feedUpstream?.perfil_buscado?.username &&
      Array.isArray(feedUpstream?.posts)
    ) {
      sessionStorage.setItem("stalkeaFeedData", JSON.stringify(feedUpstream));
    }

    router.push(`/feed?username=${encodeURIComponent(username)}`);
  };

  useEffect(() => {
    if (!username) {
      setFeedError(true);
      setFeedLoaded(true);
      setIsAnimating(false);
      return;
    }

    const t = window.setTimeout(() => {
      animatePassword();
      fetchFeedData();
    }, 500);

    return () => window.clearTimeout(t);
  }, [animatePassword, fetchFeedData, username]);

  const formatAttemptCount = (count: number) =>
    new Intl.NumberFormat("en-US").format(count);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-20 px-8 relative overflow-hidden">
      <div className="mb-12">
        <div className="relative w-[175px] h-[52px]">
          <Image
            src="/assets/logo-insta.png"
            alt="Instagram"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      <div className="w-full max-w-[350px] flex flex-col items-center z-10">
        <div className="w-full mb-3">
          <Input
            type="text"
            value={username}
            readOnly
            className="w-full h-[48px] bg-[#121212] border border-[#363636] rounded-[3px] px-4 text-white text-sm placeholder-[#9A9AA6] focus:outline-none focus:border-[#555]"
          />
        </div>

        <div className="w-full mb-4">
          <div className="relative">
            <Input
              type="text"
              value={displayPassword}
              readOnly
              className="w-full h-[48px] bg-[#121212] border border-[#363636] rounded-[3px] px-4 text-white text-sm placeholder-[#9A9AA6] focus:outline-none focus:border-[#555] tracking-widest"
            />
          </div>

          <p className="text-[#ED4956] text-[14px] mt-4 text-center leading-tight">
            The password you entered is incorrect.
          </p>
        </div>

        <Card className="w-full bg-[#262626] border border-[#363636] rounded-[8px] p-3 mb-5">
          <CardContent className="flex items-center gap-3 p-0">
            <div className="w-8 h-8 rounded-full bg-transparent border border-white/20 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              {!crackingComplete ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <div className="w-full h-full bg-[#0095F6] flex items-center justify-center rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-white text-[13px] font-semibold leading-tight mb-0.5">
                {getStatusTitle()}
              </p>
              <p className="text-[#A8A8A8] text-[12px] leading-tight truncate">
                {getStatusMessage()}
              </p>
              {isAnimating ? (
                <p className="text-[#A8A8A8] text-[10px] mt-1">
                  Attempts: {formatAttemptCount(attemptCount)}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleLogin}
          disabled={!canLogin}
          className={`w-full h-[44px] rounded-[8px] cursor-pointer
             font-semibold text-white text-sm transition-all mb-5 ${
               canLogin
                 ? "bg-[#0095F6] hover:bg-[#1877F2] active:bg-[#1877F2]"
                 : "bg-[#0095F6]/30 text-white/50 cursor-not-allowed"
             }`}
        >
          {canLogin ? "Access Feed" : "Processing..."}
        </Button>

        <a href="#" className="text-[#0095F6] text-[12px] font-medium mb-8">
          Forgot password?
        </a>

        <div className="flex items-center gap-4 w-full mb-8 px-2">
          <div className="flex-1 h-[1px] bg-[#363636]" />
          <span className="text-[#A8A8A8] text-[12px] font-bold tracking-wider">
            OR
          </span>
          <div className="flex-1 h-[1px] bg-[#363636]" />
        </div>

        <Button
          variant="ghost"
          className="flex items-center justify-center cursor-pointer gap-2 text-[#0095F6] font-bold text-sm hover:bg-transparent"
        >
          <Facebook className="w-5 h-5 fill-current" />
          Log in with Facebook
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t border-[#363636] bg-black py-4 flex justify-center z-20">
        <p className="text-[#A8A8A8] text-[12px]">
          Don't have an account?{" "}
          <a href="#" className="text-[#0095F6] font-semibold ml-1">
            Sign up.
          </a>
        </p>
      </div>
    </div>
  );
}
