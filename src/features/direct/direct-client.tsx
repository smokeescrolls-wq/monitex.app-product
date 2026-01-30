"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { ArrowLeft, Camera, Plus, SquarePen, Video } from "lucide-react";
import {
  instagramFeedUpstreamResponseSchema,
  instagramUsernameSchema,
} from "@/features/instagram/instagram.schemas";
import { AvatarCircle } from "@/features/direct/components/avatar-circle";
import {
  getInboxConversations,
  proxyImage,
  setSelectedConversation,
} from "@/features/direct/direct.utils";
import { PaywallModal } from "@/features/direct/components/paywall-modal";
import { PreviewUpgradeCard } from "@/features/direct/components/preview-upgrade-card";
import { persistRtkFromUrl } from "@/features/tracking/rtk.client";
import { buildCtaUrl } from "@/features/cta/cta-url.client";

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

function CircleSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={["absolute inset-0 bg-white/10 animate-pulse", className].join(
        " ",
      )}
    />
  );
}

const RANDOM_PEOPLE = [
  { name: "David Miller", avatar: "https://i.pravatar.cc/150?img=8" },
  { name: "Olivia Wilson", avatar: "https://i.pravatar.cc/150?img=54" },
  { name: "Robert Moore", avatar: "https://i.pravatar.cc/150?img=17" },
  { name: "Ava Taylor", avatar: "https://i.pravatar.cc/150?img=41" },
  { name: "Pettra Anderson", avatar: "https://i.pravatar.cc/150?img=19" },
  { name: "Isabella Thomas", avatar: "https://i.pravatar.cc/150?img=44" },
  { name: "William Jackson", avatar: "https://i.pravatar.cc/150?img=22" },
  { name: "Mia White", avatar: "https://i.pravatar.cc/150?img=39" },
  { name: "Christopher Harris", avatar: "https://i.pravatar.cc/150?img=15" },
  { name: "Joseph Thompson", avatar: "https://i.pravatar.cc/150?img=23" },
  { name: "Amelia Garcia", avatar: "https://i.pravatar.cc/150?img=37" },
  { name: "Daniel Martinez", avatar: "https://i.pravatar.cc/150?img=29" },
  { name: "Harper Robinson", avatar: "https://i.pravatar.cc/150?img=42" },
  { name: "Thomas Clark", avatar: "https://i.pravatar.cc/150?img=31" },
  { name: "Evelyn Rodriguez", avatar: "https://i.pravatar.cc/150?img=48" },
];

function looksLikeMaskedUserTitle(t: string) {
  const v = (t || "").trim().toLowerCase();
  return v.startsWith("us") && v.includes("*");
}

function mask4(name: string) {
  const clean = (name || "").trim();
  if (!clean) return "User*******";
  return `${clean.slice(0, 4)}*******`;
}

type InboxConversation = ReturnType<typeof getInboxConversations>[number];

type DecoratedConversation = InboxConversation & {
  isClickable: boolean;
  isUnread: boolean;
};

function readReadMap(): Record<string, boolean> {
  try {
    const raw = sessionStorage.getItem("stalkeaReadMap");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, boolean>;
  } catch {
    return {};
  }
}

function writeReadMap(map: Record<string, boolean>) {
  try {
    sessionStorage.setItem("stalkeaReadMap", JSON.stringify(map));
  } catch {}
}

type AvatarState = { loaded?: boolean; failed?: boolean };

