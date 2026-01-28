"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  ArrowLeft,
  Camera,
  Clock,
  Lock,
  Plus,
  SquarePen,
  Video,
  Zap,
} from "lucide-react";
import {
  instagramFeedUpstreamResponseSchema,
  instagramUsernameSchema,
} from "@/features/instagram/instagram.schemas";
import { AvatarCircle } from "@/features/direct/components/avatar-circle";
import { PaywallModal } from "@/features/direct/components/paywall-modal";
import {
  getInboxConversations,
  proxyImage,
  setSelectedConversation,
} from "@/features/direct/direct.utils";

type InstagramFeedUpstream = z.infer<
  typeof instagramFeedUpstreamResponseSchema
>;

const NOTE_TEXTS: Array<[string, string]> = [
  ["Tell the", "news"],
  ["Lazy today", "😴😴"],
  ["Heart to", "Group gu…"],
  ["The urge", "for 3 😈"],
  ["Good morning", "🙏"],
  ["Miss", "🏖️"],
  ["Full focus", "💻"],
  ["Let's go", "workout 🏋️"],
];

function readFeedCache(): InstagramFeedUpstream | null {
  try {
    const raw = sessionStorage.getItem("stalkeaFeedData");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const validated = instagramFeedUpstreamResponseSchema.safeParse(parsed);
    if (!validated.success) return null;
    return validated.data;
  } catch {
    return null;
  }
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 rounded-full bg-white/10 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
        <div className="mt-2 h-3 w-56 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="w-6 h-6 bg-white/10 rounded animate-pulse" />
    </div>
  );
}