export default function DirectClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameRaw = searchParams.get("username") ?? "";

  useEffect(() => {
    persistRtkFromUrl(searchParams);
  }, [searchParams]);

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

  const [readMap, setReadMap] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    return readReadMap();
  });

  const [avatarState, setAvatarState] = useState<Record<string, AvatarState>>(
    {},
  );

  const markLoaded = (id: string) => {
    setAvatarState((prev) =>
      prev[id]?.loaded
        ? prev
        : { ...prev, [id]: { ...prev[id], loaded: true } },
    );
  };

  const markFailed = (id: string) => {
    setAvatarState((prev) =>
      prev[id]?.failed
        ? prev
        : { ...prev, [id]: { ...prev[id], failed: true } },
    );
  };

  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallCtx, setPaywallCtx] = useState("action");

  const openPaywall = useCallback((ctx: string) => {
    setPaywallCtx(ctx);
    setPaywallOpen(true);
  }, []);

  const paywallTitle = useMemo(() => {
    if (paywallCtx.startsWith("inbox:")) return "Conversation blocked";
    if (paywallCtx === "requests") return "Requests blocked";
    if (paywallCtx === "video") return "Video blocked";
    if (paywallCtx === "new_message") return "New message blocked";
    if (paywallCtx === "meta_ai") return "Meta AI blocked";
    if (paywallCtx === "notes") return "Notes blocked";
    return "Action blocked";
  }, [paywallCtx]);

  const paywallDesc = useMemo(
    () => "To unlock this action, VIP access is required.",
    [],
  );

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
      unlockedCount: 18,
      searchedDisplayName,
    });
  }, [searchedDisplayName]);

  const conversationsDecorated = useMemo<DecoratedConversation[]>(() => {
    let randIdx = 0;
    const top4Unread = new Set([0, 1]);

    return conversations.map((c, idx) => {
      const isTop4 = idx < 4;
      const isClickable = isTop4;
      const alreadyRead = !!readMap[c.id];
      let isUnread = isTop4 ? !alreadyRead && top4Unread.has(idx) : false;

      if (!isTop4 && looksLikeMaskedUserTitle(c.maskedTitle)) {
        const pick = RANDOM_PEOPLE[randIdx % RANDOM_PEOPLE.length];
        randIdx += 1;

        const seeded = c.id
          .split("")
          .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
        const initialUnread = seeded % 10 < 4;
        isUnread = !alreadyRead && initialUnread;

        return {
          ...c,
          maskedTitle: mask4(pick.name),
          avatarUrl: `/api/image-proxy?url=${encodeURIComponent(pick.avatar)}`,
          isClickable: false,
          isUnread,
        };
      }

      return {
        ...c,
        maskedTitle: mask4(c.maskedTitle),
        isClickable,
        isUnread,
      };
    });
  }, [conversations, readMap]);

  const goBack = () => {
    router.push(
      `/feed?username=${encodeURIComponent(username || usernameRaw)}`,
    );
  };

  const openChat = (id: string) => {
    const c = conversations.find((x) => x.id === id);
    if (!c) return;

    setReadMap((prev) => {
      const next = { ...prev, [id]: true };
      writeReadMap(next);
      return next;
    });

    setSelectedConversation(c);

    router.push(
      `/direct/chat?username=${encodeURIComponent(username || "")}&chatId=${encodeURIComponent(
        c.id,
      )}`,
    );
  };

  const userProfilePic = useMemo(() => {
    const url = data?.perfil_buscado?.profile_pic_url ?? "";
    return url ? proxyImage(url) : "";
  }, [data]);

  const rawProfilePic = useMemo(() => {
    const url = data?.perfil_buscado?.profile_pic_url ?? "";
    return url || "";
  }, [data]);

  const ctaHref = useMemo(() => {
    const u = (username || usernameRaw || "").trim();
    return buildCtaUrl({
      username: u,
      photoUrl: rawProfilePic || null,
      extra: { ts: String(Date.now()) },
    });
  }, [username, usernameRaw, rawProfilePic]);

  const notesList = useMemo(() => {
    const list = data?.lista_perfis_publicos ?? [];
    return list.slice(0, 7).map((profile: any, index: number) => ({
      username: String(profile.username ?? `user_${index}`),
      displayName: mask4(
        String(profile.full_name ?? profile.username ?? `User ${index}`),
      ),
      avatarSrc: proxyImage(String(profile.profile_pic_url ?? "")),
      noteText: NOTE_TEXTS[(index + 1) % NOTE_TEXTS.length],
    }));
  }, [data]);

  const goVip = useCallback(() => {
    const u = (username || usernameRaw || "").trim() || "user";
    const photo = data?.perfil_buscado?.profile_pic_url ?? "";

    try {
      sessionStorage.setItem(
        "stalkeaCtaProfile",
        JSON.stringify({ username: u, profile_pic_url: photo }),
      );
    } catch {}

    router.push(
      buildCtaUrl({
        username: u,
        photoUrl: photo || null,
        extra: { ts: String(Date.now()) },
      }),
    );
  }, [router, username, usernameRaw, data]);

  return (
    <div className="bg-black min-h-screen text-white flex justify-center px-6">
      <div className="bg-black h-screen w-full max-w-112.5 text-white flex flex-col font-sans overflow-hidden mx-auto relative shadow-2xl border-x border-gray-800">
        <PaywallModal
          open={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          onGoVip={goVip}
          title={paywallTitle}
          description={paywallDesc}
        />

        <header className="flex justify-between items-center px-4 py-3 bg-black z-50 shrink-0">
          <div className="flex items-center gap-4">
            <button type="button" onClick={goBack} aria-label="Back">
              <ArrowLeft className="w-7 h-7 cursor-pointer" />
            </button>
            <span className="text-xl font-bold tracking-tight">
              {username || "example_user"}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => openPaywall("video")}
              aria-label="Video"
            >
              <Video className="w-7 h-7 cursor-pointer" />
            </button>
            <button
              type="button"
              onClick={() => openPaywall("new_message")}
              aria-label="New message"
            >
              <SquarePen className="w-6 h-6 cursor-pointer" />
            </button>
          </div>
        </header>

        <div className="fixed left-1/2 -translate-x-1/2 bottom-[72px] w-full max-w-[550px] z-[90] px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <PreviewUpgradeCard
              username={username || usernameRaw || "user"}
              profilePicUrl={data?.perfil_buscado?.profile_pic_url ?? undefined}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide pt-2">
          <div className="px-4 mb-4">
            <button
              type="button"
              onClick={() => openPaywall("meta_ai")}
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
                type="button"
                className="flex flex-col items-center gap-2 min-w-18 relative shrink-0 cursor-pointer"
                onClick={() => openPaywall("notes")}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl rounded-bl-none text-[11px] bg-[#262626] text-gray-300 leading-tight z-10 text-center min-w-[86px] shadow-sm">
                  {NOTE_TEXTS[0][0]}
                  <br />
                  {NOTE_TEXTS[0][1]}
                </div>

                <div className="w-18 h-18 rounded-full relative overflow-hidden border border-gray-800 bg-white/5">
                  {loading || !userProfilePic ? <CircleSkeleton /> : null}
                  {userProfilePic ? (
                    <AvatarCircle
                      src={userProfilePic}
                      alt="Your note"
                      loading="eager"
                      forceSkeleton={false}
                      className="absolute inset-0"
                      imgClassName="w-full h-full object-cover blur-[2px]"
                    />
                  ) : null}

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
                  type="button"
                  className="flex flex-col items-center gap-2 min-w-[72px] relative shrink-0 cursor-pointer"
                  onClick={() => openPaywall("notes")}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl rounded-bl-none text-[11px] bg-[#262626] text-white leading-tight z-10 text-center min-w-[86px] shadow-sm">
                    {note.noteText[0]}
                    <br />
                    {note.noteText[1]}
                  </div>

                  <div className="w-[72px] h-[72px] rounded-full relative overflow-hidden border border-gray-800 bg-white/5">
                    {loading || !note.avatarSrc ? <CircleSkeleton /> : null}
                    {note.avatarSrc ? (
                      <AvatarCircle
                        src={note.avatarSrc}
                        alt={note.username}
                        forceSkeleton={false}
                        className="absolute inset-0"
                        imgClassName="w-full h-full object-cover blur-[2px]"
                      />
                    ) : null}
                  </div>

                  <span className="text-xs text-white truncate w-20 text-center">
                    {note.displayName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 mt-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-2xl">Messages</h2>
              <button
                type="button"
                onClick={() => openPaywall("requests")}
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
                conversationsDecorated.map((c, idx) => {
                  const isUnlocked = idx < 4;
                  const state = avatarState[c.id] ?? {};
                  const showSkeleton = !state.loaded;

                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => {
                        if (isUnlocked) {
                          openChat(c.id);
                          return;
                        }
                        openPaywall(`inbox:${c.id}`);
                      }}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 relative bg-white/5 border border-white/10">
                        {showSkeleton ? <CircleSkeleton /> : null}

                        {c.avatarUrl ? (
                          <img
                            src={c.avatarUrl}
                            alt={c.maskedTitle}
                            className={[
                              "absolute inset-0 w-full h-full object-cover blur-[2px]",
                              showSkeleton ? "opacity-0" : "opacity-100",
                            ].join(" ")}
                            loading="lazy"
                            onLoad={() => markLoaded(c.id)}
                            onError={() => {
                              markFailed(c.id);
                              markLoaded(c.id);
                            }}
                            draggable={false}
                          />
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
                            className={`${
                              c.isUnread
                                ? "font-extrabold text-white"
                                : "font-normal text-gray-400"
                            } truncate blur-[1.5px] select-none`}
                          >
                            {c.subtitle}
                          </span>
                          <span
                            className={`${
                              c.isUnread ? "text-white" : "text-gray-500"
                            }`}
                          >
                            · {c.timeLabel}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        {c.isUnread ? (
                          <div className="w-2.5 h-2.5 bg-[#0095f6] rounded-full" />
                        ) : (
                          <div className="w-2.5 h-2.5" />
                        )}
                        <Camera className="w-6 h-6 text-zinc-500" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="h-40" />
        </div>

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