export default function DirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameRaw = searchParams.get("username") ?? "";

  const username = useMemo(() => {
    const parsed = instagramUsernameSchema.safeParse(usernameRaw);
    return parsed.success ? parsed.data : "";
  }, [usernameRaw]);

  const [data, setData] = useState<InstagramFeedUpstream | null>(() => {
    if (typeof window === "undefined") return null;
    return readFeedCache();
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return readFeedCache() ? false : true;
  });

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const readRemaining = () => {
      const expiry = sessionStorage.getItem("stalkeaAccessExpiry");
      if (!expiry) return 0;
      const ms = new Date(expiry).getTime() - Date.now();
      return Math.max(0, ms);
    };

    setRemainingMs(readRemaining());

    const id = window.setInterval(() => {
      setRemainingMs(readRemaining());
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const timerString = useMemo(() => {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [remainingMs]);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `/api/instagram-feed?username=${encodeURIComponent(username)}`,
          { method: "GET", cache: "no-store", signal: ac.signal },
        );

        if (!res.ok) throw new Error("request_failed");
        const json = await res.json();

        const validated = instagramFeedUpstreamResponseSchema.safeParse(json);
        if (!validated.success) throw new Error("shape_invalid");

        setData(validated.data);
        sessionStorage.removeItem("stalkeaFeedData");
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setData((prev) => prev ?? null);
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [username]);

  const searchedDisplayName = useMemo(() => {
    const fullName = data?.perfil_buscado?.full_name ?? "";
    const u = username || usernameRaw || "";
    return (fullName && fullName.trim().length > 0 ? fullName : u) || "User";
  }, [data, username, usernameRaw]);

  const conversations = useMemo(() => {
    return getInboxConversations({
      total: 18,
      unlockedCount: 4,
      searchedDisplayName,
    });
  }, [searchedDisplayName]);

  const goBack = () => {
    router.push(
      `/feed?username=${encodeURIComponent(username || usernameRaw)}`,
    );
  };

  const goVip = () => {
    router.push(`/cta?username=${encodeURIComponent(username || "")}`);
    setPaywallOpen(false);
  };

  const openChat = (id: string) => {
    const c = conversations.find((x) => x.id === id);
    if (!c) return;

    if (c.locked) {
      setPaywallOpen(true);
      return;
    }

    setSelectedConversation(c);
    router.push(
      `/direct/chat?username=${encodeURIComponent(
        username || "",
      )}&chatId=${encodeURIComponent(c.id)}`,
    );
  };

  const userProfilePic = useMemo(() => {
    const url = data?.perfil_buscado?.profile_pic_url ?? "";
    return url ? proxyImage(url) : "/placeholder-avatar.png";
  }, [data]);

  const notesList = useMemo(() => {
    const list = data?.lista_perfis_publicos ?? [];
    return list.slice(0, 7).map((profile: any, index: number) => ({
      username: String(profile.username ?? `user_${index}`),
      masked:
        String(profile.username ?? `user_${index}`).substring(0, 3) + "*******",
      avatarSrc: proxyImage(String(profile.profile_pic_url ?? "")),
      noteText: NOTE_TEXTS[(index + 1) % NOTE_TEXTS.length],
    }));
  }, [data]);

  return (
    <div className="bg-black min-h-screen text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 text-white flex flex-col font-sans overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        <header className="flex justify-between items-center px-4 py-3 bg-black z-50 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={goBack} aria-label="Back">
              <ArrowLeft className="w-7 h-7 cursor-pointer" />
            </button>
            <span className="text-xl font-bold tracking-tight">
              {username || "example_user"}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => setPaywallOpen(true)} aria-label="Video">
              <Video className="w-7 h-7 cursor-pointer" />
            </button>
            <button
              onClick={() => setPaywallOpen(true)}
              aria-label="New message"
            >
              <SquarePen className="w-6 h-6 cursor-pointer" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide pt-2">
          <div className="px-4 mb-4">
            <button
              onClick={() => setPaywallOpen(true)}
              className="w-full text-left bg-[#262626] rounded-2xl flex items-center px-3 py-3 gap-3 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#0064e0] via-[#cd2e76] to-[#d62976] flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-[#262626] rounded-full" />
              </div>
              <span className="text-gray-400 text-[15px]">
                Interact with Meta AI or search
              </span>
            </button>
          </div>

          <div className="mb-2">
            <div className="flex overflow-x-auto gap-5 px-4 scrollbar-hide pt-8 pb-2">
              <button
                className="flex flex-col items-center gap-2 min-w-18 relative shrink-0"
                onClick={() => setPaywallOpen(true)}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl rounded-bl-none text-[11px] bg-[#262626] text-gray-300 leading-tight z-10 text-center min-w-[86px] shadow-sm">
                  {NOTE_TEXTS[0][0]}
                  <br />
                  {NOTE_TEXTS[0][1]}
                </div>

                <div className="w-18 h-18 rounded-full relative overflow-hidden border border-gray-800">
                  <AvatarCircle
                    src={userProfilePic}
                    alt="Your note"
                    loading="eager"
                    forceSkeleton={loading}
                    className="absolute inset-0"
                    imgClassName="w-full h-full object-cover"
                  />
                  {loading ? null : (
                    <div className="absolute bottom-0 right-0 bg-[#262626] rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <span className="text-xs text-zinc-400">Your note</span>
              </button>

              {notesList.map((note, idx) => (
                <button
                  key={`${note.username}-${idx}`}
                  className="flex flex-col items-center gap-2 min-w-[72px] relative shrink-0"
                  onClick={() => setPaywallOpen(true)}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl rounded-bl-none text-[11px] bg-[#262626] text-white leading-tight z-10 text-center min-w-[86px] shadow-sm">
                    {note.noteText[0]}
                    <br />
                    {note.noteText[1]}
                  </div>

                  <div className="w-[72px] h-[72px] rounded-full relative overflow-hidden border border-gray-800">
                    <AvatarCircle
                      src={note.avatarSrc}
                      alt={note.username}
                      forceSkeleton={loading}
                      className="absolute inset-0"
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>

                  <span className="text-xs text-white truncate w-20 text-center">
                    {note.masked}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 mt-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl">Messages</h2>
              <button
                onClick={() => setPaywallOpen(true)}
                className="text-[#0095f6] text-sm font-semibold cursor-pointer"
              >
                Requests (4)
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => openChat(c.id)}
                  >
                    <div className="w-14 h-14 rounded-full bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                      <AvatarCircle
                        src={c.avatarUrl}
                        alt={c.maskedTitle}
                        className="absolute inset-0"
                        imgClassName="w-full h-full object-cover"
                        blur
                      />

                      {c.locked ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Lock className="w-5 h-5 text-white/70" />
                        </div>
                      ) : null}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="font-normal text-white truncate">
                          {c.maskedTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <span
                          className={`${c.unread && !c.locked ? "font-bold text-white" : ""} truncate ${c.locked ? "blur-sm text-white/40" : ""}`}
                        >
                          {c.subtitle}
                        </span>
                        <span className={`${c.locked ? "text-white/40" : ""}`}>
                          · {c.timeLabel}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      {!c.locked && c.unread ? (
                        <div className="w-2.5 h-2.5 bg-[#0095f6] rounded-full" />
                      ) : (
                        <div className="w-2.5 h-2.5" />
                      )}
                      <Camera
                        className={`w-6 h-6 ${c.locked ? "text-white/25" : "text-zinc-500"}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="h-40" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <div className="bg-gradient-to-r from-[#6e4ef2] to-[#9834db] rounded-xl p-4 shadow-lg z-50">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Preview available for {timerString}</span>
                <Clock className="w-3.5 h-3.5 opacity-80" />
              </div>
              <button
                onClick={goVip}
                className="bg-white cursor-pointer text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
              >
                Become VIP
              </button>
            </div>
            <p className="text-[11px] text-white/90 leading-snug pr-20">
              You earned 10 minutes to test our tool for free, but to unlock all
              features and have permanent access you need to be a VIP member.
            </p>
          </div>
        </div>

        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onGoVip={goVip}
          title="Action blocked"
          description="To access locked conversations, listen to audios and unlock content, VIP is required."
        />

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}
